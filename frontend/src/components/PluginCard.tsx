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
      <div className={`absolute top-0 left-0 w-full px-4 py-1 flex items-center justify-between border-b ${activeTheme === 'portal' ? 'border-blue-100 bg-blue-50/50' : activeTheme === 'deadspace' ? 'border-cyan-500/10 bg-cyan-900/10' : 'border-cp-yellow/10 bg-cp-yellow/5'}`}>
        <div className="flex items-center gap-2">
          <ShieldCheck size={10} className={`${activeTheme === 'portal' ? 'text-blue-400' : activeTheme === 'deadspace' ? 'text-cyan-400' : 'text-cp-yellow/50'}`} />
          <span className={`text-[6px] font-cp-mono tracking-widest uppercase ${activeTheme === 'portal' ? 'text-slate-400' : activeTheme === 'deadspace' ? 'text-cyan-400' : 'text-cp-yellow/40'}`}>
            {activeTheme === 'stalker' ? 'ANALYST_ID' :
              activeTheme === 'doom' ? 'BATTLE_ID' :
                activeTheme === 'portal' ? 'CHAMBER_ID' :
                  activeTheme === 'deadspace' ? 'NODE_ID' : 'ID'}_{plugin.id.split('-')[0] || 'SYS'}
          </span>
        </div>
        <span className={`text-[6px] font-cp-mono ${activeTheme === 'portal' ? 'text-blue-300' : 'text-cp-cyan/40'}`}>
          {activeTheme === 'portal' ? 'TEST_READY' : activeTheme === 'deadspace' ? 'HOLO_SYNC_STABLE' : 'SECURED_LINK_v2.1'}
        </span>
      </div>

      <div className="flex flex-1 mt-6">
        {/* Left Side: Thumbnail with scan effect */}
        <div className={`w-28 ${activeTheme === 'portal' ? 'bg-slate-50' : 'bg-cyber-black'} flex-shrink-0 relative overflow-hidden flex items-center justify-center border-r ${activeTheme === 'portal' ? 'border-blue-50' : 'border-white/5'}`}>
          <img
            src={plugin.image || "https://placeholder.com/150"}
            alt={plugin.name}
            className={`w-full h-full object-cover transition-opacity duration-700 ${activeTheme === 'portal' ? 'opacity-80 group-hover:opacity-100' : 'opacity-20 group-hover:opacity-60'}`}
          />
          {activeTheme !== 'portal' && <div className="absolute inset-0 bg-gradient-to-r from-cp-black via-transparent to-transparent opacity-80" />}

          {/* Scanline effect on thumbnail */}
          <div className="absolute inset-0 bg-cp-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className={`w-full h-[1px] ${activeTheme === 'doom' ? 'bg-red-600' : 'bg-cp-cyan/20'} absolute top-0 animate-scanline`} style={{ animationDuration: '2s' }} />
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="flex-1 p-5 relative flex flex-col">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <h3 className={`text-xs tracking-widest group-hover:text-cp-yellow transition-colors truncate ${activeTheme === 'portal' ? 'font-sans font-medium text-slate-800' : activeTheme === 'deadspace' ? 'font-tech text-cyan-300' : 'font-cyber text-white'}`}>
                {plugin.name.toUpperCase()}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[8px] font-cp-mono uppercase ${activeTheme === 'portal' ? 'text-blue-400' : 'text-cp-cyan'}`}>v{plugin.version}</span>
                <span className={`text-[8px] font-cp-mono uppercase ${activeTheme === 'portal' ? 'text-slate-300' : 'text-gray-600'}`}>/ {activeTheme === 'stalker' ? 'АВТОР' : activeTheme === 'portal' ? 'SUBJECT' : 'DEV'}</span>
              </div>
            </div>
            {plugin.installed && (
              <div className={`px-1.5 py-0.5 border text-[7px] font-cp-mono animate-pulse ${activeTheme === 'portal' ? 'border-blue-400 text-blue-500 bg-blue-50' : 'border-cp-yellow text-cp-yellow bg-cp-yellow/10'}`}>
                {activeTheme === 'portal' ? 'ACTIVE' : activeTheme === 'deadspace' ? 'SYNCED' : 'ENABLED'}
              </div>
            )}
          </div>

          <p className={`text-[9px] mt-3 line-clamp-2 leading-relaxed uppercase opacity-80 ${activeTheme === 'portal' ? 'font-sans text-slate-400' : 'font-cp-body text-gray-500'}`}>
            {activeTheme === 'portal' ? `Subject protocol: ${plugin.description.toLowerCase()}` : plugin.description}
          </p>

          <div className="mt-auto flex items-center justify-between pt-3">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-[5px] text-gray-600 font-cp-mono uppercase">{activeTheme === 'portal' ? 'data_fidelity' : 'link_quality'}</span>
                <span className={`text-[7px] font-cp-mono uppercase ${activeTheme === 'portal' ? 'text-blue-500' : 'text-cp-cyan'}`}>Optimal</span>
              </div>
              <div className={`h-4 w-[1px] ${activeTheme === 'portal' ? 'bg-blue-50' : 'bg-white/5'}`} />
              <div className="flex flex-col">
                <span className="text-[5px] text-gray-600 font-cp-mono uppercase">{activeTheme === 'portal' ? 'test_index' : 'threat_level'}</span>
                <span className={`text-[7px] font-cp-mono uppercase ${activeTheme === 'portal' ? 'text-orange-500' : 'text-cp-yellow'}`}>{activeTheme === 'portal' ? 'Alpha-01' : 'Minimal'}</span>
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
                    <span className="text-[9px]">
                      {activeTheme === 'stalker' ? 'СБРОСИТЬ' :
                        activeTheme === 'doom' ? 'KILL' :
                          activeTheme === 'portal' ? 'Dispose' :
                            activeTheme === 'deadspace' ? 'DISMANTLE' : 'УДАЛИТЬ'}
                    </span>
                  </>
                ) : (
                  <>
                    <Download size={10} />
                    <span className="text-[9px]">
                      {activeTheme === 'stalker' ? 'ЗАБРАТЬ' :
                        activeTheme === 'doom' ? 'LOAD' :
                          activeTheme === 'portal' ? 'Initiate' :
                            activeTheme === 'deadspace' ? 'ACQUIRE' : 'УСТАНОВИТЬ'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative corner accent */}
      {activeTheme !== 'portal' && <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/10" />}
    </motion.div>
  );
};
