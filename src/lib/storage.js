import { genId } from './utils';

const QUIZ_LIBRARY_KEY = 'quizlive_library_v2';

export const quizLib = {
  getAll: () => {
    try {
      const raw = localStorage.getItem(QUIZ_LIBRARY_KEY);
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  },

  save: (quiz) => {
    const all = quizLib.getAll();
    const idx = all.findIndex(q => q.id === quiz.id);
    const updated = { ...quiz, updatedAt: Date.now() };
    if (idx >= 0) all[idx] = updated;
    else all.unshift({ ...updated, createdAt: updated.createdAt || Date.now() });
    try {
      localStorage.setItem(QUIZ_LIBRARY_KEY, JSON.stringify(all));
    } catch (e) {
      console.error('localStorage save failed:', e);
    }
    return updated;
  },

  delete: (id) => {
    const all = quizLib.getAll().filter(q => q.id !== id);
    localStorage.setItem(QUIZ_LIBRARY_KEY, JSON.stringify(all));
  },

  duplicate: (id) => {
    const all = quizLib.getAll();
    const orig = all.find(q => q.id === id);
    if (!orig) return null;
    const copy = {
      ...JSON.parse(JSON.stringify(orig)),
      id: genId(),
      title: orig.title + ' (kopya)',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      questions: orig.questions.map(q => ({ ...q, id: genId() })),
    };
    all.unshift(copy);
    localStorage.setItem(QUIZ_LIBRARY_KEY, JSON.stringify(all));
    return copy;
  },

  exportAll: () => {
    const data = quizLib.getAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quizlive-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  import: (jsonText) => {
    try {
      const data = JSON.parse(jsonText);
      if (!Array.isArray(data)) throw new Error('Invalid format');
      const existing = quizLib.getAll();
      const merged = [
        ...data.map(q => ({ ...q, id: q.id || genId() })),
        ...existing,
      ];
      const seen = new Set();
      const unique = merged.filter(q => seen.has(q.id) ? false : seen.add(q.id));
      localStorage.setItem(QUIZ_LIBRARY_KEY, JSON.stringify(unique));
      return data.length;
    } catch (e) {
      console.error(e);
      return -1;
    }
  },
};
