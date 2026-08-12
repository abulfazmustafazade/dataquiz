import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Star, Check, Trash2, Eye, EyeOff, Settings, ChevronUp, ChevronDown, Radio, Lock, Unlock, Users } from 'lucide-react';
import AnimatedBackground from '../../components/AnimatedBackground';
import AnimatedNumber from '../../components/AnimatedNumber';
import { crowdAPI } from '../../lib/crowdAPI';
import { genPin } from '../../lib/utils';
import { sounds } from '../../lib/sounds';

const TYPE_LABELS = { question: '❓ Sual / Q&A', idea: '💡 Fikir / Brainstorm', poll: '📊 Sorğu / Poll' };
const TYPE_PLACEHOLDER = {
  question: 'Məsələn: "Bu layihədə ən böyük çətinlik nədir?"',
  idea: 'Məsələn: "Platformamızı necə yaxşılaşdıra bilərik?"',
  poll: 'Məsələn: "Növbəti toplantı vaxtı?"',
};

export default function CrowdHostView({ onHome }) {
  // Phase: 'setup' | 'live'
  const [phase, setPhase] = useState('setup');
  const [pin, setPin] = useState('');
  const [session, setSession] = useState(null);

  // Setup form
  const [title, setTitle] = useState('');
  const [settings, setSettings] = useState({ anonymous: false, moderation: false, allowDownvote: true });
  const [promptType, setPromptType] = useState('question');
  const [promptText, setPromptText] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  // Live state
  const [items, setItems] = useState([]);
  const [pollCounts, setPollCounts] = useState({});
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const unsubRef = useRef(null);

  // Start session
  const handleCreate = async () => {
    if (!title.trim()) { setError('Sessiya adı lazımdır'); return; }
    if (!promptText.trim()) { setError('Mövzu/sual lazımdır'); return; }
    if (promptType === 'poll' && pollOptions.filter(o => o.trim()).length < 2) { setError('Ən azı 2 variant lazımdır'); return; }
    setCreating(true);
    const newPin = genPin();
    const ok = await crowdAPI.create(newPin, {
      title: title.trim(),
      settings,
      prompt: { type: promptType, text: promptText.trim(), options: pollOptions.filter(o => o.trim()) },
      participants: 0,
    });
    if (!ok) { setError('Firebase xətası — config-i yoxla'); setCreating(false); return; }
    setPin(newPin);
    setPhase('live');
    sounds.questionStart();
  };

  // Subscribe once live
  useEffect(() => {
    if (phase !== 'live' || !pin) return;
    unsubRef.current = crowdAPI.listen(pin, (data) => {
      if (!data) return;
      setSession(data);
      const rawItems = data.items ? Object.entries(data.items).map(([id, v]) => ({ id, ...v })) : [];
      const sorted = rawItems
        .filter(i => !data.settings?.moderation || i.status === 'approved')
        .sort((a, b) => {
          if (b.starred !== a.starred) return b.starred ? 1 : -1;
          return (b.votes || 0) - (a.votes || 0);
        });
      setItems(sorted);
      setPollCounts(data.pollCounts || {});
      setTotalParticipants(data.participants || 0);
    });
    return () => unsubRef.current?.();
  }, [phase, pin]);

  // Pending items (moderation queue)
  const pendingItems = session?.items
    ? Object.entries(session.items).filter(([, v]) => v.status === 'pending').map(([id, v]) => ({ id, ...v }))
    : [];

  const isOpen = session?.status === 'open';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(window.location.origin + window.location.pathname + '?crowdpin=' + pin)}&color=0f766e&bgcolor=ffffff&margin=8`;

  if (phase === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-600 via-cyan-700 to-emerald-700 p-4 sm:p-8 relative">
        <AnimatedBackground variant="emerald" />
        <div className="max-w-2xl mx-auto relative z-10">
          <motion.button onClick={onHome} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-white hover:bg-white/10 px-4 py-2 rounded-xl mb-6 transition-colors">
            <Home size={20} /> Ana səhifə
          </motion.button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <Radio size={24} className="text-teal-600" /> Yeni Crowd Sessiyası
            </h2>

            <label className="block text-sm font-bold text-gray-600 mb-1">Sessiya adı</label>
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Məsələn: UX Toplantısı — Sual & Cavab"
              className="w-full p-3 border-2 border-gray-200 rounded-xl outline-none focus:border-teal-500 mb-5 transition-colors" />

            <label className="block text-sm font-bold text-gray-600 mb-2">Məzmun tipi</label>
            <div className="grid grid-cols-3 gap-2 mb-5">
              {Object.entries(TYPE_LABELS).map(([k, label]) => (
                <motion.button key={k} whileTap={{ scale: 0.95 }} onClick={() => setPromptType(k)}
                  className={`rounded-xl p-3 text-center text-xs font-bold border-2 transition-all ${promptType === k ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-600 hover:border-teal-300'}`}>
                  {label}
                </motion.button>
              ))}
            </div>

            <label className="block text-sm font-bold text-gray-600 mb-1">
              {promptType === 'poll' ? 'Sorğu sualı' : promptType === 'idea' ? 'Brainstorm mövzusu' : 'Açıq sual / mövzu'}
            </label>
            <textarea value={promptText} onChange={e => setPromptText(e.target.value)}
              placeholder={TYPE_PLACEHOLDER[promptType]} rows={2}
              className="w-full p-3 border-2 border-gray-200 rounded-xl outline-none focus:border-teal-500 resize-none mb-4 transition-colors" />

            {promptType === 'poll' && (
              <div className="mb-5">
                <label className="block text-sm font-bold text-gray-600 mb-2">Variantlar</label>
                {pollOptions.map((opt, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input value={opt} onChange={e => { const o = [...pollOptions]; o[i] = e.target.value; setPollOptions(o); }}
                      placeholder={`Variant ${i + 1}`}
                      className="flex-1 p-3 border-2 border-gray-200 rounded-xl outline-none focus:border-teal-500 transition-colors" />
                    {pollOptions.length > 2 && (
                      <button onClick={() => setPollOptions(pollOptions.filter((_, j) => j !== i))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                    )}
                  </div>
                ))}
                {pollOptions.length < 6 && (
                  <button onClick={() => setPollOptions([...pollOptions, ''])} className="text-teal-600 text-sm font-semibold hover:text-teal-800">+ Variant əlavə et</button>
                )}
              </div>
            )}

            <div className="bg-gray-50 rounded-2xl p-4 mb-5">
              <p className="text-sm font-bold text-gray-700 mb-3">Parametrlər</p>
              <div className="space-y-2">
                {[
                  { key: 'anonymous', icon: <EyeOff size={16} />, label: 'Anonim rejim', sub: 'Göndərənin adı gizli qalır' },
                  { key: 'moderation', icon: <Eye size={16} />, label: 'Moderasiya', sub: 'Siz təsdiqləməzdən əvvəl görünmür' },
                  { key: 'allowDownvote', icon: <ChevronDown size={16} />, label: 'Downvote icazəsi', sub: 'İştirakçılar mənfi səs verə bilər' },
                ].map(({ key, icon, label, sub }) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-white transition-colors">
                    <div className="text-gray-500">{icon}</div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-gray-800">{label}</div>
                      <div className="text-xs text-gray-500">{sub}</div>
                    </div>
                    <div onClick={() => setSettings(s => ({ ...s, [key]: !s[key] }))}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${settings[key] ? 'bg-teal-500' : 'bg-gray-300'}`}>
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {error && <p className="text-red-600 text-sm mb-3 font-semibold">{error}</p>}

            <motion.button whileTap={{ scale: 0.97 }} onClick={handleCreate} disabled={creating}
              className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-black text-lg rounded-2xl py-4 shadow-xl disabled:opacity-60 transition-colors">
              {creating ? 'Yaradılır...' : 'Sessiyanı başlat'}
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── LIVE VIEW ──────────────────────────────────────────────────────
  const prompt = session?.prompt || {};
  const totalPollVotes = Object.values(pollCounts).reduce((s, c) => s + (c || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 via-cyan-700 to-emerald-700 p-3 sm:p-6 relative">
      <AnimatedBackground variant="emerald" />
      <div className="max-w-5xl mx-auto relative z-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <button onClick={onHome} className="text-white hover:bg-white/10 px-3 py-1.5 rounded-xl flex items-center gap-1 text-sm transition-colors">
            <Home size={16} /> Ana səhifə
          </button>
          <h2 className="text-white font-black text-lg truncate flex-1 text-center">{session?.title}</h2>
          <div className="flex items-center gap-2">
            <span className="text-white/70 text-sm flex items-center gap-1"><Users size={14} /> <AnimatedNumber value={totalParticipants} /></span>
            <motion.button whileTap={{ scale: 0.95 }}
              onClick={() => crowdAPI.update(pin, { status: isOpen ? 'closed' : 'open' })}
              className={`px-3 py-1.5 rounded-xl font-bold text-sm flex items-center gap-1 transition-colors ${isOpen ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'bg-emerald-400 hover:bg-emerald-500 text-white'}`}>
              {isOpen ? <><Lock size={14} /> Bağla</> : <><Unlock size={14} /> Aç</>}
            </motion.button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Left: PIN + QR + Prompt */}
          <div className="md:col-span-1 space-y-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-xl p-5 text-center">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">PIN</p>
              <p className="text-5xl font-black text-teal-600 tracking-widest mb-3">{pin}</p>
              <img src={qrUrl} alt="QR" className="w-36 h-36 mx-auto mb-2 rounded-xl" />
              <p className={`text-xs font-bold px-3 py-1 rounded-full inline-block ${isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                {isOpen ? '🟢 Açıq' : '🔴 Bağlı'}
              </p>
            </motion.div>

            {/* Current prompt */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Aktiv mövzu</p>
              <p className="text-sm font-bold text-gray-500 mb-1">{TYPE_LABELS[prompt.type]}</p>
              <p className="font-black text-gray-900 text-base leading-snug">{prompt.text}</p>

              {/* Poll counts */}
              {prompt.type === 'poll' && prompt.options?.length > 0 && (
                <div className="mt-4 space-y-2">
                  {prompt.options.map((opt, i) => {
                    const count = pollCounts[i] || 0;
                    const pct = totalPollVotes ? Math.round((count / totalPollVotes) * 100) : 0;
                    return (
                      <div key={i}>
                        <div className="flex justify-between text-xs text-gray-600 mb-0.5">
                          <span className="font-semibold truncate">{opt}</span>
                          <span className="font-black ml-2">{count}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div animate={{ width: `${pct}%` }} className="h-full bg-teal-500 rounded-full" />
                        </div>
                      </div>
                    );
                  })}
                  <p className="text-xs text-gray-400 text-right">Cəmi: {totalPollVotes} səs</p>
                </div>
              )}
            </motion.div>

            {/* Moderation queue */}
            {session?.settings?.moderation && pendingItems.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4">
                <p className="text-sm font-black text-amber-800 mb-3">⏳ Gözləyən ({pendingItems.length})</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {pendingItems.map(item => (
                    <div key={item.id} className="bg-white rounded-xl p-3">
                      <p className="text-sm text-gray-800 mb-2">{item.text}</p>
                      <p className="text-xs text-gray-400 mb-2">{item.authorName}</p>
                      <div className="flex gap-2">
                        <button onClick={() => crowdAPI.approve(pin, item.id)}
                          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg py-1.5 transition-colors">
                          Təsdiqlə
                        </button>
                        <button onClick={() => crowdAPI.remove(pin, item.id)}
                          className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-lg py-1.5 transition-colors">
                          Rədd et
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right: Items feed */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white font-bold text-sm flex items-center gap-2">
                Göndərişlər <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-black"><AnimatedNumber value={items.length} /></span>
              </p>
              <p className="text-white/60 text-xs">Ən çox səs alan yuxarıdadır</p>
            </div>

            {items.length === 0 ? (
              <div className="bg-white/10 backdrop-blur border-2 border-dashed border-white/30 rounded-2xl p-12 text-center text-white">
                <Radio size={48} className="mx-auto mb-3 opacity-40" />
                <p className="font-bold text-lg opacity-70">Hələ göndəriş yoxdur</p>
                <p className="text-sm opacity-50 mt-1">PIN-i paylaşın, iştirakçılar qoşulsun</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                <AnimatePresence>
                  {items.map((item, idx) => (
                    <motion.div key={item.id} layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={`bg-white rounded-2xl shadow-lg p-4 ${item.starred ? 'ring-2 ring-amber-400' : ''} ${item.resolved ? 'opacity-60' : ''}`}>
                      <div className="flex items-start gap-3">
                        {/* Vote counter */}
                        <div className="flex flex-col items-center gap-1 min-w-[44px]">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-xl ${(item.votes || 0) > 0 ? 'bg-teal-100 text-teal-700' : (item.votes || 0) < 0 ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-600'}`}>
                            {item.votes > 0 ? '+' : ''}{item.votes || 0}
                          </div>
                          <span className="text-xs text-gray-400">səs</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 break-words">{item.text}</p>
                          <p className="text-xs text-gray-400 mt-1">{item.authorName} · {new Date(item.createdAt).toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' })}</p>
                          {item.resolved && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">✓ Cavablandırıldı</span>}
                          {item.starred && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold ml-1">⭐ Seçilmiş</span>}
                        </div>

                        {/* Host actions */}
                        <div className="flex flex-col gap-1.5 flex-shrink-0">
                          <button onClick={() => crowdAPI.star(pin, item.id, !item.starred)}
                            title="Seç / Pin"
                            className={`p-1.5 rounded-lg transition-colors ${item.starred ? 'bg-amber-400 text-white' : 'hover:bg-amber-100 text-gray-400'}`}>
                            <Star size={16} />
                          </button>
                          <button onClick={() => crowdAPI.resolve(pin, item.id, !item.resolved)}
                            title="Cavablandırıldı"
                            className={`p-1.5 rounded-lg transition-colors ${item.resolved ? 'bg-emerald-500 text-white' : 'hover:bg-emerald-100 text-gray-400'}`}>
                            <Check size={16} />
                          </button>
                          <button onClick={() => crowdAPI.remove(pin, item.id)}
                            title="Sil"
                            className="p-1.5 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
