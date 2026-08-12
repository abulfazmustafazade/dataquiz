import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, update, get, onValue, off, child, runTransaction } from 'firebase/database';

// =====================================================================
// 🔥 FIREBASE CONFIG — buraya öz config-inizi yazın
// =====================================================================
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyAb9XY6BLmmjX8Xw7YyFmoOJP55FiY45JU",
  authDomain: "quizdata11.firebaseapp.com",
  databaseURL: "https://quizdata11-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "quizdata11",
  storageBucket: "quizdata11.firebasestorage.app",
  messagingSenderId: "104656597775",
  appId: "1:104656597775:web:1c2b027e8a00aa2f1bc47a",
  measurementId: "G-17FVBBCZ7X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// =====================================================================

export const FIREBASE_OK = firebaseConfig.apiKey !== "YOUR_API_KEY_HERE";

let app = null;
let db = null;

if (FIREBASE_OK) {
  try {
    app = initializeApp(firebaseConfig);
    db = getDatabase(app);
  } catch (e) {
    console.error('Firebase init error:', e);
  }
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

  // Create/replace full game (only used for game creation)
  set: async (pin, data) => {
    if (!db) return false;
    try {
      await set(ref(db, `games/${pin}`), data);
      return true;
    } catch (e) {
      console.error('gameAPI.set error:', e);
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

  // Add a player atomically (no overwriting other players)
  addPlayer: async (pin, playerId, playerData) => {
    if (!db) return false;
    try {
      await set(ref(db, `games/${pin}/players/${playerId}`), playerData);
      return true;
    } catch (e) {
      console.error('addPlayer error:', e);
      return false;
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
