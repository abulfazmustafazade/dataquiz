import { useEffect, useState, useRef } from 'react';
import { gameAPI } from '../lib/firebase';

// Subscribes to game state in real-time. Returns the latest game snapshot.
// Stays subscribed while pin is set; cleanly unsubscribes on pin change/unmount.
export function useGameState(pin, enabled = true) {
  const [game, setGame] = useState(null);
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    if (!pin || !enabled) {
      setGame(null);
      return;
    }
    const unsub = gameAPI.listen(pin, (g) => setGame(g));
    unsubscribeRef.current = unsub;
    return () => {
      if (unsubscribeRef.current) unsubscribeRef.current();
      unsubscribeRef.current = null;
    };
  }, [pin, enabled]);

  return game;
}
