import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';

interface StatBadgeProps {
  value: string;
  label: string;
  delay?: number;
  animated?: boolean;
}

export const StatBadge = ({ value, label, delay = 0, animated = false }: StatBadgeProps) => {
  const [ref, inView] = useInView({ triggerOnce: true });
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (inView && animated) {
      const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
      const prefix = value.match(/[^0-9.]+/)?.[0] || '';
      const suffix = value.match(/[^0-9.]+$/)?.[0] || '';

      let current = 0;
      const increment = numericValue / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(`${prefix}${Math.floor(current)}${suffix}`);
        }
      }, 30);

      return () => clearInterval(timer);
    }
  }, [inView, value, animated]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="text-center"
    >
      <div className="text-4xl md:text-5xl font-black text-white mb-2">
        {animated && inView ? displayValue : value}
      </div>
      <div className="text-primary-100 font-medium">{label}</div>
    </motion.div>
  );
};
