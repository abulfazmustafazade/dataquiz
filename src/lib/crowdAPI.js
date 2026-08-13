import { getApp } from 'firebase/app';
import {
  getDatabase, ref, set, update, get,
  push, onValue, off, increment, runTransaction
} from 'firebase/database';

// Import firebase.js to ensure the app is initialized before we use it
import { FIREBASE_OK } from './firebase.js';
export { FIREBASE_OK };

// Gets the already-initialized Firebase app's database (no duplicate init)
const getDb = () => {
  try {
    return getDatabase(getApp());
  } catch (e) {
    console.error('crowdAPI: Firebase db error:', e);
    return null;
  }
};

export const crowdAPI = {

  // Transaction-based — fails instead of overwriting if the PIN is already in use
  create: async (pin, data) => {
    const db = getDb(); if (!db) return false;
    try {
      const result = await runTransaction(ref(db, `crowd/${pin}`), (current) => {
        if (current !== null) return; // abort — PIN already taken
        return {
          ...data,
          createdAt: Date.now(),
          status: 'open',
        };
      });
      return result.committed;
    } catch (e) { console.error(e); return false; }
  },

  get: async (pin) => {
    const db = getDb(); if (!db) return null;
    try {
      const snap = await get(ref(db, `crowd/${pin}`));
      return snap.val();
    } catch (e) { console.error(e); return null; }
  },

  update: async (pin, updates) => {
    const db = getDb(); if (!db) return;
    try { await update(ref(db, `crowd/${pin}`), updates); }
    catch (e) { console.error(e); }
  },

  // Atomic — avoids lost updates when multiple participants join at once
  incrementParticipants: async (pin) => {
    const db = getDb(); if (!db) return;
    try { await update(ref(db, `crowd/${pin}`), { participants: increment(1) }); }
    catch (e) { console.error(e); }
  },

  listen: (pin, cb) => {
    const db = getDb(); if (!db) return () => {};
    const r = ref(db, `crowd/${pin}`);
    const h = snap => cb(snap.val());
    onValue(r, h);
    return () => off(r, 'value', h);
  },

  submit: async (pin, item) => {
    const db = getDb(); if (!db) return null;
    try {
      const newRef = push(ref(db, `crowd/${pin}/items`));
      await set(newRef, {
        ...item,
        createdAt: Date.now(),
        votes: 0,
        starred: false,
        resolved: false,
      });
      return newRef.key;
    } catch (e) { console.error(e); return null; }
  },

  approve: async (pin, itemId) => {
    const db = getDb(); if (!db) return;
    await update(ref(db, `crowd/${pin}/items/${itemId}`), { status: 'approved' });
  },

  remove: async (pin, itemId) => {
    const db = getDb(); if (!db) return;
    await set(ref(db, `crowd/${pin}/items/${itemId}`), null);
  },

  star: async (pin, itemId, starred) => {
    const db = getDb(); if (!db) return;
    await update(ref(db, `crowd/${pin}/items/${itemId}`), { starred });
  },

  resolve: async (pin, itemId, resolved) => {
    const db = getDb(); if (!db) return;
    await update(ref(db, `crowd/${pin}/items/${itemId}`), { resolved });
  },

  vote: async (pin, itemId, userId, delta) => {
    const db = getDb(); if (!db) return;
    try {
      const voteRef = ref(db, `crowd/${pin}/votes/${itemId}/${userId}`);
      const itemRef = ref(db, `crowd/${pin}/items/${itemId}`);
      const prev = await get(voteRef);
      const prevVal = prev.val() || 0;
      const diff = delta - prevVal;
      if (delta === 0) await set(voteRef, null);
      else await set(voteRef, delta);
      if (diff !== 0) await update(itemRef, { votes: increment(diff) });
    } catch (e) { console.error(e); }
  },

  getMyVotes: async (pin, userId) => {
    const db = getDb(); if (!db) return {};
    try {
      const snap = await get(ref(db, `crowd/${pin}/votes`));
      const allVotes = snap.val() || {};
      const mine = {};
      Object.entries(allVotes).forEach(([itemId, uVotes]) => {
        if (uVotes?.[userId]) mine[itemId] = uVotes[userId];
      });
      return mine;
    } catch { return {}; }
  },

  // pollIndex identifies WHICH poll question within the session (a session
  // can hold multiple poll questions) — votes/counts are tracked per index.
  pollVote: async (pin, userId, pollIndex, optionIdx) => {
    const db = getDb(); if (!db) return;
    try {
      const voteRef = ref(db, `crowd/${pin}/pollVotes/${pollIndex}/${userId}`);
      const prev = await get(voteRef);
      const prevIdx = prev.val();
      if (prevIdx !== null && prevIdx !== undefined) {
        await update(ref(db, `crowd/${pin}/pollCounts/${pollIndex}`), { [prevIdx]: increment(-1) });
      }
      await set(voteRef, optionIdx);
      await update(ref(db, `crowd/${pin}/pollCounts/${pollIndex}`), { [optionIdx]: increment(1) });
    } catch (e) { console.error(e); }
  },

  // Switch which poll question is currently active/displayed
  setCurrentPoll: async (pin, index) => {
    const db = getDb(); if (!db) return;
    try { await update(ref(db, `crowd/${pin}/prompt`), { currentIndex: index }); }
    catch (e) { console.error(e); }
  },

  // Append a new poll question to a live session (host can keep adding
  // questions after the session has already started)
  addPollQuestion: async (pin, question) => {
    const db = getDb(); if (!db) return;
    try {
      const snap = await get(ref(db, `crowd/${pin}/prompt/questions`));
      const questions = snap.val() || [];
      await update(ref(db, `crowd/${pin}/prompt`), { questions: [...questions, question] });
    } catch (e) { console.error(e); }
  },
};
