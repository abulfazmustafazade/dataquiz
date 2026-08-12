import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, Home } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import Avatar from '../components/Avatar';
import AnimatedNumber from '../components/AnimatedNumber';
import { fireConfetti, fireWinnerConfetti } from '../lib/confetti';
import { sounds } from '../lib/sounds';

export default function HostFinalView({ game, onHome }) {
  const leaderboard = Object.entries(game?.players || {})
    .map(([id, p]) => ({ id, ...p }))
    .sort((a, b) => (b.score || 0) - (a.score || 0));

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  useEffect(() => {
    sounds.finish();
    fireConfetti();
    setTimeout(fireWinnerConfetti, 600);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-700 to-fuchsia-700 p-4 sm:p-8 relative overflow-hidden">
      <AnimatedBackground variant="purple" />
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-center mb-8"
        >
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <Trophy size={80} className="text-amber-300 mx-auto mb-3" />
          </motion.div>
          <h1 className="text-5xl font-black text-white mb-2 gradient-text">Oyun Bitdi!</h1>
          <p className="text-purple-100 text-lg">{game?.title}</p>
        </motion.div>

        {top3.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[1, 0, 2].map((position, displayIdx) => {
              const p = top3[position];
              if (!p) return <div key={position} />;
              const heights = [180, 220, 150];
              const colors = ['from-gray-300 to-gray-400', 'from-amber-400 to-amber-500', 'from-orange-400 to-orange-500'];
              const medals = ['🥈', '🥇', '🥉'];
              return (
                <motion.div
                  key={p.id}
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + displayIdx * 0.2, type: 'spring' }}
                  className="flex flex-col items-center justify-end"
                >
                  <div className="text-center mb-2">
                    <div className="text-4xl mb-1">{medals[position]}</div>
                    <Avatar name={p.name} id={p.id} size="md" showName={false} className="mx-auto" />
                    <div className="font-black text-white truncate max-w-[120px] mt-1">{p.name}</div>
                    <div className="text-amber-200 font-black text-2xl">
                      <AnimatedNumber value={p.score || 0} duration={1.2} />
                    </div>
                  </div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: heights[position] }}
                    transition={{ delay: 0.5 + displayIdx * 0.2, duration: 0.6, ease: 'easeOut' }}
                    className={`w-full bg-gradient-to-b ${colors[position]} rounded-t-2xl flex items-start justify-center pt-3`}
                  >
                    <Crown size={32} className="text-white" />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        )}

        {rest.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="bg-white rounded-3xl shadow-2xl p-6 mb-6"
          >
            <h3 className="font-black text-gray-900 mb-3">Digər iştirakçılar</h3>
            <div className="space-y-2">
              {rest.map((p, idx) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3 + idx * 0.05 }}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                >
                  <div className="w-8 h-8 bg-gray-300 text-white rounded-full flex items-center justify-center font-black text-sm">
                    {idx + 4}
                  </div>
                  <Avatar name={p.name} id={p.id} size="xs" showName={false} />
                  <span className="flex-1 font-bold text-gray-900 truncate">{p.name}</span>
                  <span className="font-black text-purple-600">{p.score || 0}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          whileTap={{ scale: 0.98 }}
          onClick={onHome}
          className="w-full bg-white text-purple-700 font-black text-xl rounded-2xl py-4 shadow-2xl hover:scale-[1.01] transition-transform flex items-center justify-center gap-2"
        >
          <Home size={24} /> Ana səhifəyə qayıt
        </motion.button>
      </div>
    </div>
  );
}
