import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Trophy, Clock, Target } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import AnimatedNumber from '../components/AnimatedNumber';
import { sounds } from '../lib/sounds';

export default function PlayerResultView({ playerId, playerName, game }) {
  const qIdx = game.currentQuestionIndex;
  const ansForQ = game.answers?.[qIdx] || {};
  // CRITICAL: Read the answer object that the HOST wrote with scoreAnswer().
  // This guarantees player and host see the IDENTICAL result.
  const myAnswer = ansForQ[playerId];

  // Compute leaderboard rank from current scores (host has already updated them)
  const leaderboard = Object.entries(game.players || {})
    .map(([id, p]) => ({ id, ...p }))
    .sort((a, b) => (b.score || 0) - (a.score || 0));
  const myRank = leaderboard.findIndex(p => p.id === playerId) + 1;
  const myScore = game.players?.[playerId]?.score || 0;

  // Determine display state from the host-computed result
  let state, themeColor, icon, title, subtitle;
  if (!myAnswer) {
    state = 'noAnswer';
    themeColor = 'from-gray-500 via-gray-600 to-slate-700';
    icon = <Clock size={80} className="text-white" />;
    title = 'Vaxt bitdi!';
    subtitle = 'Bu sualda cavab vermədin';
  } else if (myAnswer.correct) {
    state = 'correct';
    themeColor = 'from-emerald-500 via-green-600 to-teal-700';
    icon = <Check size={96} className="text-white" strokeWidth={3} />;
    title = 'Düzgün!';
    subtitle = `+${myAnswer.points} xal qazandın`;
  } else if (myAnswer.correctness > 0) {
    state = 'partial';
    themeColor = 'from-amber-500 via-orange-500 to-rose-500';
    icon = <Target size={88} className="text-white" />;
    title = 'Qismən düz';
    subtitle = `+${myAnswer.points} xal qazandın`;
  } else {
    state = 'wrong';
    themeColor = 'from-rose-500 via-red-600 to-rose-700';
    icon = <X size={96} className="text-white" strokeWidth={3} />;
    title = 'Səhv!';
    subtitle = 'Növbəti sualda uğurlar';
  }

  // Play sound on mount (only once per question)
  const playedRef = useRef(false);
  useEffect(() => {
    if (playedRef.current) return;
    playedRef.current = true;
    if (state === 'correct') sounds.correct();
    else if (state === 'partial') sounds.correct();
    else if (state === 'wrong') sounds.wrong();
  }, [state]);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeColor} p-4 flex items-center justify-center relative overflow-hidden`}>
      <AnimatedBackground variant={state === 'correct' ? 'emerald' : state === 'partial' ? 'amber' : 'rose'} />
      <div className="max-w-md w-full text-center text-white relative z-10">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          className="mb-6"
        >
          {icon}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl font-black mb-3 gradient-text"
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl mb-8 opacity-90"
        >
          {subtitle}
        </motion.p>

        {/* Stats card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/20 backdrop-blur rounded-3xl p-6 mb-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm opacity-80 mb-1 flex items-center justify-center gap-1">
                <Trophy size={16} /> Yerin
              </div>
              <div className="text-4xl font-black">
                #<AnimatedNumber value={myRank} duration={0.8} />
              </div>
              <div className="text-xs opacity-70">/ {leaderboard.length}</div>
            </div>
            <div>
              <div className="text-sm opacity-80 mb-1">Cəmi xal</div>
              <div className="text-4xl font-black">
                <AnimatedNumber value={myScore} duration={1.2} />
              </div>
              <div className="text-xs opacity-70">xal</div>
            </div>
          </div>

          {/* Sorting partial credit details */}
          {state === 'partial' && myAnswer?.details?.matches !== undefined && (
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-sm">
                <b>{myAnswer.details.matches}</b> / {myAnswer.details.total} element düzgün yerdə
              </p>
            </div>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-sm opacity-70"
        >
          {playerName} • Növbəti sualı gözlə...
        </motion.p>
      </div>
    </div>
  );
}
