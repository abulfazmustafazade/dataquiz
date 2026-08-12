import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Target, Timer, Edit3, Trash2, Clock, Play } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import { QUESTION_TYPES } from '../lib/constants';
import { formatTime, totalSeconds } from '../lib/utils';
import { quizLib } from '../lib/storage';
import { sounds } from '../lib/sounds';

export default function AdminQuizEditView({ quiz, onBack, onUpdate, onAddQuestion, onEditQuestion, onStart, onShowToast }) {
  const updateTitle = (title) => {
    const updated = { ...quiz, title };
    quizLib.save(updated);
    onUpdate(updated);
  };

  const deleteQuestion = (idx) => {
    if (!window.confirm('Bu sualı silmək istəyirsiniz?')) return;
    const newQs = quiz.questions.filter((_, i) => i !== idx);
    const updated = { ...quiz, questions: newQs };
    quizLib.save(updated);
    onUpdate(updated);
    onShowToast('Sual silindi', 'success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-700 to-fuchsia-700 p-4 sm:p-8 relative">
      <AnimatedBackground variant="purple" />
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-2 text-white hover:bg-white/10 px-4 py-2 rounded-xl mb-6 transition-colors"
        >
          <ChevronLeft size={20} /> Kitabxana
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 mb-6"
        >
          <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">Quiz Adı</label>
          <input
            type="text"
            value={quiz.title}
            onChange={(e) => updateTitle(e.target.value)}
            className="w-full text-3xl font-black text-gray-900 border-b-4 border-purple-200 focus:border-purple-600 outline-none pb-2 transition-colors"
          />
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
            <span className="flex items-center gap-1"><Target size={16} /> {quiz.questions.length} sual</span>
            <span className="flex items-center gap-1">
              <Timer size={16} /> {quiz.questions.reduce((s, q) => s + totalSeconds(q), 0)} saniyə
            </span>
          </div>
        </motion.div>

        <div className="space-y-3 mb-6">
          <AnimatePresence>
            {quiz.questions.map((q, idx) => (
              <motion.div
                key={q.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.03 }}
                className="bg-white rounded-2xl shadow-lg p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center font-black flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md font-bold">
                        {QUESTION_TYPES[q.type]?.icon} {QUESTION_TYPES[q.type]?.short}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={12} /> {formatTime(q.timeValue, q.timeUnit)}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 break-words">
                      {q.text || <em className="text-gray-400">(boş sual)</em>}
                    </h3>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button onClick={() => onEditQuestion(idx)} className="p-2 hover:bg-purple-100 rounded-lg transition-colors">
                      <Edit3 size={16} className="text-purple-600" />
                    </button>
                    <button onClick={() => deleteQuestion(idx)} className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl p-6 mb-6"
        >
          <h3 className="font-black text-gray-900 mb-3">Yeni sual əlavə et:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {Object.entries(QUESTION_TYPES).map(([key, type]) => (
              <motion.button
                key={key}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { sounds.click(); onAddQuestion(key); }}
                className="bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 hover:border-purple-400 rounded-xl p-4 text-center transition-all"
              >
                <div className="text-3xl mb-1">{type.icon}</div>
                <div className="text-xs font-bold text-purple-900 leading-tight">{type.short}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onStart(quiz)}
          disabled={quiz.questions.length === 0}
          className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-black text-xl rounded-2xl py-5 shadow-2xl flex items-center justify-center gap-3 transition-colors"
        >
          <Play size={24} /> Bu quizi indi başlat
        </motion.button>
      </div>
    </div>
  );
}
