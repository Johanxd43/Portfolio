import React from 'react';
import { motion } from 'framer-motion';

interface QuickReplyButtonProps {
  text: string;
  onClick: () => void;
}

export const QuickReplyButton: React.FC<QuickReplyButtonProps> = ({ text, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="px-3 py-1 text-sm bg-secondary-100 text-secondary-600 rounded-full hover:bg-secondary-200 transition-colors"
    >
      {text}
    </motion.button>
  );
};