import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertTriangle } from 'lucide-react';

export default function Toast({ message, type = 'success', visible }) {
  const colors = {
    success: 'bg-emerald-500',
    error: 'bg-rose-500',
    warning: 'bg-amber-500',
    info: 'bg-sky-500',
  };
  const icons = {
    success: <Check size={18} />,
    error: <X size={18} />,
    warning: <AlertTriangle size={18} />,
    info: <Check size={18} />,
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className={`fixed top-4 right-4 z-50 ${colors[type]} text-white px-4 py-2 rounded-xl shadow-2xl font-bold flex items-center gap-2`}
        >
          {icons[type]}
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
