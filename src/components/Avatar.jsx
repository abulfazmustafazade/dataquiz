import { motion } from 'framer-motion';
import { avatarFor, colorFor } from '../lib/utils';

export default function Avatar({ name, id, size = 'md', showName = true, className = '' }) {
  const sizes = {
    xs: 'w-8 h-8 text-base',
    sm: 'w-10 h-10 text-lg',
    md: 'w-12 h-12 text-xl',
    lg: 'w-16 h-16 text-3xl',
    xl: 'w-20 h-20 text-4xl',
  };
  const seed = id || name || 'default';
  const avatar = avatarFor(seed);
  const color = colorFor(seed);

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={`${sizes[size]} rounded-full bg-gradient-to-br ${color} flex items-center justify-center shadow-lg ring-2 ring-white`}
      >
        <span>{avatar}</span>
      </motion.div>
      {showName && <span className="text-xs font-bold text-white truncate max-w-[80px]">{name}</span>}
    </div>
  );
}
