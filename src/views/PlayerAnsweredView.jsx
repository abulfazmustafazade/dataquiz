import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';

export default function PlayerAnsweredView({ playerName }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-600 via-fuchsia-600 to-purple-700 p-4 flex items-center justify-center relative overflow-hidden">
      <AnimatedBackground variant="pink" />
      <div className="max-w-md w-full text-center text-white relative z-10">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-2xl"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Check size={72} className="text-emerald-500" strokeWidth={3} />
          </motion.div>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-black mb-3"
        >
          Cavab göndərildi!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl opacity-90 mb-2"
        >
          {playerName}, gözlə...
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-base opacity-70 mb-8"
        >
          Digər iştirakçılar cavablayır
        </motion.p>
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-white rounded-full"
              animate={{ y: [0, -12, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
