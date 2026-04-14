import React from 'react';
import { motion } from 'framer-motion';

export const CyberPanel: React.FC<{ children: React.ReactNode, title?: string }> = ({ children, title }) => {
  return (
    <div className="relative p-1 bg-cyber-dark/60 border-l-2 border-t-2 border-cyber-cyan/30 clip-cyber shadow-2xl">
      {title && (
        <div className="absolute top-0 right-0 px-3 py-1 bg-cyber-cyan text-cyber-black font-tech text-[10px] font-bold uppercase tracking-wider">
          {title} // SECURE_BLOCK
        </div>
      )}
      <div className="bg-cyber-black/40 p-6">
        {children}
      </div>
      
      {/* Glitch Overlay Effect */}
      <motion.div 
        animate={{ opacity: [0, 0.05, 0, 0.02, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute inset-0 pointer-events-none bg-cyber-cyan/5"
      />
    </div>
  );
};
