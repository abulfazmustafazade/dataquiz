import { motion } from 'framer-motion';
import { avatarUrl, colorFor } from '../lib/utils';

export default function Avatar({ name, id, avatar, size = 'md', showName = true, className = '' }) {
  const sizes = {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };
  const seed = id || name || 'default';
  // Use the player's own chosen character when there is one; otherwise fall
  // back to a deterministic pick (older players, Crowd, etc.)
  const src = avatarUrl(avatar || seed);
  const color = colorFor(seed);

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={`${sizes[size]} rounded-full bg-gradient-to-br ${color} flex items-center justify-center shadow-lg ring-2 ring-white overflow-hidden`}
      >
        <img src={src} alt="" className="w-full h-full object-cover" />
      </motion.div>
      {showName && <span className="text-xs font-bold text-white truncate max-w-[80px]">{name}</span>}
    </div>
  );
}
