import React from 'react';
import { motion } from 'framer-motion';
import { Download, Info, Trash2, ShieldCheck } from 'lucide-react';

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
  activeTheme?: string;
}

export const PluginCard: React.FC<PluginCardProps> = ({ plugin, activeTheme = 'cyberpunk' }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`cp-card flex flex-col group min-h-[160px] relative overflow-hidden`}
    >
      {/* Upper Info Strip */}
      <div className="absolute top-0 left-0 w-full px-4 py-1 flex items-center justify-between border-b border-cp-yellow/10 bg-cp-yellow/5">
        <div className="flex items-center gap-2">
          <ShieldCheck size={10} className="text-cp-yellow/50" />
          <span className="text-[6px] font-cp-mono text-cp-yellow/40 tracking-widest uppercase">
            {activeTheme === 'stalker' ? 'ANALYST_ID' : 'ID'}_{plugin.id.split('-')[0] || 'SYS'}
          </span>
        </div>
        <span className="text-[6px] font-cp-mono text-cp-cyan/40">SECURED_LINK_v2.1</span>
      </div>

      <div className="flex flex-1 mt-6">
        {/* Left Side: Thumbnail with scan effect */}
        <div className="w-28 bg-cyber-black flex-shrink-0 relative overflow-hidden flex items-center justify-center border-r border-white/5">
          <img
            src={plugin.image || "https://placeholder.com/150"}
            alt={plugin.name}
            className="w-full h-full object-cover opacity-20 group-hover:opacity-60 transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cp-black via-transparent to-transparent opacity-80" />

          {/* Scanline effect on thumbnail */}
          <div className="absolute inset-0 bg-cp-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="w-full h-[1px] bg-cp-cyan/20 absolute top-0 animate-scanline" style={{ animationDuration: '2s' }} />
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="flex-1 p-5 relative flex flex-col">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <h3 className="font-cyber text-xs tracking-widest text-white group-hover:text-cp-yellow transition-colors truncate">
                {plugin.name.toUpperCase()}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[8px] font-cp-mono text-cp-cyan uppercase">v{plugin.version}</span>
                <span className="text-[8px] font-cp-mono text-gray-600 uppercase">/ {plugin.author}</span>
              </div>
            </div>
            {plugin.installed && (
              <div className="px-1.5 py-0.5 border border-cp-yellow text-[7px] font-cp-mono text-cp-yellow bg-cp-yellow/10 animate-pulse">
                ACTIVE
              </div>
            )}
          </div>

          <p className="text-[9px] text-gray-500 mt-3 line-clamp-2 font-cp-body leading-relaxed uppercase opacity-80">
            {plugin.description}
          </p>

          <div className="mt-auto flex items-center justify-between pt-3">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-[5px] text-gray-600 font-cp-mono uppercase">link_quality</span>
                <span className="text-[7px] text-cp-cyan font-cp-mono uppercase">Maximum</span>
              </div>
              <div className="h-4 w-[1px] bg-white/5" />
              <div className="flex flex-col">
                <span className="text-[5px] text-gray-600 font-cp-mono uppercase">threat_level</span>
                <span className="text-[7px] text-cp-yellow font-cp-mono uppercase">Minimal</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="cp-button p-1.5 min-w-0" title="Инфо">
                <Info size={12} />
              </button>
              <button className={`cp-button flex items-center gap-2 px-3 py-1.5 ${plugin.installed ? 'cp-button-critical' : ''}`}>
                {plugin.installed ? (
                  <>
                    <Trash2 size={10} />
                    <span className="text-[9px]">УДАЛИТЬ</span>
                  </>
                ) : (
                  <>
                    <Download size={10} />
                    <span className="text-[9px]">УСТАНОВИТЬ</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative corner accent */}
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/10" />
    </motion.div>
  );
};
