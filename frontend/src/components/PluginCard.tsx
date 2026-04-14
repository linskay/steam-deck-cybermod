import React from 'react';
import { motion } from 'framer-motion';
import { Download, CheckCircle, Info, ShieldAlert } from 'lucide-react';

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
      whileHover={{ scale: 1.02 }}
      className="group relative flex flex-col bg-cyber-dark/40 border-l-2 border-cyber-magenta overflow-hidden h-44"
      style={{
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)'
      }}
    >
      {/* Background Accent */}
      <div className="absolute inset-0 bg-cyber-magenta/0 group-hover:bg-cyber-magenta/5 transition-colors duration-500" />
      
      <div className="flex h-full">
        {/* Left Side: Image/Thumbnail */}
        <div className="w-32 bg-cyber-black flex-shrink-0 relative overflow-hidden flex items-center justify-center">
          <img 
            src={plugin.image || "https://placeholder.com/150"} 
            alt={plugin.name}
            className="w-full h-full object-cover opacity-30 group-hover:opacity-100 transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cyber-black via-transparent to-transparent opacity-80" />
          
          {plugin.installed && (
            <div className="absolute top-2 left-2 flex items-center gap-1 text-[7px] text-cyber-cyan font-tech tracking-tighter">
              <CheckCircle size={8} /> ACTIVE_MOD
            </div>
          )}
        </div>

        {/* Right Side: Content */}
        <div className="flex-1 p-4 relative flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="font-cyber text-sm tracking-widest text-white group-hover:text-cyber-cyan transition-colors truncate">
                {plugin.name}
              </h3>
            </div>
            
            <div className="flex items-center gap-2 mt-1">
              <span className="font-tech text-[8px] text-cyber-magenta uppercase tracking-widest">
                VER_{plugin.version}
              </span>
              <div className="h-[1px] flex-1 bg-cyber-magenta/20" />
            </div>

            <p className="text-[10px] text-gray-400 mt-2 line-clamp-2 font-tech leading-tight opacity-70">
              {plugin.description.toUpperCase()}
            </p>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <ShieldAlert size={10} className="text-cyber-yellow" />
              <span className="text-[8px] font-tech text-cyber-yellow opacity-60 uppercase">Угроза: Low</span>
            </div>
            
            <div className="flex gap-2">
              <div className="p-1.5 border border-cyber-magenta/40 hover:bg-cyber-magenta hover:text-white transition-all cursor-pointer">
                <Download size={12} />
              </div>
              <div className="p-1.5 border border-cyber-cyan/40 hover:bg-cyber-cyan hover:text-black transition-all cursor-pointer">
                <Info size={12} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
    </motion.div>
  );
};
