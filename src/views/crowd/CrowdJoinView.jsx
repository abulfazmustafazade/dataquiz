import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, AlertCircle, Radio } from 'lucide-react';
import AnimatedBackground from '../../components/AnimatedBackground';
import { crowdAPI } from '../../lib/crowdAPI';

export default function CrowdJoinView({ initialPin = '', onBack, onJoined }) {
  const [pinInput, setPinInput] = useState(initialPin);
  const [nameInput, setNameInput] = useState('');
  const [step, setStep] = useState(initialPin ? 'name' : 'pin'); // 'pin' | 'name'
  const [error, setError] = useState('');
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePin = async () => {
    if (pinInput.length !== 6) { setError('PIN 6 rəqəm olmalıdır'); return; }
    setLoading(true);
    const s = await crowdAPI.get(pinInput);
    setLoading(false);
    if (!s) { setError('Sessiya tapılmadı'); return; }
    if (s.status === 'closed') { setError('Bu sessiya bağlanıb'); return; }
    setSession(s);
    setError('');
    setStep('name');
  };

  const handleName = async () => {
    const name = nameInput.trim();
    if (!name) { setError('Ad boş ola bilməz'); return; }
    // Increment participant count
    await crowdAPI.update(pinInput, { participants: (session.participants || 0) + 1 });
    onJoined({ pin: pinInput, name, session });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 via-cyan-700 to-emerald-700 p-4 flex items-center justify-center relative overflow-hidden">
      <AnimatedBackground variant="emerald" />
      <div className="max-w-md w-full relative z-10">
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={onBack}
          className="flex items-center gap-2 text-white hover:bg-white/10 px-4 py-2 rounded-xl mb-6 transition-colors">
          <ChevronLeft size={20} /> Geri
        </motion.button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mb-4">
            <Radio size={32} className="text-teal-600" />
          </div>

          {step === 'pin' ? (
            <>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Sessiyaya qoşul</h2>
              <p className="text-gray-500 text-sm mb-6">Hostdan aldığınız 6 rəqəmli PIN-i daxil edin</p>
              <input
                type="text" inputMode="numeric" maxLength={6}
                value={pinInput} onChange={e => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                onKeyDown={e => e.key === 'Enter' && handlePin()}
                placeholder="123456"
                className="w-full text-center text-5xl font-black tracking-[0.3em] py-5 border-4 border-gray-200 rounded-2xl focus:border-teal-500 outline-none mb-4 transition-colors"
              />
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-red-50 text-red-700 rounded-xl p-3 mb-4 flex items-center gap-2 text-sm">
                  <AlertCircle size={16} /> {error}
                </motion.div>
              )}
              <motion.button whileTap={{ scale: 0.97 }} onClick={handlePin}
                disabled={pinInput.length !== 6 || loading}
                className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-black text-lg rounded-2xl py-4 shadow-xl transition-colors">
                {loading ? 'Yoxlanılır...' : 'Davam et'}
              </motion.button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-black text-gray-900 mb-1">Adın nədir?</h2>
              <p className="text-gray-500 text-sm mb-1 truncate font-semibold">{session?.title}</p>
              {session?.settings?.anonymous && (
                <p className="text-xs text-teal-600 font-bold mb-4">👁‍🗨 Bu sessiya anonimdir — adın göründənin seçimidir</p>
              )}
              <input type="text" value={nameInput}
                onChange={e => setNameInput(e.target.value.slice(0, 30))}
                onKeyDown={e => e.key === 'Enter' && handleName()}
                placeholder="Adınızı yazın..." maxLength={30} autoFocus
                className="w-full text-center text-2xl font-bold py-4 border-4 border-gray-200 rounded-2xl focus:border-teal-500 outline-none mb-4 transition-colors"
              />
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-red-50 text-red-700 rounded-xl p-3 mb-4 flex items-center gap-2 text-sm">
                  <AlertCircle size={16} /> {error}
                </motion.div>
              )}
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleName}
                disabled={!nameInput.trim()}
                className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-black text-lg rounded-2xl py-4 shadow-xl transition-colors">
                Qoşul
              </motion.button>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
