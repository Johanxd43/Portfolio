import React, { useEffect, useRef } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';

interface CountUpProps {
  value: string; // Accepts string like "98.5%" or "100K+"
  className?: string;
}

const CountUp: React.FC<CountUpProps> = ({ value, className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Extract number and suffix
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
  const suffix = value.replace(/[0-9.]/g, '');
  const prefix = value.match(/^[^0-9]*/)?.[0] || '';

  const springValue = useSpring(0, {
    damping: 30,
    stiffness: 100,
    duration: 2
  });

  const displayValue = useTransform(springValue, (current) => {
    // Determine if integer or float based on input string
    const isFloat = value.includes('.');
    const formatted = isFloat ? current.toFixed(1) : Math.round(current).toString();
    return `${prefix}${formatted}${suffix}`;
  });

  useEffect(() => {
    if (isInView) {
      springValue.set(numericValue);
    }
  }, [isInView, numericValue, springValue]);

  return (
    <motion.span ref={ref} className={className}>
      {displayValue}
    </motion.span>
  );
};

export default CountUp;