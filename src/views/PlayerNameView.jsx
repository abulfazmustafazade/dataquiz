import { motion } from 'framer-motion';
import { AlertCircle, UserPlus } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';

export default function PlayerNameView({ nameInput, setNameInput, error, gameTitle, onSubmit }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-600 via-fuchsia-600 to-purple-700 p-4 flex items-center justify-center relative overflow-hidden">
      <AnimatedBackground variant="pink" />
      <div className="max-w-md w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-8"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mb-4"
          >
            <UserPlus size={36} className="text-pink-600" />
          </motion.div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Adın nədir?</h2>
          <p className="text-gray-600 mb-6 truncate">{gameTitle} oyununa xoş gəldin</p>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value.slice(0, 24))}
            onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
            placeholder="Adını yaz..."
            maxLength={24}
            autoFocus
            className="w-full text-center text-2xl font-bold py-4 border-4 border-gray-200 rounded-2xl focus:border-pink-600 outline-none mb-4 transition-colors"
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
            onClick={onSubmit}
            disabled={!nameInput.trim()}
            className="w-full bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-600 hover:to-fuchsia-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-black text-lg rounded-2xl py-4 shadow-xl transition-colors"
          >
            Oyuna keç
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
