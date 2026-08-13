import { motion } from 'framer-motion';
import { AlertCircle, UserPlus } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import { GENDER_AVATARS } from '../lib/constants';
import { avatarUrl } from '../lib/utils';

export default function PlayerNameView({
  nameInput, setNameInput,
  gender, setGender,
  avatarInput, setAvatarInput,
  error, gameTitle, onSubmit,
}) {
  const options = GENDER_AVATARS[gender] || GENDER_AVATARS.male;

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
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 mx-auto bg-pink-100 rounded-2xl flex items-center justify-center mb-4 overflow-hidden"
          >
            {avatarInput ? (
              <img src={avatarUrl(avatarInput)} alt="" className="w-full h-full object-cover" />
            ) : (
              <UserPlus size={36} className="text-pink-600" />
            )}
          </motion.div>
          <h2 className="text-3xl font-black text-gray-900 mb-2 text-center">Adın nədir?</h2>
          <p className="text-gray-600 mb-6 truncate text-center">{gameTitle} oyununa xoş gəldin</p>

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

          <label className="block text-sm font-bold text-gray-600 mb-2">Avatar seç</label>
          <div className="flex bg-gray-100 rounded-xl p-1 mb-3">
            <button
              onClick={() => { setGender('male'); setAvatarInput(GENDER_AVATARS.male[0]); }}
              className={`flex-1 py-2 rounded-lg font-bold text-sm transition-colors ${gender === 'male' ? 'bg-white shadow text-pink-600' : 'text-gray-500'}`}
            >
              Kişi
            </button>
            <button
              onClick={() => { setGender('female'); setAvatarInput(GENDER_AVATARS.female[0]); }}
              className={`flex-1 py-2 rounded-lg font-bold text-sm transition-colors ${gender === 'female' ? 'bg-white shadow text-pink-600' : 'text-gray-500'}`}
            >
              Qadın
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-6 max-h-64 overflow-y-auto pr-1">
            {options.map((charId) => (
              <motion.button
                key={charId}
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => setAvatarInput(charId)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  avatarInput === charId ? 'border-pink-500 bg-pink-50 scale-105' : 'border-gray-200 hover:border-pink-300'
                }`}
              >
                <img src={avatarUrl(charId)} alt="" className="w-full h-full object-cover" />
              </motion.button>
            ))}
          </div>

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
