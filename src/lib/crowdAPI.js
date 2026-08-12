import { getDatabase, ref, set, update, get, push, onValue, off, increment, runTransaction } from 'firebase/database';

// Re-use the same Firebase app instance from firebase.js
// Import db from there — we just extend the API
import { FIREBASE_OK } from './firebase.js';

let _db = null;
const getDb = () => {
  if (!_db) {
    try { _db = getDatabase(); } catch { return null; }
  }
  return _db;
};

export { FIREBASE_OK };

// ── Session ──────────────────────────────────────────────────────────
export const crowdAPI = {

  // Create a new crowd session
  create: async (pin, data) => {
    const db = getDb(); if (!db) return false;
    try {
      await set(ref(db, `crowd/${pin}`), {
        ...data,
        createdAt: Date.now(),
        status: 'open',
        prompt: { type: 'question', text: '', options: [] },
      });
      return true;
    } catch (e) { console.error(e); return false; }
  },

  // Read once
  get: async (pin) => {
    const db = getDb(); if (!db) return null;
    try {
      const snap = await get(ref(db, `crowd/${pin}`));
      return snap.val();
    } catch { return null; }
  },

  // Update session fields (status, settings, prompt…)
  update: async (pin, updates) => {
    const db = getDb(); if (!db) return;
    await update(ref(db, `crowd/${pin}`), updates);
  },

  // Real-time listener for the whole session node
  listen: (pin, cb) => {
    const db = getDb(); if (!db) return () => {};
    const r = ref(db, `crowd/${pin}`);
    const h = snap => cb(snap.val());
    onValue(r, h);
    return () => off(r, 'value', h);
  },

  // ── Items ──────────────────────────────────────────────────────────

  // Submit a new item (question / idea / poll answer)
  submit: async (pin, item) => {
    const db = getDb(); if (!db) return null;
    const itemsRef = ref(db, `crowd/${pin}/items`);
    const newRef = push(itemsRef);
    await set(newRef, { ...item, createdAt: Date.now(), votes: 0, starred: false, resolved: false });
    return newRef.key;
  },

  // Host: approve a pending item (when moderation=true)
  approve: async (pin, itemId) => {
    const db = getDb(); if (!db) return;
    await update(ref(db, `crowd/${pin}/items/${itemId}`), { status: 'approved' });
  },

  // Host: reject / delete an item
  remove: async (pin, itemId) => {
    const db = getDb(); if (!db) return;
    await set(ref(db, `crowd/${pin}/items/${itemId}`), null);
  },

  // Host: star (pin) an item
  star: async (pin, itemId, starred) => {
    const db = getDb(); if (!db) return;
    await update(ref(db, `crowd/${pin}/items/${itemId}`), { starred });
  },

  // Host: mark as resolved
  resolve: async (pin, itemId, resolved) => {
    const db = getDb(); if (!db) return;
    await update(ref(db, `crowd/${pin}/items/${itemId}`), { resolved });
  },

  // ── Voting ────────────────────────────────────────────────────────

  // Cast or change vote. delta = +1 | -1 | 0 (remove vote)
  vote: async (pin, itemId, userId, delta) => {
    const db = getDb(); if (!db) return;
    const voteRef = ref(db, `crowd/${pin}/votes/${itemId}/${userId}`);
    const itemRef = ref(db, `crowd/${pin}/items/${itemId}`);

    // Read previous vote to compute diff
    const prev = await get(voteRef);
    const prevVal = prev.val() || 0;
    const diff = delta - prevVal;           // net change to apply to counter

    if (delta === 0) await set(voteRef, null);
    else await set(voteRef, delta);

    if (diff !== 0) await update(itemRef, { votes: increment(diff) });
  },

  // Read user's own votes for this session
  getMyVotes: async (pin, userId) => {
    const db = getDb(); if (!db) return {};
    try {
      const snap = await get(ref(db, `crowd/${pin}/votes`));
      const allVotes = snap.val() || {};
      // Build {itemId: 1|-1} for this user
      const mine = {};
      Object.entries(allVotes).forEach(([itemId, uVotes]) => {
        if (uVotes?.[userId]) mine[itemId] = uVotes[userId];
      });
      return mine;
    } catch { return {}; }
  },

  // ── Poll votes ────────────────────────────────────────────────────
  pollVote: async (pin, userId, optionIdx) => {
    const db = getDb(); if (!db) return;
    const prev = await get(ref(db, `crowd/${pin}/pollVotes/${userId}`));
    const prevIdx = prev.val();
    // Remove old counter
    if (prevIdx !== null && prevIdx !== undefined) {
      await update(ref(db, `crowd/${pin}/pollCounts`), { [prevIdx]: increment(-1) });
    }
    await set(ref(db, `crowd/${pin}/pollVotes/${userId}`), optionIdx);
    await update(ref(db, `crowd/${pin}/pollCounts`), { [optionIdx]: increment(1) });
  },
};
