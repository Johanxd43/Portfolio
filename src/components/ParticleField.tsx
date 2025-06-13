import React, { useCallback } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
}

export default function ParticleField() {
  const generateParticles = useCallback((count: number): Particle[] => {
    const colors = [
      'rgba(168, 85, 247, 0.4)', // secondary-500
      'rgba(14, 165, 233, 0.4)', // primary-500
      'rgba(20, 184, 166, 0.4)', // accent-500
    ];
    
    return Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
  }, []);

  const particles = generateParticles(50);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          animate={{
            x: [particle.x + '%', (particle.x + 10) + '%', particle.x + '%'],
            y: [particle.y + '%', (particle.y + 10) + '%', particle.y + '%'],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
          }}
        />
      ))}
    </div>
  );
}