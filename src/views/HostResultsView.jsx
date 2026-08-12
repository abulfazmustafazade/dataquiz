import { motion } from 'framer-motion';
import { Check, X, Clock, Trophy, ChevronRight } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import AnimatedNumber from '../components/AnimatedNumber';
import Avatar from '../components/Avatar';
import { ANSWER_THEMES } from '../lib/constants';

export default function HostResultsView({ game, onNext }) {
  const q = game.questions[game.currentQuestionIndex];
  const ansForQ = game.answers?.[game.currentQuestionIndex] || {};

  let correctCount = 0, wrongCount = 0, noAnswerCount = 0;
  Object.entries(game.players || {}).forEach(([pid]) => {
    const a = ansForQ[pid];
    if (!a) noAnswerCount++;
    else if (a.correct) correctCount++;
    else wrongCount++;
  });

  const leaderboard = Object.entries(game.players || {})
    .map(([id, p]) => ({ id, ...p }))
    .sort((a, b) => (b.score || 0) - (a.score || 0));

  const isLast = game.currentQuestionIndex >= game.questions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-700 to-fuchsia-700 p-4 sm:p-8 relative overflow-hidden">
      <AnimatedBackground variant="purple" />
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white text-center mb-6"
        >
          <p className="text-sm font-bold opacity-70 mb-1">Sual {game.currentQuestionIndex + 1} nəticələri</p>
          <h2 className="text-2xl sm:text-3xl font-black">{q.text}</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 mb-6"
        >
          <div className="grid grid-cols-3 gap-3 mb-6">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring' }}
              className="bg-emerald-50 rounded-2xl p-4 text-center"
            >
              <Check size={32} className="text-emerald-600 mx-auto mb-1" />
              <div className="text-3xl font-black text-emerald-600"><AnimatedNumber value={correctCount} /></div>
              <div className="text-sm text-emerald-700 font-bold">Düzgün</div>
            </motion.div>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="bg-rose-50 rounded-2xl p-4 text-center"
            >
              <X size={32} className="text-rose-600 mx-auto mb-1" />
              <div className="text-3xl font-black text-rose-600"><AnimatedNumber value={wrongCount} /></div>
              <div className="text-sm text-rose-700 font-bold">Səhv</div>
            </motion.div>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="bg-gray-50 rounded-2xl p-4 text-center"
            >
              <Clock size={32} className="text-gray-600 mx-auto mb-1" />
              <div className="text-3xl font-black text-gray-600"><AnimatedNumber value={noAnswerCount} /></div>
              <div className="text-sm text-gray-700 font-bold">Cavabsız</div>
            </motion.div>
          </div>

          {/* Type-specific result viz */}
          {(q.type === 'multiple_choice' || q.type === 'true_false') && (
            <ChoiceResults q={q} ansForQ={ansForQ} />
          )}
          {q.type === 'multiple_select' && <MultiSelectResults q={q} ansForQ={ansForQ} />}
          {q.type === 'type_answer' && <TypeAnswerResults q={q} ansForQ={ansForQ} game={game} />}
          {q.type === 'sorting' && <SortingResults q={q} />}
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-2xl p-6 mb-6"
        >
          <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
            <Trophy size={24} className="text-amber-500" /> Lider lövhəsi
          </h3>
          <div className="space-y-2">
            {leaderboard.slice(0, 5).map((p, idx) => {
              const a = ansForQ[p.id];
              return (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className={`flex items-center gap-3 p-3 rounded-xl ${idx === 0 ? 'bg-amber-50' : 'bg-gray-50'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-white flex-shrink-0 text-sm ${
                    idx === 0 ? 'bg-amber-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-orange-400' : 'bg-gray-300'
                  }`}>
                    {idx + 1}
                  </div>
                  <Avatar name={p.name} id={p.id} size="xs" showName={false} />
                  <span className="flex-1 font-bold text-gray-900 truncate">{p.name}</span>
                  {a && (
                    <span className={`text-xs font-bold px-2 py-1 rounded ${a.correct ? 'bg-emerald-100 text-emerald-700' : a.correctness > 0 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                      {a.points > 0 ? `+${a.points}` : 'səhv'}
                    </span>
                  )}
                  <span className="font-black text-purple-600 min-w-[3rem] text-right">
                    <AnimatedNumber value={p.score || 0} />
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-xl rounded-2xl py-5 shadow-2xl flex items-center justify-center gap-2 transition-colors"
        >
          {isLast ? <><Trophy size={24} /> Yekun nəticə</> : <>Növbəti sual <ChevronRight size={24} /></>}
        </motion.button>
      </div>
    </div>
  );
}

// =====================================================================
function ChoiceResults({ q, ansForQ }) {
  const counts = q.options.map((_, i) => Object.values(ansForQ).filter(a => Number(a.value) === i).length);
  const maxCount = Math.max(...counts, 1);
  const themes = q.type === 'true_false'
    ? [{ bg: 'bg-emerald-500', shape: '✓' }, { bg: 'bg-rose-500', shape: '✗' }]
    : ANSWER_THEMES;

  return (
    <div className="space-y-2">
      {q.options.map((opt, i) => {
        const pct = (counts[i] / maxCount) * 100;
        const isCorrect = i === q.correct;
        return (
          <div key={i} className="flex items-center gap-3">
            <div className={`w-10 h-10 ${themes[i].bg} text-white rounded-lg flex items-center justify-center text-xl font-black flex-shrink-0`}>
              {themes[i].shape}
            </div>
            <div className="flex-1 relative h-10 bg-gray-100 rounded-xl overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.1, ease: 'easeOut' }}
                className={`absolute inset-y-0 left-0 ${themes[i].bg} opacity-80`}
              />
              <div className="relative h-full px-3 flex items-center justify-between">
                <span className="font-bold text-gray-900 truncate">{opt}</span>
                <span className="font-black text-gray-900 ml-2"><AnimatedNumber value={counts[i]} /></span>
              </div>
            </div>
            {isCorrect && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center flex-shrink-0"
              >
                <Check size={20} />
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function MultiSelectResults({ q, ansForQ }) {
  const totalAnswered = Object.values(ansForQ).length || 1;
  return (
    <div>
      <p className="font-bold text-gray-700 mb-3">
        Düzgün cavablar: <span className="text-emerald-700">{q.correctIndices.map(i => q.options[i]).join(', ')}</span>
      </p>
      <div className="space-y-2">
        {q.options.map((opt, i) => {
          const count = Object.values(ansForQ).filter(a => Array.isArray(a.value) && a.value.map(Number).includes(i)).length;
          const pct = (count / totalAnswered) * 100;
          const isCorrect = q.correctIndices?.includes(i);
          return (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-10 h-10 ${ANSWER_THEMES[i].bg} text-white rounded-lg flex items-center justify-center text-xl font-black flex-shrink-0`}>
                {ANSWER_THEMES[i].shape}
              </div>
              <div className="flex-1 relative h-10 bg-gray-100 rounded-xl overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.7, delay: 0.2 + i * 0.1 }}
                  className={`absolute inset-y-0 left-0 ${ANSWER_THEMES[i].bg} opacity-80`}
                />
                <div className="relative h-full px-3 flex items-center justify-between">
                  <span className="font-bold text-gray-900 truncate">{opt}</span>
                  <span className="font-black text-gray-900 ml-2"><AnimatedNumber value={count} /></span>
                </div>
              </div>
              {isCorrect && (
                <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                  <Check size={20} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TypeAnswerResults({ q, ansForQ, game }) {
  return (
    <div>
      <p className="font-bold text-gray-700 mb-2">Düzgün cavablar:</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {q.acceptableAnswers.filter(a => a && a.trim()).map((a, i) => (
          <span key={i} className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg font-bold text-sm">{a}</span>
        ))}
      </div>
      <p className="font-bold text-gray-700 mb-2">İştirakçıların cavabları:</p>
      <div className="space-y-1 max-h-60 overflow-y-auto">
        {Object.entries(ansForQ).map(([pid, a]) => (
          <motion.div
            key={pid}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-center justify-between p-2 rounded-lg ${a.correct ? 'bg-emerald-50' : 'bg-rose-50'}`}
          >
            <span className="font-bold text-gray-700 text-sm">{game.players?.[pid]?.name}</span>
            <span className={`text-sm ${a.correct ? 'text-emerald-700' : 'text-rose-700'} font-mono`}>
              "{a.value}"
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SortingResults({ q }) {
  return (
    <div>
      <p className="font-bold text-gray-700 mb-3">Düzgün ardıcıllıq:</p>
      <div className="space-y-2 mb-4">
        {q.items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3 bg-emerald-50 rounded-xl p-3"
          >
            <div className="w-8 h-8 bg-emerald-500 text-white rounded-lg flex items-center justify-center font-black text-sm">{i + 1}</div>
            <span className="font-bold text-gray-900">{item}</span>
          </motion.div>
        ))}
      </div>
      <p className="text-sm text-gray-600">Hər iştirakçı düzgün yerlərə görə qismi xal qazandı.</p>
    </div>
  );
}
