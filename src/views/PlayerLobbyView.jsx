import { motion } from 'framer-motion';
import { Users, Sparkles } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import Avatar from '../components/Avatar';
import AnimatedNumber from '../components/AnimatedNumber';

export default function PlayerLobbyView({ playerName, playerId, game }) {
  const playerCount = Object.keys(game?.players || {}).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-600 via-fuchsia-600 to-purple-700 p-4 flex items-center justify-center relative overflow-hidden">
      <AnimatedBackground variant="pink" />
      <div className="max-w-md w-full text-center text-white relative z-10">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <Avatar name={playerName} id={playerId} avatar={game?.players?.[playerId]?.avatar} size="xl" showName={false} className="mx-auto mb-6" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl mb-2 opacity-90"
        >
          Salam,
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-5xl font-black mb-8 break-words"
        >
          {playerName}!
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/20 backdrop-blur rounded-2xl p-6 mb-6"
        >
          <p className="text-base opacity-90 mb-1">Oyun:</p>
          <p className="text-2xl font-bold mb-4 truncate">{game?.title}</p>
          <div className="flex items-center justify-center gap-2">
            <Users size={20} />
            <span className="font-bold"><AnimatedNumber value={playerCount} /> iştirakçı</span>
          </div>
        </motion.div>
        <div className="flex items-center justify-center gap-2 text-lg">
          <motion.div
            className="w-2 h-2 bg-white rounded-full"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <p>Hostun başlatmasını gözləyirik...</p>
        </div>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mt-8"
        >
          <Sparkles size={32} className="mx-auto opacity-50" />
        </motion.div>
      </div>
    </div>
  );
}
