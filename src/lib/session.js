// Persists the current host/player session across page refreshes.
// sessionStorage (not localStorage) — survives a reload of the same tab but
// clears when the tab closes, which matches how long a "join a live game"
// session should reasonably live.
const KEY = 'quizlive_session_v1';

export const gameSession = {
  save: (data) => {
    try { sessionStorage.setItem(KEY, JSON.stringify(data)); } catch {}
  },
  load: () => {
    try {
      const raw = sessionStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  clear: () => {
    try { sessionStorage.removeItem(KEY); } catch {}
  },
};
