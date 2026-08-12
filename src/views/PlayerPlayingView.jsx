import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Timer, Edit3, Check, X } from 'lucide-react';
import { ANSWER_THEMES } from '../lib/constants';
import { useQuestionTimer } from '../hooks/useQuestionTimer';
import { shuffle } from '../lib/utils';
import { sounds } from '../lib/sounds';

export default function PlayerPlayingView({ game, onSubmit }) {
  const q = game.questions[game.currentQuestionIndex];
  const { secondsLeft, percent } = useQuestionTimer(q, game.questionStartedAt, true);
  const [locked, setLocked] = useState(false);
  const [selected, setSelected] = useState(null);
  const [multiSelected, setMultiSelected] = useState([]);
  const [textAnswer, setTextAnswer] = useState('');
  const [sortingState, setSortingState] = useState({ slots: [], pool: [] });
  const lastTickedRef = useRef(0);

  // Reset state when question changes
  useEffect(() => {
    setLocked(false);
    setSelected(null);
    setMultiSelected([]);
    setTextAnswer('');
    if (q.type === 'sorting') {
      const shuffled = shuffle(q.items.map((item, idx) => ({ item, originalIdx: idx })));
      setSortingState({
        slots: q.items.map(() => null),
        pool: shuffled,
      });
    }
    sounds.questionStart();
  }, [game.currentQuestionIndex, q.type]);

  // Tick sound in last 5s
  useEffect(() => {
    if (secondsLeft <= 5 && secondsLeft > 0 && lastTickedRef.current !== secondsLeft) {
      sounds.tick();
      lastTickedRef.current = secondsLeft;
    }
  }, [secondsLeft]);

  const submit = (value) => {
    if (locked) return;
    setLocked(true);
    sounds.click();
    onSubmit(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-600 via-fuchsia-600 to-purple-700 p-4 flex flex-col">
      <div className="max-w-2xl w-full mx-auto flex flex-col flex-1">
        <div className="flex items-center justify-between text-white mb-3 flex-wrap gap-2">
          <span className="bg-white/20 backdrop-blur rounded-xl px-3 py-1 text-sm font-bold">
            Sual {game.currentQuestionIndex + 1} / {game.questions.length}
          </span>
          <motion.span
            animate={secondsLeft <= 5 ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5, repeat: secondsLeft <= 5 ? Infinity : 0 }}
            className={`backdrop-blur rounded-xl px-3 py-1 text-sm font-bold flex items-center gap-1 ${secondsLeft <= 5 ? 'bg-rose-500' : 'bg-white/20'}`}
          >
            <Timer size={14} /> {secondsLeft}s
          </motion.span>
        </div>
        <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full bg-white"
            style={{ width: `${percent}%` }}
            transition={{ ease: 'linear' }}
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-5 mb-4"
        >
          <p className="text-lg sm:text-xl font-bold text-gray-900 text-center">{q.text}</p>
        </motion.div>

        {q.type === 'multiple_choice' && (
          <div className="grid grid-cols-2 gap-3 flex-1">
            {q.options.map((opt, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05, type: 'spring' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setSelected(i); submit(i); }}
                disabled={locked}
                className={`${ANSWER_THEMES[i].bg} ${ANSWER_THEMES[i].hover} text-white rounded-2xl p-5 shadow-xl transition-all flex flex-col items-center justify-center gap-2 ${
                  locked && selected !== i ? 'opacity-30' : ''
                } ${selected === i ? 'ring-4 ring-white scale-105' : ''}`}
              >
                <span className="text-4xl">{ANSWER_THEMES[i].shape}</span>
                <span className="font-bold text-base sm:text-lg break-words text-center">{opt}</span>
              </motion.button>
            ))}
          </div>
        )}

        {q.type === 'true_false' && (
          <div className="grid grid-cols-2 gap-3 flex-1">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setSelected(0); submit(0); }}
              disabled={locked}
              className={`bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl p-8 shadow-xl flex flex-col items-center justify-center gap-3 transition-all ${
                locked && selected !== 0 ? 'opacity-30' : ''
              } ${selected === 0 ? 'ring-4 ring-white scale-105' : ''}`}
            >
              <span className="text-7xl">✓</span>
              <span className="font-black text-3xl">Hə</span>
            </motion.button>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setSelected(1); submit(1); }}
              disabled={locked}
              className={`bg-rose-500 hover:bg-rose-600 text-white rounded-2xl p-8 shadow-xl flex flex-col items-center justify-center gap-3 transition-all ${
                locked && selected !== 1 ? 'opacity-30' : ''
              } ${selected === 1 ? 'ring-4 ring-white scale-105' : ''}`}
            >
              <span className="text-7xl">✗</span>
              <span className="font-black text-3xl">Yox</span>
            </motion.button>
          </div>
        )}

        {q.type === 'multiple_select' && (
          <div className="flex flex-col flex-1">
            <div className="grid grid-cols-2 gap-3 flex-1 mb-3">
              {q.options.map((opt, i) => {
                const isSel = multiSelected.includes(i);
                return (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (locked) return;
                      sounds.click();
                      setMultiSelected(isSel ? multiSelected.filter(x => x !== i) : [...multiSelected, i]);
                    }}
                    disabled={locked}
                    className={`${ANSWER_THEMES[i].bg} ${ANSWER_THEMES[i].hover} text-white rounded-2xl p-4 shadow-xl flex flex-col items-center justify-center gap-2 transition-all ${
                      locked ? 'opacity-50' : ''
                    } ${isSel ? 'ring-4 ring-white scale-105' : ''}`}
                  >
                    <span className="text-3xl">{ANSWER_THEMES[i].shape}</span>
                    <span className="font-bold text-sm break-words text-center">{opt}</span>
                    {isSel && <Check size={20} />}
                  </motion.button>
                );
              })}
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => submit([...multiSelected].sort((a, b) => a - b))}
              disabled={locked || multiSelected.length === 0}
              className="bg-white text-purple-700 font-black text-lg rounded-2xl py-4 shadow-2xl disabled:opacity-50 transition-opacity"
            >
              Cavabı təsdiqlə ({multiSelected.length} seçildi)
            </motion.button>
          </div>
        )}

        {q.type === 'type_answer' && (
          <div className="flex flex-col flex-1">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-5 shadow-xl mb-3 flex-1"
            >
              <Edit3 size={32} className="text-purple-500 mb-3" />
              <input
                type="text"
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && textAnswer.trim() && !locked && submit(textAnswer.trim())}
                placeholder="Cavabınızı yazın..."
                disabled={locked}
                autoFocus
                className="w-full text-2xl font-bold border-b-4 border-purple-200 focus:border-purple-600 outline-none pb-2"
              />
            </motion.div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => submit(textAnswer.trim())}
              disabled={locked || !textAnswer.trim()}
              className="bg-white text-purple-700 font-black text-lg rounded-2xl py-4 shadow-2xl disabled:opacity-50 transition-opacity"
            >
              Cavabı göndər
            </motion.button>
          </div>
        )}

        {q.type === 'sorting' && (
          <div className="flex flex-col flex-1">
            <div className="bg-white rounded-2xl p-4 shadow-xl mb-3">
              <p className="text-sm font-bold text-gray-700 mb-2">Sıralama (1-dən {q.items.length}-ə):</p>
              <div className="space-y-2">
                {sortingState.slots.map((slot, idx) => (
                  <motion.div
                    key={idx}
                    layout
                    className={`flex items-center gap-2 p-2 rounded-xl border-2 ${
                      slot ? 'bg-purple-100 border-purple-300' : 'bg-gray-50 border-dashed border-gray-300'
                    }`}
                  >
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center font-black text-sm">
                      {idx + 1}
                    </div>
                    <span className="flex-1 font-bold text-gray-900">
                      {slot ? slot.item : <span className="text-gray-400 italic">boş</span>}
                    </span>
                    {slot && (
                      <button
                        onClick={() => {
                          if (locked) return;
                          sounds.click();
                          const newSlots = [...sortingState.slots];
                          newSlots[idx] = null;
                          setSortingState({ slots: newSlots, pool: [...sortingState.pool, slot] });
                        }}
                        className="text-rose-600 p-1 hover:bg-rose-50 rounded transition-colors"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
            {sortingState.pool.length > 0 && (
              <div className="bg-white/20 backdrop-blur rounded-2xl p-3 mb-3">
                <p className="text-white text-sm font-bold mb-2">Aşağıdan seçin:</p>
                <div className="flex flex-wrap gap-2">
                  {sortingState.pool.map((p, i) => (
                    <motion.button
                      key={`${p.originalIdx}-${i}`}
                      layout
                      whileTap={{ scale: 0.92 }}
                      onClick={() => {
                        if (locked) return;
                        sounds.click();
                        const slotIdx = sortingState.slots.findIndex(s => s === null);
                        if (slotIdx === -1) return;
                        const newSlots = [...sortingState.slots];
                        newSlots[slotIdx] = p;
                        const newPool = sortingState.pool.filter((_, j) => j !== i);
                        setSortingState({ slots: newSlots, pool: newPool });
                      }}
                      className="bg-white text-purple-700 font-bold px-4 py-2 rounded-xl shadow-md hover:scale-105 transition-transform"
                    >
                      {p.item}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => submit(sortingState.slots.map(s => s.item))}
              disabled={locked || sortingState.slots.some(s => s === null)}
              className="bg-white text-purple-700 font-black text-lg rounded-2xl py-4 shadow-2xl disabled:opacity-50 transition-opacity"
            >
              Sıralamanı təsdiqlə
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
