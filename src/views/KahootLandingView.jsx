import { motion } from 'framer-motion';
import { ChevronLeft, Shield, Smartphone, Zap } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';

export default function KahootLandingView({ onBack, onAdmin, onJoin }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-700 to-fuchsia-700 flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground variant="purple" />

      <div className="max-w-2xl w-full relative z-10">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-2 text-white hover:bg-white/10 px-4 py-2 rounded-xl mb-8 transition-colors"
        >
          <ChevronLeft size={20} /> Ana səhifə
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <motion.div
            animate={{ rotate: [-3, 3, -3], y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-2xl mb-5"
          >
            <Zap size={44} className="text-purple-600" />
          </motion.div>
          <h1 className="text-5xl font-black text-white mb-3 tracking-tight">Kahoot</h1>
          <p className="text-purple-100 text-lg">Sual yarat, PIN paylaş, canlı yarış başlasın</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAdmin}
            className="group bg-white rounded-3xl p-8 shadow-2xl text-left hover:shadow-purple-400/40 transition-shadow"
          >
            <div className="w-14 h-14 bg-purple-100 group-hover:bg-purple-600 rounded-2xl flex items-center justify-center mb-4 transition-colors">
              <Shield size={30} className="text-purple-600 group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Admin</h2>
            <p className="text-gray-600 text-sm">Quiz kitabxanasını idarə et, oyunu başlat.</p>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.98 }}
            onClick={onJoin}
            className="group bg-white rounded-3xl p-8 shadow-2xl text-left hover:shadow-pink-400/40 transition-shadow"
          >
            <div className="w-14 h-14 bg-pink-100 group-hover:bg-pink-600 rounded-2xl flex items-center justify-center mb-4 transition-colors">
              <Smartphone size={30} className="text-pink-600 group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">İştirakçı</h2>
            <p className="text-gray-600 text-sm">PIN kod ilə oyuna qoşul, sualları cavablandır.</p>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
