import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, AlertCircle, Check, Plus, Trash2 } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import { ANSWER_THEMES, QUESTION_TYPES } from '../lib/constants';
import { createQuestion, validateQuestion } from '../lib/scoring';

export default function AdminQuestionEditView({ initialQuestion, qIdx, onBack, onSave }) {
  const [d, setD] = useState(initialQuestion);
  const [error, setError] = useState('');

  const update = (patch) => setD({ ...d, ...patch });

  const switchType = (newType) => {
    setD({
      ...createQuestion(newType),
      id: d.id,
      text: d.text,
      timeUnit: d.timeUnit,
      timeValue: d.timeValue,
    });
  };

  const handleSave = () => {
    const err = validateQuestion(d);
    if (err) { setError(err); return; }
    onSave(d);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-700 to-fuchsia-700 p-4 sm:p-8 relative">
      <AnimatedBackground variant="purple" />
      <div className="max-w-3xl mx-auto relative z-10">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-2 text-white hover:bg-white/10 px-4 py-2 rounded-xl mb-6 transition-colors"
        >
          <ChevronLeft size={20} /> Geri
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 mb-6"
        >
          <h2 className="text-2xl font-black text-gray-900 mb-4">
            {qIdx === -1 ? 'Yeni sual' : `Sual ${qIdx + 1}`}
          </h2>

          {/* Type selector */}
          <label className="block text-sm font-bold text-gray-700 mb-2">Sual tipi</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
            {Object.entries(QUESTION_TYPES).map(([key, t]) => (
              <motion.button
                key={key}
                whileTap={{ scale: 0.95 }}
                onClick={() => switchType(key)}
                className={`rounded-xl p-3 text-center text-xs font-bold transition-all border-2 ${
                  d.type === key
                    ? 'bg-purple-600 text-white border-purple-700 shadow-lg'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-2xl mb-1">{t.icon}</div>
                <div className="leading-tight">{t.short}</div>
              </motion.button>
            ))}
          </div>

          {/* Question text */}
          <label className="block text-sm font-bold text-gray-700 mb-2">Sual mətni</label>
          <textarea
            value={d.text}
            onChange={(e) => update({ text: e.target.value })}
            placeholder="Sualınızı yazın..."
            rows={3}
            className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-600 outline-none transition-colors resize-none mb-6"
          />

          {/* Type-specific editors */}
          {d.type === 'multiple_choice' && <MultipleChoiceEditor d={d} update={update} />}
          {d.type === 'true_false' && <TrueFalseEditor d={d} update={update} />}
          {d.type === 'multiple_select' && <MultipleSelectEditor d={d} update={update} />}
          {d.type === 'type_answer' && <TypeAnswerEditor d={d} update={update} />}
          {d.type === 'sorting' && <SortingEditor d={d} update={update} />}

          {/* Time settings */}
          <label className="block text-sm font-bold text-gray-700 mb-3">Cavab vaxtı</label>
          <div className="flex gap-3 mb-3">
            <input
              type="number"
              min={1}
              value={d.timeValue}
              onChange={(e) => update({ timeValue: parseInt(e.target.value) || 0 })}
              className="flex-1 p-4 text-lg border-2 border-gray-200 rounded-xl outline-none focus:border-purple-600"
            />
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => update({ timeUnit: 'seconds' })}
                className={`px-5 py-2 rounded-lg font-bold ${d.timeUnit === 'seconds' ? 'bg-white shadow text-purple-600' : 'text-gray-600'}`}
              >
                San
              </button>
              <button
                onClick={() => update({ timeUnit: 'minutes' })}
                className={`px-5 py-2 rounded-lg font-bold ${d.timeUnit === 'minutes' ? 'bg-white shadow text-purple-600' : 'text-gray-600'}`}
              >
                Dəq
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[10, 20, 30, 60].map(s => (
              <button key={s} onClick={() => update({ timeValue: s, timeUnit: 'seconds' })} className="px-3 py-1.5 bg-gray-100 hover:bg-purple-100 hover:text-purple-700 rounded-lg text-sm font-semibold transition-colors">
                {s}s
              </button>
            ))}
            {[1, 2, 5].map(m => (
              <button key={`m${m}`} onClick={() => update({ timeValue: m, timeUnit: 'minutes' })} className="px-3 py-1.5 bg-gray-100 hover:bg-purple-100 hover:text-purple-700 rounded-lg text-sm font-semibold transition-colors">
                {m}dəq
              </button>
            ))}
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500 text-white rounded-xl p-4 mb-4 flex items-center gap-2"
          >
            <AlertCircle size={20} /> {error}
          </motion.div>
        )}

        <div className="flex gap-3">
          <button onClick={onBack} className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur text-white font-bold rounded-2xl py-4 transition-colors">
            Ləğv
          </button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl py-4 shadow-xl transition-colors"
          >
            Yadda saxla
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// SUB-EDITORS
// =====================================================================
function MultipleChoiceEditor({ d, update }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-bold text-gray-700">Variantlar (düzgün cavabı seçin)</label>
        <div className="flex bg-gray-100 rounded-lg p-1 text-sm">
          {[2, 3, 4].map(n => (
            <button
              key={n}
              onClick={() => {
                const opts = [...d.options];
                while (opts.length < n) opts.push('');
                opts.length = n;
                update({ options: opts, correct: Math.min(d.correct, n - 1) });
              }}
              className={`px-3 py-1 rounded-md font-bold transition-colors ${d.options.length === n ? 'bg-white shadow text-purple-600' : 'text-gray-600'}`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        {d.options.map((opt, i) => (
          <motion.div
            key={i}
            layout
            className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-colors ${d.correct === i ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}
          >
            <button
              onClick={() => update({ correct: i })}
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-2xl font-black flex-shrink-0 ${ANSWER_THEMES[i].bg}`}
            >
              {ANSWER_THEMES[i].shape}
            </button>
            <input
              type="text"
              value={opt}
              onChange={(e) => { const o = [...d.options]; o[i] = e.target.value; update({ options: o }); }}
              placeholder={`Variant ${i + 1}`}
              className="flex-1 outline-none bg-transparent"
            />
            <button
              onClick={() => update({ correct: i })}
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${d.correct === i ? 'bg-emerald-500 text-white' : 'bg-gray-200'}`}
            >
              {d.correct === i && <Check size={18} />}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TrueFalseEditor({ d, update }) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-bold text-gray-700 mb-3">Düzgün cavab</label>
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => update({ correct: 0 })}
          className={`p-6 rounded-2xl text-white font-black text-2xl transition-all ${d.correct === 0 ? 'bg-emerald-500 ring-4 ring-emerald-300 scale-105' : 'bg-gray-300 hover:bg-emerald-400'}`}
        >
          ✓ Hə
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => update({ correct: 1 })}
          className={`p-6 rounded-2xl text-white font-black text-2xl transition-all ${d.correct === 1 ? 'bg-rose-500 ring-4 ring-rose-300 scale-105' : 'bg-gray-300 hover:bg-rose-400'}`}
        >
          ✗ Yox
        </motion.button>
      </div>
    </div>
  );
}

function MultipleSelectEditor({ d, update }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-bold text-gray-700">Variantlar (bir neçə düzgün)</label>
        <div className="flex bg-gray-100 rounded-lg p-1 text-sm">
          {[2, 3, 4, 5, 6].map(n => (
            <button
              key={n}
              onClick={() => {
                const opts = [...d.options];
                while (opts.length < n) opts.push('');
                opts.length = n;
                update({ options: opts, correctIndices: (d.correctIndices || []).filter(i => i < n) });
              }}
              className={`px-2 py-1 rounded-md font-bold transition-colors ${d.options.length === n ? 'bg-white shadow text-purple-600' : 'text-gray-600'}`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        {d.options.map((opt, i) => {
          const isCorrect = d.correctIndices?.includes(i);
          return (
            <motion.div
              key={i}
              layout
              className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-colors ${isCorrect ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-2xl font-black flex-shrink-0 ${ANSWER_THEMES[i].bg}`}>
                {ANSWER_THEMES[i].shape}
              </div>
              <input
                type="text"
                value={opt}
                onChange={(e) => { const o = [...d.options]; o[i] = e.target.value; update({ options: o }); }}
                placeholder={`Variant ${i + 1}`}
                className="flex-1 outline-none bg-transparent"
              />
              <button
                onClick={() => {
                  const ci = new Set(d.correctIndices || []);
                  if (ci.has(i)) ci.delete(i); else ci.add(i);
                  update({ correctIndices: [...ci].sort((a, b) => a - b) });
                }}
                className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 border-2 transition-colors ${isCorrect ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-gray-300'}`}
              >
                {isCorrect && <Check size={18} />}
              </button>
            </motion.div>
          );
        })}
      </div>
      <p className="text-xs text-gray-500 mt-2">İştirakçılar bütün düzgün cavabları seçməlidirlər.</p>
    </div>
  );
}

function TypeAnswerEditor({ d, update }) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-bold text-gray-700 mb-3">Qəbul edilən cavablar</label>
      <p className="text-xs text-gray-500 mb-3">İştirakçının cavabı bu siyahıdan biri ilə uyğun olsa, düzgün hesab olunur (böyük/kiçik hərflər və boşluqlar nəzərə alınmır).</p>
      <div className="space-y-2">
        {d.acceptableAnswers.map((ans, i) => (
          <motion.div key={i} layout className="flex items-center gap-2">
            <input
              type="text"
              value={ans}
              onChange={(e) => { const a = [...d.acceptableAnswers]; a[i] = e.target.value; update({ acceptableAnswers: a }); }}
              placeholder={i === 0 ? 'Əsas düzgün cavab' : `Alternativ ${i}`}
              className="flex-1 p-3 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-600 transition-colors"
            />
            {d.acceptableAnswers.length > 1 && (
              <button onClick={() => update({ acceptableAnswers: d.acceptableAnswers.filter((_, j) => j !== i) })} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 size={18} />
              </button>
            )}
          </motion.div>
        ))}
      </div>
      <button
        onClick={() => update({ acceptableAnswers: [...d.acceptableAnswers, ''] })}
        className="mt-2 text-purple-600 font-semibold text-sm flex items-center gap-1 hover:text-purple-800 transition-colors"
      >
        <Plus size={16} /> Alternativ cavab əlavə et
      </button>
    </div>
  );
}

function SortingEditor({ d, update }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-bold text-gray-700">Elementlər (düzgün ardıcıllıqla)</label>
        <div className="flex bg-gray-100 rounded-lg p-1 text-sm">
          {[3, 4, 5, 6].map(n => (
            <button
              key={n}
              onClick={() => {
                const items = [...d.items];
                while (items.length < n) items.push('');
                items.length = n;
                update({ items });
              }}
              className={`px-2 py-1 rounded-md font-bold transition-colors ${d.items.length === n ? 'bg-white shadow text-purple-600' : 'text-gray-600'}`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs text-gray-500 mb-3">İştirakçılar elementləri qarışıq görəcək və düzgün ardıcıllıqla sıralayacaqlar.</p>
      <div className="space-y-2">
        {d.items.map((item, i) => (
          <motion.div key={i} layout className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-xl flex items-center justify-center font-black flex-shrink-0">
              {i + 1}
            </div>
            <input
              type="text"
              value={item}
              onChange={(e) => { const it = [...d.items]; it[i] = e.target.value; update({ items: it }); }}
              placeholder={`Sırada ${i + 1}-ci element`}
              className="flex-1 p-3 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-600 transition-colors"
            />
            <div className="flex flex-col gap-1">
              <button
                onClick={() => { if (i === 0) return; const it = [...d.items]; [it[i - 1], it[i]] = [it[i], it[i - 1]]; update({ items: it }); }}
                disabled={i === 0}
                className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-30 rounded text-xs transition-colors"
              >
                ▲
              </button>
              <button
                onClick={() => { if (i === d.items.length - 1) return; const it = [...d.items]; [it[i + 1], it[i]] = [it[i], it[i + 1]]; update({ items: it }); }}
                disabled={i === d.items.length - 1}
                className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-30 rounded text-xs transition-colors"
              >
                ▼
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
