import { AVATARS, PLAYER_COLORS } from './constants';

export const genPin = () => Math.floor(100000 + Math.random() * 900000).toString();
export const genId = () => Math.random().toString(36).slice(2, 11) + Date.now().toString(36).slice(-4);

// Generates a PIN and creates via `createFn(pin, data)` (which must fail rather
// than overwrite on collision — see gameAPI.create/crowdAPI.create). Retries
// with a fresh PIN on collision. Returns the winning PIN, or null if all
// attempts were exhausted (astronomically unlikely with 900k possible PINs).
export const createWithUniquePin = async (createFn, data, maxAttempts = 5) => {
  for (let i = 0; i < maxAttempts; i++) {
    const pin = genPin();
    if (await createFn(pin, data)) return pin;
  }
  return null;
};

// Normalize text for comparison (case-insensitive, trim, collapse whitespace)
export const normalize = (s) => (s || '').trim().toLowerCase().replace(/\s+/g, ' ');

// Fisher-Yates shuffle
export const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Pick deterministic avatar/color from a string seed (player id)
export const avatarFor = (seed) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  return AVATARS[Math.abs(hash) % AVATARS.length];
};

export const colorFor = (seed) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  return PLAYER_COLORS[Math.abs(hash) % PLAYER_COLORS.length];
};

export const formatTime = (val, unit) => unit === 'minutes' ? `${val} dəq` : `${val} san`;

export const totalSeconds = (q) => q.timeUnit === 'minutes' ? q.timeValue * 60 : q.timeValue;
