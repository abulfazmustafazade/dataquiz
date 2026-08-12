import { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { sounds } from '../lib/sounds';

export default function SoundToggle({ className = '' }) {
  const [muted, setMuted] = useState(sounds.isMuted());

  const toggle = () => {
    const newMuted = !muted;
    sounds.setMuted(newMuted);
    setMuted(newMuted);
    if (!newMuted) sounds.click();
  };

  return (
    <button
      onClick={toggle}
      className={`p-2 hover:bg-white/10 rounded-xl text-white transition-colors ${className}`}
      title={muted ? 'Səsi aç' : 'Səsi söndür'}
    >
      {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
    </button>
  );
}
