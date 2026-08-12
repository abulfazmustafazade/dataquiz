import { motion } from 'framer-motion';

export default function AnimatedBackground({ variant = 'purple' }) {
  const variants = {
    purple: ['#a855f7', '#d946ef', '#7c3aed'],
    pink: ['#ec4899', '#f43f5e', '#a855f7'],
    emerald: ['#10b981', '#22c55e', '#84cc16'],
    rose: ['#f43f5e', '#fb7185', '#f97316'],
    amber: ['#fbbf24', '#f59e0b', '#fb923c'],
  };
  const colors = variants[variant] || variants.purple;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {colors.map((color, i) => (
        <motion.div
          key={i}
          className="blob"
          style={{
            background: color,
            width: 400 + i * 100,
            height: 400 + i * 100,
            top: `${10 + i * 30}%`,
            left: `${i * 25}%`,
          }}
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 15 + i * 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
