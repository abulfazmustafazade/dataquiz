import { motion } from 'framer-motion';

// Groups items with identical (normalized) text and renders each group as a
// bubble sized by how many times it was submitted — classic word-cloud style
// aggregation for brainstorm/idea sessions.
const BUBBLE_COLORS = [
  'bg-teal-500', 'bg-emerald-500', 'bg-cyan-500', 'bg-sky-500',
  'bg-teal-600', 'bg-emerald-600', 'bg-cyan-600', 'bg-teal-400',
];

export default function BubbleCloud({ items }) {
  const groups = new Map();
  items.forEach((item) => {
    const key = (item.text || '').trim().toLowerCase();
    if (!key) return;
    if (!groups.has(key)) groups.set(key, { text: item.text.trim(), count: 0 });
    groups.get(key).count++;
  });
  const bubbles = [...groups.values()].sort((a, b) => b.count - a.count);

  if (bubbles.length === 0) {
    return (
      <div className="text-center py-12 text-white/50">
        <p>Hələ fikir yoxdur</p>
      </div>
    );
  }

  const maxCount = bubbles[0].count;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 p-2">
      {bubbles.map((b, i) => {
        const scale = 0.75 + (b.count / maxCount) * 1.15; // ~0.75rem .. 1.9rem font size
        return (
          <motion.div
            key={b.text}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            className={`${BUBBLE_COLORS[i % BUBBLE_COLORS.length]} text-white font-bold rounded-full shadow-lg flex items-center gap-1.5 leading-tight`}
            style={{ fontSize: `${scale}rem`, padding: `${0.55 * scale}rem ${1.1 * scale}rem` }}
          >
            <span>{b.text}</span>
            {b.count > 1 && <span className="opacity-75" style={{ fontSize: '0.75em' }}>×{b.count}</span>}
          </motion.div>
        );
      })}
    </div>
  );
}
