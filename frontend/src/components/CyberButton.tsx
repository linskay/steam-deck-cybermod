import { motion } from 'framer-motion';
import React from 'react';

interface CyberButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'cyan' | 'magenta' | 'yellow';
}

export const CyberButton: React.FC<CyberButtonProps> = ({ 
  children, 
  onClick, 
  className = "", 
  variant = 'cyan' 
}) => {
  const colors = {
    cyan: "border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan/10",
    magenta: "border-cyber-magenta text-cyber-magenta hover:bg-cyber-magenta/10",
    yellow: "border-cyber-yellow text-cyber-yellow hover:bg-cyber-yellow/10",
  };

  const glows = {
    cyan: "shadow-neon-cyan",
    magenta: "shadow-neon-magenta",
    yellow: "shadow-neon-yellow",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative px-6 py-2 font-tech uppercase tracking-widest border-2 
        ${colors[variant]} ${glows[variant]}
        transition-all duration-300 overflow-hidden
        clip-cyber
        ${className}
      `}
      style={{
        clipPath: 'polygon(0% 0%, 90% 0%, 100% 30%, 100% 100%, 10% 100%, 0% 70%)'
      }}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
    </motion.button>
  );
};
