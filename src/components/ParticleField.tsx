import React, { useCallback } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

export default function ParticleField() {
  const generateParticles = useCallback((count: number): Particle[] => {
    const colors = [
      '#8b5cf6', // purple-500
      '#06b6d4', // cyan-500
      '#ec4899', // pink-500
    ];
    
    return Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1, // Smaller, sharper particles (1-3px)
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 2 + 1.5,
      delay: Math.random() * 2
    }));
  }, []);

  const particles = generateParticles(40); // Fewer particles for cleaner look

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full shadow-[0_0_8px_rgba(139,92,246,0.3)]"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
            boxShadow: [
              `0 0 4px ${particle.color}`,
              `0 0 12px ${particle.color}`,
              `0 0 4px ${particle.color}`
            ]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
          }}
        />
      ))}
    </div>
  );
}
