import { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

export default function AnimatedNumber({ value, duration = 0.6, className = '' }) {
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(motionVal, value, { duration, ease: 'easeOut' });
    return controls.stop;
  }, [value, duration, motionVal]);

  return <motion.span className={className}>{rounded}</motion.span>;
}
