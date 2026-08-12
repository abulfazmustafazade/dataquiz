import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Star } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import Avatar from '../components/Avatar';
import AnimatedNumber from '../components/AnimatedNumber';
import { fireConfetti, fireWinnerConfetti } from '../lib/confetti';
import { sounds } from '../lib/sounds';

// Podium position config — indexed by leaderboard rank (0 = 1st, 1 = 2nd, 2 = 3rd)
const PODIUM = [
  { medal: '🥇', label: '1', height: 220, bg: 'from-amber-400 to-yellow-500',   ring: 'ring-amber-300',  crown: '#fbbf24' },
  { medal: '🥈', label: '2', height: 170, bg: 'from-slate-300 to-gray-400',     ring: 'ring-gray-300',   crown: '#cbd5e1' },
  { medal: '🥉', label: '3', height: 130, bg: 'from-orange-400 to-amber-600',   ring: 'ring-orange-300', crown: '#fb923c' },
];

export default function HostFinalView({ game, onHome }) {
  // Sort by score DESC — this is the single source of truth for ranking
  const leaderboard = Object.entries(game?.players || {})
    .map(([id, p]) => ({ id, ...p }))
    .sort((a, b) => (b.score || 0) - (a.score || 0));

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  useEffect(() => {
    sounds.finish();
    fireConfetti();
    setTimeout(fireWinnerConfetti, 700);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-700 to-fuchsia-700 p-4 sm:p-8 relative overflow-hidden">
      <AnimatedBackground variant="purple" />
      <div className="max-w-4xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            className="text-8xl mb-4 inline-block"
          >
            🏆
          </motion.div>
          <h1 className="text-5xl font-black text-white mb-2 tracking-tight">Oyun Bitdi!</h1>
          <p className="text-purple-200 text-lg">{game?.title}</p>
        </motion.div>

        {/* PODIUM — display order: 2nd (left), 1st (center), 3rd (right) */}
        {top3.length > 0 && (
          <div className="flex items-end justify-center gap-3 sm:gap-6 mb-8" style={{ minHeight: 360 }}>
            {[1, 0, 2].map((rank, displayIdx) => {
              const player = top3[rank];
              if (!player) return <div key={rank} className="flex-1 max-w-[180px]" />;
              const cfg = PODIUM[rank];
              const animDelay = displayIdx === 1 ? 0.1 : displayIdx === 0 ? 0.3 : 0.5;

              return (
                <motion.div
                  key={player.id}
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: animDelay, type: 'spring', stiffness: 120, damping: 18 }}
                  className="flex-1 max-w-[200px] flex flex-col items-center"
                >
                  {/* Player card above podium */}
                  <div className="flex flex-col items-center mb-3">
                    <motion.div
                      animate={rank === 0 ? { y: [0, -6, 0] } : {}}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      className="text-4xl mb-1"
                    >
                      {cfg.medal}
                    </motion.div>

                    {/* Avatar with ring */}
                    <div className={`ring-4 ${cfg.ring} rounded-full`}>
                      <Avatar name={player.name} id={player.id} size={rank === 0 ? 'xl' : 'lg'} showName={false} />
                    </div>

                    <p className="font-black text-white mt-2 text-center truncate max-w-[120px] text-sm sm:text-base">
                      {player.name}
                    </p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: animDelay + 0.5 }}
                      className="font-black text-2xl sm:text-3xl text-amber-300 mt-1"
                    >
                      <AnimatedNumber value={player.score || 0} duration={1.5} />
                    </motion.p>
                  </div>

                  {/* Podium block */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: cfg.height }}
                    transition={{ delay: animDelay + 0.2, duration: 0.7, ease: 'easeOut' }}
                    className={`w-full bg-gradient-to-b ${cfg.bg} rounded-t-2xl flex flex-col items-center justify-start pt-4 shadow-2xl`}
                  >
                    <Star size={28} fill="white" className="text-white opacity-70" />
                    <span className="text-white font-black text-5xl opacity-30 mt-2">{cfg.label}</span>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Rest of leaderboard */}
        {rest.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-white/15 backdrop-blur rounded-3xl p-5 mb-6"
          >
            <h3 className="font-black text-white mb-3 text-lg">Digər iştirakçılar</h3>
            <div className="space-y-2">
              {rest.map((p, idx) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + idx * 0.06 }}
                  className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3"
                >
                  <span className="text-white font-black w-6 text-center opacity-70">#{idx + 4}</span>
                  <Avatar name={p.name} id={p.id} size="xs" showName={false} />
                  <span className="flex-1 font-bold text-white truncate">{p.name}</span>
                  <span className="font-black text-amber-300 text-lg">{p.score || 0}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          whileTap={{ scale: 0.97 }}
          onClick={onHome}
          className="w-full bg-white text-purple-700 font-black text-xl rounded-2xl py-4 shadow-2xl hover:scale-[1.01] transition-transform flex items-center justify-center gap-2"
        >
          <Home size={22} /> Ana səhifəyə qayıt
        </motion.button>
      </div>
    </div>
  );
}
