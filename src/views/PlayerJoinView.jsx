import { motion } from 'framer-motion';
import { ChevronLeft, AlertCircle, LogIn } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';

export default function PlayerJoinView({ pinInput, setPinInput, error, onJoin, onHome }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-600 via-fuchsia-600 to-purple-700 p-4 flex items-center justify-center relative overflow-hidden">
      <AnimatedBackground variant="pink" />
      <div className="max-w-md w-full relative z-10">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onHome}
          className="flex items-center gap-2 text-white hover:bg-white/10 px-4 py-2 rounded-xl mb-6 transition-colors"
        >
          <ChevronLeft size={20} /> Geri
        </motion.button>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring' }}
          className="bg-white rounded-3xl shadow-2xl p-8"
        >
          <motion.div
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mb-4"
          >
            <LogIn size={36} className="text-pink-600" />
          </motion.div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Oyuna qoşul</h2>
          <p className="text-gray-600 mb-6">Hostdan PIN kodu daxil edin</p>
          <input
            type="text"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
            onKeyDown={(e) => e.key === 'Enter' && onJoin()}
            placeholder="123456"
            maxLength={6}
            inputMode="numeric"
            className="w-full text-center text-5xl font-black tracking-[0.3em] py-5 border-4 border-gray-200 rounded-2xl focus:border-pink-600 outline-none mb-4 transition-colors"
          />
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 text-red-700 rounded-xl p-3 mb-4 flex items-center gap-2 text-sm"
            >
              <AlertCircle size={16} /> {error}
            </motion.div>
          )}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onJoin}
            disabled={pinInput.length !== 6}
            className="w-full bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-600 hover:to-fuchsia-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-black text-lg rounded-2xl py-4 shadow-xl transition-colors"
          >
            Davam et
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
