import { motion } from 'framer-motion';
import { ChevronLeft, Radio, Users } from 'lucide-react';
import AnimatedBackground from '../../components/AnimatedBackground';
import BrandLogo from '../../components/BrandLogo';

export default function CrowdLandingView({ onBack, onHost, onJoin }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 via-cyan-700 to-emerald-700 flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground variant="emerald" />

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
            <Radio size={44} className="text-teal-600" />
          </motion.div>
          <h1 className="text-5xl font-black text-white mb-3 tracking-tight">Crowd</h1>
          <p className="text-teal-100 text-lg">Sual ver, fikir paylaş, səs ver — icma qərar verir</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.98 }}
            onClick={onHost}
            className="group bg-white rounded-3xl p-8 shadow-2xl text-left hover:shadow-teal-400/40 transition-shadow"
          >
            <div className="w-14 h-14 bg-teal-100 group-hover:bg-teal-600 rounded-2xl flex items-center justify-center mb-4 transition-colors">
              <Radio size={30} className="text-teal-600 group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Sessiya aç</h2>
            <p className="text-gray-600 text-sm">Mövzu yarat, PIN paylaş, icmanın cavablarını idarə et.</p>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.98 }}
            onClick={onJoin}
            className="group bg-white rounded-3xl p-8 shadow-2xl text-left hover:shadow-emerald-400/40 transition-shadow"
          >
            <div className="w-14 h-14 bg-emerald-100 group-hover:bg-emerald-600 rounded-2xl flex items-center justify-center mb-4 transition-colors">
              <Users size={30} className="text-emerald-600 group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Sessiyaya qoşul</h2>
            <p className="text-gray-600 text-sm">PIN kod ilə qoşul, sual ver, fikir paylaş, səs ver.</p>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
