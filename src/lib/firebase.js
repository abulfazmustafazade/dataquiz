import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, update, get, onValue, off, child, runTransaction } from 'firebase/database';
import { GAME_STATUS } from './constants';

// =====================================================================
// 🔥 FIREBASE CONFIG — dəyərlər .env faylından oxunur (bax: .env.example)
// Bu sayədə əsl açarlar heç vaxt git-ə commit olunmur.
// =====================================================================
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const FIREBASE_OK = Boolean(firebaseConfig.apiKey && firebaseConfig.databaseURL);

let db = null;

if (FIREBASE_OK) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getDatabase(app);

    // Analytics is optional and unsupported in some environments (SSR, older
    // browsers) — never let it break the app if it fails to load.
    if (firebaseConfig.measurementId) {
      import('firebase/analytics')
        .then(({ isSupported, getAnalytics }) => isSupported().then((ok) => ok && getAnalytics(app)))
        .catch((e) => console.warn('Firebase Analytics disabled:', e));
    }
  } catch (e) {
    console.error('Firebase init error:', e);
    db = null;
  }
} else {
  console.error('Firebase config missing — .env faylını yoxlayın (bax: .env.example)');
}

// =====================================================================
// GAME API — granular updates to avoid race conditions and reduce traffic
// =====================================================================
export const gameAPI = {
  // Read full game once
  get: async (pin) => {
    if (!db) return null;
    try {
      const snap = await get(child(ref(db), `games/${pin}`));
      return snap.val();
    } catch (e) {
      console.error('gameAPI.get error:', e);
      return null;
    }
  },

  // Create a NEW game at this PIN — fails (does not overwrite) if the PIN is
  // already in use, so two hosts can never collide on the same code.
  create: async (pin, data) => {
    if (!db) return false;
    try {
      const result = await runTransaction(ref(db, `games/${pin}`), (current) => {
        if (current !== null) return; // abort — PIN already taken
        return data;
      });
      return result.committed;
    } catch (e) {
      console.error('gameAPI.create error:', e);
      return false;
    }
  },

  // Permanently delete a game (used to clean up after it's finished)
  remove: async (pin) => {
    if (!db) return false;
    try {
      await set(ref(db, `games/${pin}`), null);
      return true;
    } catch (e) {
      console.error('gameAPI.remove error:', e);
      return false;
    }
  },

  // Granular update — only writes the changed fields
  update: async (pin, updates) => {
    if (!db) return false;
    try {
      await update(ref(db, `games/${pin}`), updates);
      return true;
    } catch (e) {
      console.error('gameAPI.update error:', e);
      return false;
    }
  },

  // Add a player only if their name isn't already taken — atomic check-and-set
  // so two players joining at the same instant can't both grab the same name.
  addPlayerIfNameFree: async (pin, playerId, playerData) => {
    if (!db) return { ok: false };
    try {
      const nameLower = (playerData.name || '').toLowerCase();
      const result = await runTransaction(ref(db, `games/${pin}/players`), (current) => {
        const players = current || {};
        const taken = Object.values(players).some(p => (p?.name || '').toLowerCase() === nameLower);
        if (taken) return; // abort — name already in use
        return { ...players, [playerId]: playerData };
      });
      return { ok: result.committed, reason: result.committed ? null : 'name-taken' };
    } catch (e) {
      console.error('addPlayerIfNameFree error:', e);
      return { ok: false, reason: 'error' };
    }
  },

  // Atomically score the current question AND move PLAYING -> SHOWING_RESULTS
  // in a SINGLE write. `computeFn(current)` receives the live game object and
  // must return the full updated game object (or undefined to abort).
  //
  // Both guarantees matter here:
  //  - Guards against the manual "show results" button and the auto-timer
  //    firing at once (only one commits, since it re-checks status is still
  //    PLAYING), which would otherwise double-award points.
  //  - Scores and the status flip land in the same commit, so no listener
  //    (host or player) can ever observe SHOWING_RESULTS with answers that
  //    aren't scored yet — which previously showed as a flash of "wrong" for
  //    correct answers, and let the host/player screens briefly disagree.
  finishQuestion: async (pin, computeFn) => {
    if (!db) return { ok: false };
    try {
      const result = await runTransaction(ref(db, `games/${pin}`), (current) => {
        if (!current || current.status !== GAME_STATUS.PLAYING) return; // abort
        return computeFn(current);
      });
      return { ok: result.committed, game: result.committed ? result.snapshot.val() : null };
    } catch (e) {
      console.error('finishQuestion error:', e);
      return { ok: false };
    }
  },

  // Submit an answer atomically (only writes to the player's answer slot)
  submitAnswer: async (pin, qIdx, playerId, answer) => {
    if (!db) return false;
    try {
      await set(ref(db, `games/${pin}/answers/${qIdx}/${playerId}`), answer);
      return true;
    } catch (e) {
      console.error('submitAnswer error:', e);
      return false;
    }
  },

  // Real-time listener — returns unsubscribe function
  listen: (pin, callback) => {
    if (!db) return () => {};
    const gameRef = ref(db, `games/${pin}`);
    const handler = (snap) => callback(snap.val());
    onValue(gameRef, handler);
    return () => off(gameRef, 'value', handler);
  },

  // Listen to a specific subpath (more efficient for large games)
  listenTo: (path, callback) => {
    if (!db) return () => {};
    const r = ref(db, path);
    const handler = (snap) => callback(snap.val());
    onValue(r, handler);
    return () => off(r, 'value', handler);
  },
};
