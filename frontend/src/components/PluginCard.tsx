import React from 'react';
import { Download, Info, Trash2 } from 'lucide-react';
import { getTheme } from '../themes/themeConfig';

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
  const theme = getTheme(activeTheme);
  const isDark = theme.isDark;

  return (
    <div className={`cp-card flex flex-col group min-h-[160px] relative overflow-hidden transition-all duration-300 border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>

      {/* ── Top strip: Source / State / ID ────────────────── */}
      <div className={`px-4 py-1.5 flex items-center justify-between border-b text-[6px] font-cp-mono uppercase tracking-widest ${isDark ? 'border-white/5 text-white/30' : 'border-gray-50 text-gray-400'}`}>
        <div className="flex gap-4">
          <span>SRC_DECKY</span>
          <span>ID_{plugin.id.split('-')[0].toUpperCase()}</span>
        </div>
        <span className={plugin.installed ? 'text-green-500' : ''}>
          {plugin.installed ? '● INSTALLED' : '○ AVAILABLE'}
        </span>
      </div>

      <div className="flex flex-1 mt-0">
        {/* ── Thumbnail ─────────────────────────────────────── */}
        <div className={`w-24 flex-shrink-0 relative overflow-hidden flex items-center justify-center border-r ${isDark ? 'bg-black/40 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
          <img
            src={plugin.image || 'https://picsum.photos/seed/' + plugin.id + '/150/150'}
            alt={plugin.name}
            className={`w-full h-full object-cover transition-all duration-500 ${isDark ? 'opacity-30 group-hover:opacity-60 grayscale' : 'opacity-80 group-hover:opacity-100'}`}
          />
          {isDark && (
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none" />
          )}
        </div>

        {/* ── Content ────────────────────────────────────────── */}
        <div className="flex-1 p-4 flex flex-col relative">
          <div className="flex justify-between items-start gap-2">
            <div className="flex flex-col min-w-0">
              <h3 className={`text-[11px] font-bold tracking-wider truncate mb-0.5 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {plugin.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className={`text-[8px] font-cp-mono font-bold ${isDark ? 'text-blue-400/60' : 'text-blue-500'}`}>
                  v{plugin.version}
                </span>
                <span className={`text-[8px] font-cp-mono ${isDark ? 'text-white/20' : 'text-gray-400'}`}>
                  BY {plugin.author.toUpperCase()}
                </span>
              </div>
            </div>

            {plugin.hasUpdate && (
              <div className={`px-1.5 py-0.5 border text-[6px] font-cp-mono font-bold ${isDark ? 'border-orange-500/40 text-orange-500 bg-orange-500/5' : 'border-orange-300 text-orange-600 bg-orange-50'}`}>
                UPDATE_AVAIL
              </div>
            )}
          </div>

          <p className={`text-[9px] mt-2 line-clamp-2 leading-relaxed font-medium ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
            {plugin.description}
          </p>

          {/* ── Metadata row (Stage 5) ────────────────────────── */}
          <div className={`mt-auto flex items-center justify-between pt-3 border-t ${isDark ? 'border-white/5' : 'border-gray-50'}`}>
            <div className="flex items-center gap-3 text-[7px] font-cp-mono uppercase font-bold tracking-widest text-white/20">
              <span>{theme.menuHints.plugins}</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">SYS_CHECK_OK</span>
            </div>

            {/* ── Actions Row ─────────────────────────────── */}
            <div className="flex gap-1.5">
              <button className={`cp-button p-1.5 min-w-0 border ${isDark ? 'border-white/10 text-white/40 hover:text-white' : 'border-gray-200 text-gray-400 hover:text-slate-800'}`} title="Info">
                <Info size={11} />
              </button>
              <button
                className={`cp-button flex items-center gap-2 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider border transition-all ${plugin.installed
                    ? 'border-red-500/30 text-red-500 bg-red-500/5 hover:bg-red-500 hover:text-white'
                    : 'border-white/20 text-white bg-white/5 hover:bg-white/90 hover:text-black'
                  }`}
              >
                {plugin.installed ? (
                  <>
                    <Trash2 size={9} />
                    <span>Удалить</span>
                  </>
                ) : (
                  <>
                    <Download size={9} />
                    <span>Установить</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle state accent (Stage 5) */}
      <div className={`absolute bottom-0 right-0 w-4 h-4 border-b border-r transition-colors ${plugin.installed ? 'border-green-500/40' : 'border-white/5'}`}
        style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }} />
    </div>
  );
};

