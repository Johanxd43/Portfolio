import React from 'react';
import { motion } from 'framer-motion';

interface QuantumLoaderProps {
  size?: number;
  className?: string;
}

const QuantumLoader: React.FC<QuantumLoaderProps> = ({ size = 24, className = '' }) => {
  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Cargando..."
    >
      {/* Core */}
      <motion.div
        className="absolute bg-cyan-400 rounded-full blur-[1px]"
        style={{ width: size * 0.3, height: size * 0.3 }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Inner Orbit */}
      <motion.div
        className="absolute border border-purple-500 rounded-full"
        style={{ width: size * 0.6, height: size * 0.6, borderWidth: size * 0.05 }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Outer Orbit */}
      <motion.div
        className="absolute border border-cyan-500 rounded-full border-t-transparent border-b-transparent"
        style={{ width: size, height: size, borderWidth: size * 0.05 }}
        animate={{ rotate: -360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
};

export default QuantumLoader;