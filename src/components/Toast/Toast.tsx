import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  onClose: (id: string) => void;
  duration?: number;
}

const icons = {
  success: <CheckCircle className="w-5 h-5 text-green-400" />,
  error: <AlertCircle className="w-5 h-5 text-red-400" />,
  info: <Info className="w-5 h-5 text-blue-400" />
};

const bgStyles = {
  success: 'bg-green-900/20 border-green-500/30 shadow-[0_0_15px_rgba(74,222,128,0.1)]',
  error: 'bg-red-900/20 border-red-500/30 shadow-[0_0_15px_rgba(248,113,113,0.1)]',
  info: 'bg-blue-900/20 border-blue-500/30 shadow-[0_0_15px_rgba(96,165,250,0.1)]'
};

const Toast: React.FC<ToastProps> = ({ id, message, type, onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md
        min-w-[300px] max-w-md pointer-events-auto
        ${bgStyles[type]}
      `}
    >
      <div className="flex-shrink-0">
        {icons[type]}
      </div>

      <p className="flex-1 text-sm font-medium text-gray-200">
        {message}
      </p>

      <button
        onClick={() => onClose(id)}
        className="p-1 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export default Toast;
