import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Library, Plus, Search, Download, Upload, Play, Edit3, Copy, Trash2, Target, Clock } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import { quizLib } from '../lib/storage';
import { QUESTION_TYPES } from '../lib/constants';
import { sounds } from '../lib/sounds';

export default function AdminLibraryView({ library, onRefresh, onHome, onCreate, onEdit, onStart, onShowToast }) {
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef(null);

  const filtered = library.filter(q => q.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Bu quizi silmək istədiyinizdən əminsiniz?')) return;
    quizLib.delete(id);
    onRefresh();
    onShowToast('Quiz silindi', 'success');
  };

  const handleDuplicate = (id, e) => {
    e.stopPropagation();
    quizLib.duplicate(id);
    onRefresh();
    sounds.click();
    onShowToast('Quiz kopyalandı', 'success');
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const count = quizLib.import(ev.target.result);
      if (count === -1) onShowToast('Fayl formatı yanlışdır', 'error');
      else { onRefresh(); onShowToast(`${count} quiz idxal edildi`, 'success'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-700 to-fuchsia-700 p-4 sm:p-8 relative">
      <AnimatedBackground variant="purple" />
      <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <button onClick={onHome} className="flex items-center gap-2 text-white hover:bg-white/10 px-4 py-2 rounded-xl transition-colors">
            <Home size={20} /> Ana səhifə
          </button>
          <div className="flex items-center gap-2 text-white">
            <Library size={20} /><span className="font-bold">Quiz Kitabxanası</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-2xl p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Quiz axtar..."
                className="w-full pl-11 pr-4 py-3 bg-gray-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => { sounds.click(); onCreate(); }}
              className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-bold rounded-xl px-6 py-3 flex items-center justify-center gap-2 shadow-lg"
            >
              <Plus size={20} /> Yeni Quiz
            </motion.button>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <button onClick={() => quizLib.exportAll()} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg px-3 py-1.5 flex items-center gap-1 transition-colors">
              <Download size={14} /> Yedək al
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg px-3 py-1.5 flex items-center gap-1 transition-colors">
              <Upload size={14} /> Yedəkdən bərpa et
            </button>
            <span className="text-gray-500 ml-auto py-1.5">Cəmi: <b>{library.length}</b> quiz</span>
          </div>
        </motion.div>

        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur border-2 border-dashed border-white/30 rounded-3xl p-12 text-center text-white"
          >
            <Library size={64} className="mx-auto mb-4 opacity-50" />
            <p className="text-xl font-bold mb-2">
              {library.length === 0 ? 'Hələ heç bir quiz yoxdur' : 'Axtarışa uyğun nəticə yoxdur'}
            </p>
            {library.length === 0 && (
              <button onClick={onCreate} className="mt-4 bg-white text-purple-700 font-bold px-6 py-3 rounded-xl">
                İlk quizi yarat
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filtered.map((q, idx) => (
                <motion.div
                  key={q.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: idx * 0.03 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-2xl transition-shadow flex flex-col"
                >
                  <h3 className="font-black text-gray-900 mb-2 text-lg break-words line-clamp-2">{q.title}</h3>
                  <div className="text-sm text-gray-500 mb-3 space-y-1">
                    <div className="flex items-center gap-1"><Target size={14} /> {q.questions?.length || 0} sual</div>
                    <div className="flex items-center gap-1"><Clock size={14} /> {new Date(q.updatedAt).toLocaleDateString('az-AZ')}</div>
                  </div>
                  <div className="flex gap-1 mb-3 flex-wrap">
                    {[...new Set((q.questions || []).map(x => x.type))].slice(0, 4).map(t => (
                      <span key={t} className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md font-semibold">
                        {QUESTION_TYPES[t]?.icon} {QUESTION_TYPES[t]?.short}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      onClick={() => { sounds.click(); onStart(q); }}
                      disabled={!q.questions?.length}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 text-white font-bold rounded-xl py-2 text-sm flex items-center justify-center gap-1 transition-colors"
                    >
                      <Play size={14} /> Başlat
                    </motion.button>
                    <button onClick={() => onEdit(q.id)} className="bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl p-2 transition-colors">
                      <Edit3 size={16} />
                    </button>
                    <button onClick={(e) => handleDuplicate(q.id, e)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl p-2 transition-colors">
                      <Copy size={16} />
                    </button>
                    <button onClick={(e) => handleDelete(q.id, e)} className="bg-red-50 hover:bg-red-100 text-red-600 rounded-xl p-2 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
