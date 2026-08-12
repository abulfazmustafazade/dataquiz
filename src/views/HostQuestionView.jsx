import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ChevronRight, Check, Edit3 } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import AnimatedNumber from '../components/AnimatedNumber';
import { ANSWER_THEMES, QUESTION_TYPES } from '../lib/constants';
import { useQuestionTimer } from '../hooks/useQuestionTimer';
import { sounds } from '../lib/sounds';

export default function HostQuestionView({ game, onShowResults }) {
  const q = game.questions[game.currentQuestionIndex];
  const { secondsLeft, percent } = useQuestionTimer(q, game.questionStartedAt, true);
  const total = Object.keys(game.players || {}).length;
  const ansForQ = game.answers?.[game.currentQuestionIndex] || {};
  const answered = Object.keys(ansForQ).length;
  const lastTickedRef = useRef(0);
  const startedRef = useRef(false);

  // Question start sound (once)
  useEffect(() => {
    if (!startedRef.current) {
      sounds.questionStart();
      startedRef.current = true;
    }
  }, []);

  // Tick sounds in last 5 seconds
  useEffect(() => {
    if (secondsLeft <= 5 && secondsLeft > 0 && lastTickedRef.current !== secondsLeft) {
      sounds.tick();
      lastTickedRef.current = secondsLeft;
    }
  }, [secondsLeft]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-700 to-fuchsia-700 p-4 sm:p-8 relative overflow-hidden">
      <AnimatedBackground variant="purple" />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-4 text-white flex-wrap gap-2">
          <span className="bg-white/20 backdrop-blur rounded-xl px-4 py-2 font-bold text-sm">
            Sual {game.currentQuestionIndex + 1} / {game.questions.length}
          </span>
          <span className="bg-white/20 backdrop-blur rounded-xl px-3 py-2 font-bold text-sm flex items-center gap-1">
            {QUESTION_TYPES[q.type]?.icon} {QUESTION_TYPES[q.type]?.short}
          </span>
          <span className="bg-white/20 backdrop-blur rounded-xl px-4 py-2 font-bold text-sm flex items-center gap-2">
            <Users size={16} /> <AnimatedNumber value={answered} /> / {total}
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 mb-6"
        >
          <h2 className="text-2xl sm:text-4xl font-black text-gray-900 text-center mb-8 leading-tight">
            {q.text}
          </h2>
          <div className="flex items-center gap-4">
            <motion.div
              animate={secondsLeft <= 5 ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 0.5, repeat: secondsLeft <= 5 ? Infinity : 0 }}
              className={`w-16 h-16 rounded-full text-white flex items-center justify-center text-2xl font-black flex-shrink-0 ${
                secondsLeft <= 5 ? 'bg-rose-500' : 'bg-purple-600'
              }`}
            >
              {secondsLeft}
            </motion.div>
            <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500"
                style={{ width: `${percent}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Type-specific display */}
        {(q.type === 'multiple_choice' || q.type === 'multiple_select') && (
          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {q.options.map((opt, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`${ANSWER_THEMES[i].bg} text-white rounded-2xl p-5 sm:p-6 shadow-xl flex items-center gap-3`}
              >
                <span className="text-3xl sm:text-4xl flex-shrink-0">{ANSWER_THEMES[i].shape}</span>
                <span className="font-bold text-lg sm:text-xl break-words">{opt}</span>
              </motion.div>
            ))}
          </div>
        )}

        {q.type === 'true_false' && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-emerald-500 text-white rounded-2xl p-8 shadow-xl text-center">
              <div className="text-6xl mb-2">✓</div>
              <div className="font-black text-3xl">Hə</div>
            </div>
            <div className="bg-rose-500 text-white rounded-2xl p-8 shadow-xl text-center">
              <div className="text-6xl mb-2">✗</div>
              <div className="font-black text-3xl">Yox</div>
            </div>
          </div>
        )}

        {q.type === 'type_answer' && (
          <div className="bg-white/20 backdrop-blur rounded-2xl p-8 mb-6 text-center text-white">
            <Edit3 size={48} className="mx-auto mb-3 opacity-80" />
            <p className="text-xl font-bold">İştirakçılar cavabı yazırlar...</p>
          </div>
        )}

        {q.type === 'sorting' && (
          <div className="bg-white/20 backdrop-blur rounded-2xl p-8 mb-6 text-center text-white">
            <Edit3 size={48} className="mx-auto mb-3 opacity-80" />
            <p className="text-xl font-bold">İştirakçılar sıralayır...</p>
          </div>
        )}

        <div className="bg-white/20 backdrop-blur rounded-2xl p-4 mb-6">
          <p className="text-white font-bold mb-3">Cavab verənlər:</p>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {Object.entries(game.players || {}).map(([pid, p]) => {
                const a = ansForQ[pid];
                return (
                  <motion.div
                    key={pid}
                    layout
                    initial={false}
                    animate={a ? { scale: [1, 1.1, 1] } : {}}
                    className={`px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1 ${a ? 'bg-emerald-500 text-white' : 'bg-white/40 text-white'}`}
                  >
                    {p.name} {a && <Check size={12} />}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onShowResults}
          className="w-full bg-white text-purple-700 font-black text-xl rounded-2xl py-4 shadow-2xl hover:scale-[1.01] transition-transform flex items-center justify-center gap-2"
        >
          <ChevronRight size={24} /> Nəticələri göstər
        </motion.button>
      </div>
    </div>
  );
}
