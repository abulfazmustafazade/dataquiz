import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ChevronUp, ChevronDown, Home, Star, Check, Lock, Radio } from 'lucide-react';
import AnimatedBackground from '../../components/AnimatedBackground';
import BubbleCloud from './BubbleCloud';
import { crowdAPI } from '../../lib/crowdAPI';
import { genId } from '../../lib/utils';
import { sounds } from '../../lib/sounds';

export default function CrowdParticipantView({ pin, participantName, onHome }) {
  const [session, setSession] = useState(null);
  const [items, setItems] = useState([]);
  const [pollCounts, setPollCounts] = useState({});
  const [myVotes, setMyVotes] = useState({});           // {itemId: 1|-1}
  const [myPollVotes, setMyPollVotes] = useState({});    // {pollIndex: optionIdx}
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [sentIds, setSentIds] = useState(new Set());
  const [error, setError] = useState('');
  const userId = useRef(genId()).current;
  const unsubRef = useRef(null);

  useEffect(() => {
    // Load my previous item votes
    crowdAPI.getMyVotes(pin, userId).then(setMyVotes);

    unsubRef.current = crowdAPI.listen(pin, (data) => {
      if (!data) return;
      setSession(data);
      const raw = data.items ? Object.entries(data.items).map(([id, v]) => ({ id, ...v })) : [];
      const visible = raw.filter(i => !data.settings?.moderation || i.status === 'approved');
      const sorted = visible.sort((a, b) => {
        if (b.starred !== a.starred) return b.starred ? 1 : -1;
        return (b.votes || 0) - (a.votes || 0);
      });
      setItems(sorted);
      setPollCounts(data.pollCounts || {});

      // My poll votes, per poll question index
      const myPV = {};
      if (data.pollVotes) {
        Object.entries(data.pollVotes).forEach(([idx, votesForIdx]) => {
          if (votesForIdx?.[userId] !== undefined) myPV[idx] = votesForIdx[userId];
        });
      }
      setMyPollVotes(myPV);
    });
    return () => unsubRef.current?.();
  }, [pin, userId]);

  const isOpen = session?.status === 'open';
  const prompt = session?.prompt || {};
  const pollQuestionsLive = prompt.type === 'poll' ? (prompt.questions || []) : [];
  const currentPollIndex = prompt.currentIndex || 0;
  const currentPoll = pollQuestionsLive[currentPollIndex];
  const currentPollCounts = pollCounts[currentPollIndex] || {};
  const totalPollVotes = Object.values(currentPollCounts).reduce((s, c) => s + (c || 0), 0);

  const handleSend = async () => {
    if (!text.trim()) { setError('Boş göndəriş olmaz'); return; }
    if (!session || session.status === 'closed') { setError('Sessiya bağlanıb'); return; }
    setSending(true); setError('');
    const isAnon = session.settings?.moderation
      ? { status: 'pending' } : { status: 'approved' };
    const itemId = await crowdAPI.submit(pin, {
      text: text.trim(),
      authorId: userId,
      authorName: session.settings?.anonymous ? 'Anonim' : participantName,
      type: prompt.type || 'question',
      ...isAnon,
    });
    if (itemId) {
      setSentIds(s => new Set(s).add(itemId));
      setText('');
      sounds.correct();
    }
    setSending(false);
  };

  const handleVote = async (itemId, delta) => {
    const prev = myVotes[itemId] || 0;
    const newDelta = prev === delta ? 0 : delta; // toggle off
    setMyVotes(v => ({ ...v, [itemId]: newDelta }));
    sounds.click();
    await crowdAPI.vote(pin, itemId, userId, newDelta);
  };

  const handlePollVote = async (optionIdx) => {
    if (myPollVotes[currentPollIndex] === optionIdx) return; // already voted for this
    setMyPollVotes(v => ({ ...v, [currentPollIndex]: optionIdx }));
    sounds.click();
    await crowdAPI.pollVote(pin, userId, currentPollIndex, optionIdx);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-600 via-cyan-700 to-emerald-700 flex items-center justify-center">
        <AnimatedBackground variant="emerald" />
        <div className="text-white text-xl font-bold">Yüklənir...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 via-cyan-700 to-emerald-700 p-3 sm:p-5 relative">
      <AnimatedBackground variant="emerald" />
      <div className="max-w-2xl mx-auto relative z-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-4">
          <button onClick={onHome} className="text-white hover:bg-white/10 px-3 py-1.5 rounded-xl flex items-center gap-1 text-sm transition-colors">
            <Home size={16} /> Çıx
          </button>
          <div className="text-center flex-1 mx-4">
            <p className="text-white font-black truncate">{session.title}</p>
            <p className={`text-xs font-bold ${isOpen ? 'text-emerald-200' : 'text-rose-300'}`}>
              {isOpen ? '🟢 Açıq' : '🔴 Bağlı'}
            </p>
          </div>
          <div className="w-16" />
        </motion.div>

        {/* Current prompt */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-5 mb-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            {prompt.type === 'question' ? '❓ Sual' : prompt.type === 'idea' ? '💡 Brainstorm' : '📊 Sorğu'}
          </p>

          {prompt.type === 'poll' ? (
            <>
              {pollQuestionsLive.length > 1 && (
                <p className="text-xs text-gray-400 font-semibold mb-1">Sual {currentPollIndex + 1} / {pollQuestionsLive.length}</p>
              )}
              <p className="text-xl font-black text-gray-900 leading-snug">{currentPoll?.text}</p>

              {currentPoll?.options?.length > 0 && (
                <div className="mt-4 space-y-2">
                  {currentPoll.options.map((opt, i) => {
                    const count = currentPollCounts[i] || 0;
                    const pct = totalPollVotes ? Math.round((count / totalPollVotes) * 100) : 0;
                    const isSelected = myPollVotes[currentPollIndex] === i;
                    return (
                      <motion.button key={i} whileTap={{ scale: 0.97 }}
                        onClick={() => isOpen && handlePollVote(i)}
                        disabled={!isOpen}
                        className={`w-full text-left rounded-xl overflow-hidden border-2 transition-all ${isSelected ? 'border-teal-500' : 'border-gray-200'}`}>
                        <div className="relative p-3">
                          <div className="absolute inset-0 bg-teal-100 transition-all" style={{ width: `${pct}%` }} />
                          <div className="relative flex items-center justify-between">
                            <span className={`font-bold text-sm ${isSelected ? 'text-teal-700' : 'text-gray-800'}`}>{opt}</span>
                            <span className="font-black text-sm text-gray-600">{pct}% ({count})</span>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                  <p className="text-xs text-gray-400 text-right">Cəmi: {totalPollVotes} səs</p>
                </div>
              )}
            </>
          ) : (
            <p className="text-xl font-black text-gray-900 leading-snug">{prompt.text}</p>
          )}
        </motion.div>

        {/* Submission input — only for Q&A and Ideas */}
        {prompt.type !== 'poll' && isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl p-4 mb-4">
            <textarea value={text} onChange={e => setText(e.target.value)}
              placeholder={prompt.type === 'idea' ? 'Fikirinizi yazın...' : 'Sualınızı yazın...'}
              rows={2} maxLength={300}
              className="w-full resize-none outline-none text-gray-900 font-medium text-base mb-2 placeholder-gray-300"
            />
            <div className="flex items-center justify-between">
              {error ? <p className="text-red-500 text-xs">{error}</p> : <p className="text-xs text-gray-300">{text.length}/300</p>}
              <motion.button whileTap={{ scale: 0.95 }} onClick={handleSend}
                disabled={!text.trim() || sending}
                className="bg-teal-500 hover:bg-teal-600 disabled:bg-gray-200 text-white font-black px-5 py-2 rounded-xl flex items-center gap-2 text-sm transition-colors">
                <Send size={16} /> Göndər
              </motion.button>
            </div>
            {session.settings?.moderation && (
              <p className="text-xs text-amber-600 mt-2">⏳ Təsdiq gözləyir — host qəbul etdikdən sonra görünəcək</p>
            )}
          </motion.div>
        )}

        {!isOpen && prompt.type !== 'poll' && (
          <div className="bg-white/20 backdrop-blur rounded-2xl p-4 mb-4 text-center text-white flex items-center justify-center gap-2">
            <Lock size={18} /> Sessiya bağlanıb — yeni göndəriş mümkün deyil
          </div>
        )}

        {/* Idea bubble cloud */}
        {prompt.type === 'idea' && (
          <div className="bg-white/10 backdrop-blur rounded-2xl p-5">
            <p className="text-white/70 text-sm font-bold mb-3">Fikirlər buludu — {items.length} ədəd</p>
            <BubbleCloud items={items} />
          </div>
        )}

        {/* Q&A live feed */}
        {prompt.type === 'question' && (
          <div className="space-y-2">
            <p className="text-white/70 text-sm font-bold mb-2">Göndərişlər — {items.length} ədəd</p>
            <AnimatePresence>
              {items.map(item => {
                const myV = myVotes[item.id] || 0;
                const isMine = sentIds.has(item.id) || item.authorId === userId;
                return (
                  <motion.div key={item.id} layout
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`bg-white rounded-2xl shadow-lg p-4 ${item.starred ? 'ring-2 ring-amber-400' : ''} ${isMine ? 'ring-2 ring-teal-400' : ''}`}>
                    <div className="flex items-start gap-3">
                      {/* Vote buttons */}
                      <div className="flex flex-col items-center gap-1">
                        <motion.button whileTap={{ scale: 0.85 }}
                          onClick={() => handleVote(item.id, 1)}
                          disabled={isMine}
                          className={`p-1.5 rounded-lg transition-colors ${myV === 1 ? 'bg-teal-500 text-white' : 'hover:bg-teal-100 text-gray-400'} ${isMine ? 'opacity-30 cursor-not-allowed' : ''}`}>
                          <ChevronUp size={18} />
                        </motion.button>
                        <span className={`text-sm font-black ${(item.votes || 0) > 0 ? 'text-teal-600' : (item.votes || 0) < 0 ? 'text-rose-600' : 'text-gray-400'}`}>
                          {item.votes || 0}
                        </span>
                        {session?.settings?.allowDownvote && (
                          <motion.button whileTap={{ scale: 0.85 }}
                            onClick={() => handleVote(item.id, -1)}
                            disabled={isMine}
                            className={`p-1.5 rounded-lg transition-colors ${myV === -1 ? 'bg-rose-500 text-white' : 'hover:bg-rose-100 text-gray-400'} ${isMine ? 'opacity-30 cursor-not-allowed' : ''}`}>
                            <ChevronDown size={18} />
                          </motion.button>
                        )}
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 font-semibold break-words">{item.text}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-xs text-gray-400">{item.authorName}</span>
                          {item.starred && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><Star size={10} /> Seçilmiş</span>}
                          {item.resolved && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><Check size={10} /> Cavablandırıldı</span>}
                          {isMine && <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-bold">Sənin</span>}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {items.length === 0 && (
              <div className="text-center py-12 text-white/50">
                <Radio size={40} className="mx-auto mb-2 opacity-40" />
                <p>İlk göndərişi siz edin!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
