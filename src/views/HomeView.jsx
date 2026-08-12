import { motion } from 'framer-motion';
import { Shield, Smartphone, ArrowRight } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';
import AnimatedBackground from '../components/AnimatedBackground';

export default function HomeView({ onAdmin, onJoin }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-700 to-fuchsia-700 flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground variant="purple" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full relative z-10"
      >
        <div className="text-center mb-12">
          <BrandLogo size="lg" />
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="text-6xl font-black text-white mb-3 tracking-tight drop-shadow-lg mt-6 gradient-text"
          >
            QuizLive!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-purple-100 font-medium"
          >
            Real vaxt rejimində interaktiv təlim quiz platforması
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAdmin}
            className="group bg-white rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/50 text-left transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                <Shield size={32} className="text-purple-600 group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">Admin</h2>
            </div>
            <p className="text-gray-600 mb-4">Quiz kitabxanasını idarə et, sual əlavə et, oyunu başlat.</p>
            <div className="flex items-center gap-2 text-purple-600 font-bold">
              Quiz kitabxanası <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onJoin}
            className="group bg-white rounded-3xl p-8 shadow-2xl hover:shadow-pink-500/50 text-left transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center group-hover:bg-pink-600 transition-colors">
                <Smartphone size={32} className="text-pink-600 group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">İştirakçı</h2>
            </div>
            <p className="text-gray-600 mb-4">PIN kod ilə oyuna qoşul və sualları cavablandır.</p>
            <div className="flex items-center gap-2 text-pink-600 font-bold">
              Oyuna qoşul <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-purple-200 mt-10 text-sm"
        >
          Eyni vaxtda bir neçə cihazdan qoşulmaq olar
        </motion.p>
      </motion.div>
    </div>
  );
}
