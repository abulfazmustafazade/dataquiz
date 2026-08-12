import { useEffect, useState } from 'react';
import { totalSeconds } from '../lib/utils';

// Live countdown for a question. Recomputes every animation frame for smooth bar updates.
// Returns { secondsLeft (rounded up), percent (0-100) }.
export function useQuestionTimer(question, questionStartedAt, active) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!active) return;
    let rafId;
    let lastUpdate = 0;
    const update = (t) => {
      // Throttle React state updates to ~10Hz to avoid jank
      if (t - lastUpdate > 100) {
        setNow(Date.now());
        lastUpdate = t;
      }
      rafId = requestAnimationFrame(update);
    };
    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [active, questionStartedAt]);

  if (!question || !questionStartedAt) return { secondsLeft: 0, percent: 0, elapsed: 0 };

  const total = totalSeconds(question);
  const elapsed = Math.max(0, (now - questionStartedAt) / 1000);
  const remaining = Math.max(0, total - elapsed);
  return {
    secondsLeft: Math.ceil(remaining),
    percent: Math.max(0, Math.min(100, (remaining / total) * 100)),
    elapsed,
  };
}
