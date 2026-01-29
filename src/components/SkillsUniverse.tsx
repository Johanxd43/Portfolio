import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Skill {
  name: string;
  category: 'quantum' | 'dev' | 'ops' | 'soft';
  level: number; // 1-10
}

const skills: Skill[] = [
  { name: "Python", category: "dev", level: 9 },
  { name: "Qiskit", category: "quantum", level: 8 },
  { name: "React", category: "dev", level: 9 },
  { name: "TypeScript", category: "dev", level: 8 },
  { name: "D-Wave Ocean", category: "quantum", level: 7 },
  { name: "TensorFlow", category: "dev", level: 7 },
  { name: "Docker", category: "ops", level: 8 },
  { name: "Kubernetes", category: "ops", level: 6 },
  { name: "Liderazgo", category: "soft", level: 9 },
  { name: "Odoo", category: "ops", level: 8 },
  { name: "C++", category: "dev", level: 7 },
  { name: "Three.js", category: "dev", level: 6 },
];

const SkillsUniverse = () => {
  const [isHovered, setIsHovered] = useState(false);

  const getPosition = (index: number, total: number) => {
    const phi = Math.acos(-1 + (2 * index) / total);
    const theta = Math.sqrt(total * Math.PI) * phi;
    const radius = 120;

    return {
      x: radius * Math.cos(theta) * Math.sin(phi),
      y: radius * Math.sin(theta) * Math.sin(phi),
      z: radius * Math.cos(phi)
    };
  };

  return (
    <div
      className="relative w-full h-[400px] flex items-center justify-center perspective-1000"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative w-[300px] h-[300px] preserve-3d"
        animate={isHovered ? { rotateY: 0, rotateX: 0 } : { rotateY: 360, rotateX: 360 }}
        transition={isHovered
          ? { duration: 0.5, ease: "easeOut" }
          : { duration: 30, repeat: Infinity, ease: "linear" }
        }
        style={{ transformStyle: 'preserve-3d' }}
      >
        {skills.map((skill, index) => {
          const pos = getPosition(index, skills.length);
          const color =
            skill.category === 'quantum' ? '#8b5cf6' :
            skill.category === 'dev' ? '#06b6d4' :
            skill.category === 'ops' ? '#22c55e' : '#ec4899';

          return (
            <motion.div
              key={skill.name}
              className="absolute left-1/2 top-1/2 flex items-center justify-center"
              style={{
                transform: `translate3d(${pos.x}px, ${pos.y}px, ${pos.z}px)`,
              }}
            >
              <div
                className="px-3 py-1 rounded-full text-xs font-bold text-white bg-black/50 border backdrop-blur-sm shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-default transition-transform"
                style={{
                  borderColor: color,
                  boxShadow: `0 0 5px ${color}`,
                  transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                }}
              >
                {skill.name}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default SkillsUniverse;