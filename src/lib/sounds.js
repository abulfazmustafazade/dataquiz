// Lightweight sound system using Web Audio API — no external files needed
// Sounds are synthesized on-the-fly to keep bundle small

let audioCtx = null;
let muted = false;

const ensureCtx = () => {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      return null;
    }
  }
  // Resume if suspended (mobile browsers)
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
};

const tone = (freq, duration, type = 'sine', volume = 0.15) => {
  if (muted) return;
  const ctx = ensureCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
};

const sequence = (notes) => {
  if (muted) return;
  const ctx = ensureCtx();
  if (!ctx) return;
  let t = 0;
  notes.forEach(({ freq, duration, type = 'sine', volume = 0.15, delay = 0 }) => {
    setTimeout(() => tone(freq, duration, type, volume), (t + delay) * 1000);
    t += duration + delay;
  });
};

export const sounds = {
  setMuted: (m) => { muted = m; },
  isMuted: () => muted,

  // A new player joined the lobby — pleasant ascending chord
  join: () => sequence([
    { freq: 523, duration: 0.08, type: 'sine', volume: 0.12 },
    { freq: 659, duration: 0.08, type: 'sine', volume: 0.12 },
    { freq: 784, duration: 0.15, type: 'sine', volume: 0.12 },
  ]),

  // Click — short tick
  click: () => tone(800, 0.05, 'square', 0.08),

  // Correct answer — happy two-tone
  correct: () => sequence([
    { freq: 659, duration: 0.1, type: 'sine', volume: 0.18 },
    { freq: 988, duration: 0.2, type: 'sine', volume: 0.18 },
  ]),

  // Wrong answer — descending sad
  wrong: () => sequence([
    { freq: 392, duration: 0.15, type: 'sine', volume: 0.15 },
    { freq: 311, duration: 0.25, type: 'sine', volume: 0.15 },
  ]),

  // Tick during last 5 seconds
  tick: () => tone(1000, 0.04, 'square', 0.06),

  // Question start — alert
  questionStart: () => sequence([
    { freq: 784, duration: 0.08, type: 'square', volume: 0.12 },
    { freq: 1047, duration: 0.12, type: 'square', volume: 0.12 },
  ]),

  // Game over — fanfare
  finish: () => sequence([
    { freq: 523, duration: 0.12, type: 'sine', volume: 0.18 },
    { freq: 659, duration: 0.12, type: 'sine', volume: 0.18 },
    { freq: 784, duration: 0.12, type: 'sine', volume: 0.18 },
    { freq: 1047, duration: 0.3, type: 'sine', volume: 0.2 },
  ]),
};
