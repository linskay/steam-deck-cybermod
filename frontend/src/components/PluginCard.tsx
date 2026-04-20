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
  const isDark = activeTheme !== 'portal';

  return (
    <div className={`cp-card flex flex-col group min-h-[160px] relative overflow-hidden`}>

      {/* ── Top strip ─────────────────────────────────────── */}
      <div className={`px-4 py-1.5 flex items-center justify-between border-b text-[6px] font-cp-mono uppercase tracking-widest ${isDark ? 'border-white/5 text-gray-600' : 'border-gray-100 text-gray-400'
        }`}>
        <span>ID_{plugin.id.split('-')[0].toUpperCase()}</span>
        <span>{plugin.installed ? '● ACTIVE' : '○ INACTIVE'}</span>
      </div>

      <div className="flex flex-1 mt-0">
        {/* ── Thumbnail ─────────────────────────────────────── */}
        <div className={`w-24 flex-shrink-0 relative overflow-hidden flex items-center justify-center border-r ${isDark ? 'bg-black/40 border-white/5' : 'bg-gray-50 border-gray-100'
          }`}>
          <img
            src={plugin.image || 'https://picsum.photos/seed/' + plugin.id + '/150/150'}
            alt={plugin.name}
            className={`w-full h-full object-cover transition-opacity duration-500 ${isDark ? 'opacity-20 group-hover:opacity-50' : 'opacity-60 group-hover:opacity-90'
              }`}
          />
          {isDark && (
            <div className="absolute inset-0 bg-gradient-to-r from-cp-black/60 via-transparent to-transparent pointer-events-none" />
          )}
        </div>

        {/* ── Content ────────────────────────────────────────── */}
        <div className="flex-1 p-4 flex flex-col relative">
          <div className="flex justify-between items-start gap-2">
            <div className="flex flex-col min-w-0">
              <h3 className={`text-[11px] font-medium tracking-wider truncate ${isDark ? 'text-white group-hover:text-cp-yellow' : 'text-slate-800'
                } transition-colors`}>
                {plugin.name}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[8px] font-cp-mono ${isDark ? 'text-cp-cyan' : 'text-blue-500'}`}>
                  v{plugin.version}
                </span>
                <span className={`text-[8px] font-cp-mono ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                  {plugin.author}
                </span>
              </div>
            </div>

            {plugin.hasUpdate && (
              <div className={`px-1.5 py-0.5 border text-[6px] font-cp-mono flex-shrink-0 ${isDark ? 'border-cp-cyan/40 text-cp-cyan bg-cp-cyan/5' : 'border-blue-300 text-blue-500 bg-blue-50'
                }`}>
                UPD
              </div>
            )}
          </div>

          <p className={`text-[9px] mt-2 line-clamp-2 leading-relaxed ${isDark ? 'text-gray-500' : 'text-slate-500'
            }`}>
            {plugin.description}
          </p>

          {/* ── Metadata row ─────────────────────────────────── */}
          <div className={`mt-auto flex items-center justify-between pt-3 border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
            {/* Theme flavor metadata — Layer C, 1 штрих на карточку */}
            <div className="flex items-center gap-3 text-[7px] font-cp-mono uppercase">
              <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>
                {theme.menuHints.plugins}
              </span>
              <span className={isDark ? 'text-cp-yellow/60' : 'text-blue-400/60'}>
                {plugin.installed ? 'INSTALLED' : 'AVAILABLE'}
              </span>
            </div>

            {/* ── Actions — CORE, always the same ──────────── */}
            <div className="flex gap-1.5">
              <button className="cp-button p-1.5 min-w-0" title="Подробнее" aria-label="Подробнее">
                <Info size={11} />
              </button>
              <button
                className={`cp-button flex items-center gap-1.5 px-2.5 py-1.5 text-[9px] ${plugin.installed ? 'cp-button-critical' : ''}`}
                aria-label={plugin.installed ? 'Удалить' : 'Установить'}
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

      {/* Accent corner — theme cosmetic only */}
      <div className={`absolute bottom-0 right-0 w-3 h-3 border-b border-r ${isDark ? 'border-white/10' : 'border-gray-200'}`} />
    </div>
  );
};
