import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function BrandLogo({ size = 'md', animated = true }) {
  const sizes = {
    sm: { box: 'w-12 h-12', icon: 24, rounded: 'rounded-xl' },
    md: { box: 'w-16 h-16', icon: 32, rounded: 'rounded-2xl' },
    lg: { box: 'w-24 h-24', icon: 48, rounded: 'rounded-3xl' },
  };
  const s = sizes[size];

  const Box = animated ? motion.div : 'div';

  return (
    <Box
      className={`inline-flex items-center justify-center ${s.box} bg-white ${s.rounded} shadow-2xl`}
      {...(animated && {
        animate: { rotate: [-3, 3, -3], y: [0, -6, 0] },
        transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
      })}
    >
      <Sparkles size={s.icon} className="text-purple-600" strokeWidth={2.5} />
    </Box>
  );
}
