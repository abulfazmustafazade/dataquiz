import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, Home } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import Avatar from '../components/Avatar';
import AnimatedNumber from '../components/AnimatedNumber';
import { fireWinnerConfetti, fireConfetti } from '../lib/confetti';
import { sounds } from '../lib/sounds';

export default function PlayerFinalView({ playerId, playerName, game, onHome }) {
  // Sort by score DESC — same as HostFinalView, single source of truth
  const leaderboard = Object.entries(game?.players || {})
    .map(([id, p]) => ({ id, ...p }))
    .sort((a, b) => (b.score || 0) - (a.score || 0));

  const myRank  = leaderboard.findIndex(p => p.id === playerId) + 1;
  const myScore = game?.players?.[playerId]?.score || 0;
  const total   = leaderboard.length;

  const isWinner = myRank === 1;
  const isTop3   = myRank <= 3;

  let title, subtitle, themeColor, bgVariant;
  if (myRank === 1) {
    title = '🏆 Qələbə!'; subtitle = 'Sən qalibsən!';
    themeColor = 'from-amber-400 via-yellow-500 to-orange-500'; bgVariant = 'amber';
  } else if (myRank === 2) {
    title = '🥈 İkinci yer!'; subtitle = 'Çox yaxşı!';
    themeColor = 'from-slate-500 via-gray-500 to-zinc-600'; bgVariant = 'rose';
  } else if (myRank === 3) {
    title = '🥉 Üçüncü yer!'; subtitle = 'Əla nəticə!';
    themeColor = 'from-orange-500 via-amber-600 to-yellow-700'; bgVariant = 'amber';
  } else {
    title = 'Oyun bitdi!'; subtitle = 'İştirakına görə təşəkkürlər';
    themeColor = 'from-pink-600 via-fuchsia-600 to-purple-700'; bgVariant = 'pink';
  }

  useEffect(() => {
    sounds.finish();
    if (isWinner) {
      fireConfetti();
      setTimeout(fireWinnerConfetti, 500);
    } else if (isTop3) {
      fireConfetti();
    }
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeColor} p-4 flex items-center justify-center relative overflow-hidden`}>
      <AnimatedBackground variant={bgVariant} />
      <div className="max-w-md w-full text-center text-white relative z-10">

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 150, damping: 12 }}
          className="mb-4"
        >
          {isWinner ? (
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <Crown size={120} className="text-white mx-auto drop-shadow-2xl" />
            </motion.div>
          ) : (
            <Trophy size={96} className="text-white mx-auto opacity-80" />
          )}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl font-black mb-2"
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl mb-6 opacity-90"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: 'spring' }}
          className="mb-6"
        >
          <Avatar name={playerName} id={playerId} size="xl" showName={false} className="mx-auto" />
          <p className="text-2xl font-black mt-2">{playerName}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/20 backdrop-blur rounded-3xl p-6 mb-6 grid grid-cols-2 gap-4"
        >
          <div>
            <div className="text-sm opacity-80 mb-1">Yerin</div>
            <div className="text-5xl font-black">
              #<AnimatedNumber value={myRank} duration={1.5} />
            </div>
            <div className="text-xs opacity-70 mt-1">{total} iştirakçıdan</div>
          </div>
          <div>
            <div className="text-sm opacity-80 mb-1">Cəmi xal</div>
            <div className="text-5xl font-black">
              <AnimatedNumber value={myScore} duration={1.8} />
            </div>
            <div className="text-xs opacity-70 mt-1">xal</div>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          whileTap={{ scale: 0.97 }}
          onClick={onHome}
          className="w-full bg-white text-purple-700 font-black text-lg rounded-2xl py-4 shadow-2xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
        >
          <Home size={20} /> Ana səhifə
        </motion.button>
      </div>
    </div>
  );
}
