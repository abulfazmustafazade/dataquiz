import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Users, Play, Sparkles } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import Avatar from '../components/Avatar';
import AnimatedNumber from '../components/AnimatedNumber';
import SoundToggle from '../components/SoundToggle';
import { sounds } from '../lib/sounds';

export default function HostLobbyView({ pin, game, onHome, onStart }) {
  const players = game?.players ? Object.entries(game.players) : [];
  const playerUrl = `${window.location.origin}${window.location.pathname}?pin=${pin}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(playerUrl)}&color=7c3aed&bgcolor=ffffff&margin=10`;

  const knownPlayerIds = useRef(new Set());

  // Play join sound when new players appear
  useEffect(() => {
    players.forEach(([id]) => {
      if (!knownPlayerIds.current.has(id)) {
        if (knownPlayerIds.current.size > 0) sounds.join(); // Don't play on initial mount
        knownPlayerIds.current.add(id);
      }
    });
  }, [players.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-700 to-fuchsia-700 p-4 sm:p-8 relative overflow-hidden">
      <AnimatedBackground variant="purple" />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <button onClick={onHome} className="flex items-center gap-2 text-white hover:bg-white/10 px-4 py-2 rounded-xl transition-colors">
            <Home size={20} /> Ana səhifə
          </button>
          <h2 className="text-white font-bold text-lg truncate ml-4 flex-1 text-center">{game?.title}</h2>
          <SoundToggle />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* PIN + QR */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-center"
          >
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Qoşulmaq üçün PIN:</p>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-7xl sm:text-8xl font-black text-purple-600 tracking-wider mb-4 select-all"
            >
              {pin}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-50 rounded-2xl p-4 inline-block"
            >
              <img src={qrUrl} alt="QR" className="w-48 h-48 mx-auto" loading="lazy" />
            </motion.div>
            <p className="text-sm text-gray-500 mt-3">QR skan et və ya saytda PIN-i daxil et</p>
            <p className="text-xs text-gray-400 mt-1 break-all">{playerUrl}</p>
          </motion.div>

          {/* Players list */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <Users size={28} className="text-purple-600" /> İştirakçılar
              </h3>
              <motion.span
                key={players.length}
                initial={{ scale: 1.4 }}
                animate={{ scale: 1 }}
                className="bg-purple-600 text-white px-4 py-1 rounded-full font-black text-xl"
              >
                <AnimatedNumber value={players.length} />
              </motion.span>
            </div>
            {players.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Users size={64} className="mx-auto mb-3 opacity-30" />
                </motion.div>
                <p>İştirakçıları gözləyirik...</p>
                <div className="flex justify-center gap-1 mt-3">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-purple-400 rounded-full"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {players.map(([id, p]) => (
                    <motion.div
                      key={id}
                      layout
                      initial={{ opacity: 0, scale: 0, y: -20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <div className="flex flex-col items-center gap-1 bg-purple-50 rounded-xl p-2">
                        <Avatar name={p.name} id={id} size="md" showName={false} />
                        <span className="text-xs font-bold text-purple-900 truncate max-w-full">{p.name}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={onStart}
          disabled={players.length === 0}
          className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-black text-2xl rounded-2xl py-5 shadow-2xl flex items-center justify-center gap-3 transition-colors"
        >
          {players.length === 0 ? (
            <>
              <Sparkles size={28} /> İştirakçı gözlənilir...
            </>
          ) : (
            <>
              <Play size={28} /> Oyunu başlat (<AnimatedNumber value={players.length} /> iştirakçı)
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
