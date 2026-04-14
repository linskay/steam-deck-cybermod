import React from 'react';
import { motion } from 'framer-motion';
import { Download, CheckCircle, Info } from 'lucide-react';
import { CyberButton } from './CyberButton';

export interface Plugin {
  id: string;
  name: string;
  author: string;
  description: string;
  version: string;
  image: string;
  installed: boolean;
  hasUpdate: boolean;
}

interface PluginCardProps {
  plugin: Plugin;
}

export const PluginCard: React.FC<PluginCardProps> = ({ plugin }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative bg-cyber-dark/80 border border-cyber-cyan/20 overflow-hidden"
      style={{
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 90%, 90% 100%, 0% 100%)'
      }}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-cyber-cyan/0 group-hover:bg-cyber-cyan/5 transition-all duration-300" />

      {/* Plugin Image Placeholder */}
      <div className="h-32 bg-cyber-black flex items-center justify-center border-b border-cyber-cyan/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <img 
          src={plugin.image || "https://placeholder.com/150"} 
          alt={plugin.name}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
        />
        {plugin.installed && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-cyber-cyan/20 px-2 py-0.5 text-[8px] text-cyber-cyan border border-cyber-cyan font-tech">
            <CheckCircle size={8} /> УСТАНОВЛЕНО
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-cyber font-black text-lg text-white group-hover:text-cyber-cyan transition-colors truncate">
            {plugin.name}
          </h3>
          <span className="font-tech text-[10px] text-cyber-magenta ml-2">v{plugin.version}</span>
        </div>
        <div className="font-tech text-[10px] text-gray-500 uppercase mt-1">
          АВТОР: <span className="text-gray-300">{plugin.author}</span>
        </div>
        
        <p className="text-xs text-gray-400 mt-3 line-clamp-2 h-8">
          {plugin.description}
        </p>

        <div className="flex gap-2 mt-4">
          <CyberButton 
            variant="cyan" 
            className="flex-1 text-[10px] py-1 px-2"
          >
            <div className="flex items-center justify-center gap-2">
              <Download size={14} />
              <span>{plugin.installed ? 'ОБНОВИТЬ' : 'УСТАНОВИТЬ'}</span>
            </div>
          </CyberButton>
          <div className="w-10 h-10 border border-cyber-magenta/30 flex items-center justify-center text-cyber-magenta hover:bg-cyber-magenta hover:text-white transition-all cursor-pointer">
            <Info size={16} />
          </div>
        </div>
      </div>

      {/* Decorative Corner */}
      <div className="absolute bottom-0 right-0 w-4 h-4 bg-cyber-cyan animate-pulse opacity-50" 
           style={{ clipPath: 'polygon(100% 0%, 100% 100%, 0% 100%)' }} />
    </motion.div>
  );
};
