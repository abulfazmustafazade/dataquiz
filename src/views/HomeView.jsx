import { motion } from 'framer-motion';
import { Zap, Radio, ArrowRight } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';
import AnimatedBackground from '../components/AnimatedBackground';

export default function HomeView({ onKahoot, onCrowd }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-700 to-fuchsia-700 flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground variant="purple" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl w-full relative z-10"
      >
        <div className="text-center mb-12">
          <BrandLogo size="lg" />
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="text-6xl font-black text-white mb-3 tracking-tight drop-shadow-lg mt-6 gradient-text"
          >
            BrainRushX!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-purple-100 font-medium"
          >
            Real vaxt rejimində interaktiv təlim platforması
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {/* Kahoot */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onKahoot}
            className="group bg-white rounded-3xl p-7 shadow-2xl hover:shadow-purple-500/50 text-left transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                <Zap size={28} className="text-purple-600 group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-xl font-black text-gray-900">Kahoot</h2>
            </div>
            <p className="text-gray-500 text-sm mb-4">Quiz yarat və ya PIN ilə canlı yarışa qoşul.</p>
            <div className="flex items-center gap-1 text-purple-600 font-bold text-sm">
              Admin · İştirakçı <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>

          {/* Crowd */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCrowd}
            className="group bg-white rounded-3xl p-7 shadow-2xl hover:shadow-teal-500/50 text-left transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center group-hover:bg-teal-600 transition-colors">
                <Radio size={28} className="text-teal-600 group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-xl font-black text-gray-900">Crowd</h2>
            </div>
            <p className="text-gray-500 text-sm mb-4">Sual, fikir, sorğu yarat — icma səs versin.</p>
            <div className="flex items-center gap-1 text-teal-600 font-bold text-sm">
              Crowd sessiyası <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center text-purple-200 mt-10 text-sm"
        >
          🧠 Your Knowledge. Your Crowd. Your Game.
        </motion.p>
      </motion.div>
    </div>
  );
}
