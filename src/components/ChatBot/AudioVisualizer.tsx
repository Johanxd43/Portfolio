import React from 'react';
import { motion } from 'framer-motion';

interface AudioVisualizerProps {
  isActive: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isActive }) => {
  return (
    <div className="flex items-center gap-1 h-4">
      {[1, 2, 3, 4].map((bar) => (
        <motion.div
          key={bar}
          className="w-1 bg-cyan-400 rounded-full"
          animate={{
            height: isActive ? [4, 12, 4] : 4,
            opacity: isActive ? 1 : 0.5
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            delay: bar * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default AudioVisualizer;