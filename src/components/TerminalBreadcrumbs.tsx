import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

const TerminalBreadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <div className="flex items-center space-x-2 text-sm font-mono mb-8 text-cyan-400/80">
      <Terminal className="w-4 h-4" />
      <span className="text-purple-400">~</span>
      <span className="text-gray-500">/</span>
      <Link to="/" className="hover:text-cyan-300 transition-colors">
        portfolio
      </Link>

      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return (
          <React.Fragment key={name}>
            <span className="text-gray-500">/</span>
            {isLast ? (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-cyan-300 font-bold"
              >
                {name}
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block ml-1 w-2 h-4 bg-cyan-400 align-middle"
                />
              </motion.span>
            ) : (
              <Link to={routeTo} className="hover:text-cyan-300 transition-colors">
                {name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default TerminalBreadcrumbs;