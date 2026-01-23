import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DecryptedTextProps {
  text: string;
  className?: string;
  speed?: number;
  maxIterations?: number;
}

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';

const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  className = '',
  speed = 50,
  maxIterations = 10
}) => {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    let iterations = 0;

    const interval = setInterval(() => {
      setDisplayText(() =>
        text.split('').map((char, index) => {
          if (index < iterations) return text[index];
          return characters[Math.floor(Math.random() * characters.length)];
        }).join('')
      );

      if (iterations >= text.length) {
        clearInterval(interval);
      }

      iterations += 1 / (maxIterations / 5); // Controls how many chars reveal per tick
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, maxIterations]);

  return (
    <motion.span
      className={`inline-block font-mono ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      aria-hidden="true"
    >
      {displayText}
    </motion.span>
  );
};

export default DecryptedText;