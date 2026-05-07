import React from 'react';
import { Download, Info, Trash2, ShieldCheck } from 'lucide-react';
import { getTheme } from '../themes/themeConfig';
import { PluginService } from '../services/PluginService';

export interface Plugin {
  id: string;
  name: string;
  author: string;
  description: string;
  version: string;
  image: string;
  installed: boolean;
  hasUpdate: boolean;
  source?: 'builtin' | 'decky' | 'zip';
  tags?: string[];
  minDeckyVersion?: string;
  oledSupport?: boolean;
  lcdSupport?: boolean;
}

interface PluginCardProps {
  plugin: Plugin;
  activeTheme?: string;
  deckyStatus?: string;
}

export const PluginCard: React.FC<PluginCardProps> = ({ plugin, activeTheme = 'cyberpunk', deckyStatus = 'UNKNOWN' }) => {
  const theme = getTheme(activeTheme);
  const isDark = theme.isDark;
  const [showPermissions, setShowPermissions] = React.useState(false);

  const deckyMissing = plugin.source === 'decky' && deckyStatus === 'NOT_INSTALLED';

  const getSourceLabel = (src?: string) => {
    switch (src) {
      case 'builtin': return 'ВСТРОЕННЫЙ';
      case 'decky': return 'DECKY';
      case 'zip': return 'ZIP';
      default: return 'PLUG';
    }
  };

  return (
    <div className={`cp-card flex flex-col group min-h-[160px] relative overflow-hidden transition-all duration-300 border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>

      {/* ── Top strip: Source / State / ID ────────────────── */}
      <div className={`px-4 py-1.5 flex items-center justify-between border-b text-[6px] font-cp-mono uppercase tracking-widest ${isDark ? 'border-white/5 text-white/30' : 'border-gray-50 text-gray-400'}`}>
        <div className="flex gap-4">
          <span className={isDark ? 'text-white/60' : 'text-slate-800'}>{getSourceLabel(plugin.source)}</span>
          <span>ID:{plugin.id.split('-')[0].toUpperCase()}</span>
        </div>
        <span className={plugin.installed ? 'text-green-500' : ''}>
          {plugin.installed ? '● УСТАНОВЛЕНО' : '○ ДОСТУПНО'}
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
                ОБНОВЛЕНИЕ
              </div>
            )}
          </div>

          <p className={`text-[9px] mt-2 line-clamp-2 leading-relaxed font-medium ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
            {plugin.description}
          </p>

          {/* ── Metadata row (Stage 5) ────────────────────────── */}
          <div className={`mt-auto flex items-center justify-between pt-3 border-t ${isDark ? 'border-white/5' : 'border-gray-50'}`}>
            <div className="flex items-center gap-2 text-[7px] font-cp-mono uppercase font-bold tracking-widest text-[#00ffcc]">
              <ShieldCheck size={10} />
              <span>Проверено</span>
            </div>
            <div className={`text-[7px] font-cp-mono uppercase tracking-[0.2em] ${isDark ? 'text-white/20' : 'text-gray-400'}`}>
              Источник: {plugin.source === 'builtin' ? 'Встроенный' : plugin.source === 'decky' ? 'Decky' : 'ZIP'}
            </div>

            {/* ── Actions Row ─────────────────────────────── */}
            <div className="flex gap-1.5">
              <button className={`cp-button p-1.5 min-w-0 border ${isDark ? 'border-white/10 text-white/40 hover:text-white' : 'border-gray-200 text-gray-400 hover:text-slate-800'}`} title="Info">
                <Info size={11} />
              </button>
              <button
                onClick={() => {
                    if (plugin.installed) return; // Add delete logic if needed
                    setShowPermissions(true);
                }}
                className={`cp-button flex items-center gap-2 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider border transition-all ${plugin.installed
                  ? 'border-red-500/30 text-red-500 bg-red-500/5 hover:bg-red-500 hover:text-white'
                  : deckyMissing
                    ? 'border-white/5 text-white/20 bg-black/20 cursor-not-allowed'
                    : isDark ? 'border-white/20 text-white bg-white/5 hover:bg-white/90 hover:text-black' : 'border-gray-200 text-slate-800 bg-white hover:bg-slate-800 hover:text-white shadow-sm'
                  }`}
                disabled={deckyMissing}
              >
                {plugin.installed ? (
                  <>
                    <Trash2 size={9} />
                    <span>Удалить</span>
                  </>
                ) : (
                  <>
                    <Download size={9} />
                    <span>{deckyMissing ? 'Нужен Decky' : 'Установить'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Permissions Overlay */}
      {showPermissions && (
        <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md p-4 flex flex-col items-center justify-center text-center">
            <ShieldCheck size={32} className="text-blue-500 mb-2" />
            <h4 className="text-[10px] font-bold uppercase tracking-widest mb-2">Запрос разрешений</h4>
            <div className="text-[8px] text-white/60 space-y-1 mb-4 font-cp-mono uppercase">
                <div>• Файловая система</div>
                <div>• Запуск процессов</div>
                <div>• Сеть</div>
                <div>• Локальное хранилище</div>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => setShowPermissions(false)}
                    className="px-4 py-1.5 border border-white/20 text-[8px] font-bold uppercase tracking-widest hover:bg-white/10"
                >
                    Отмена
                </button>
                <button
                    onClick={() => {
                        setShowPermissions(false);
                        PluginService.installPlugin(plugin.id, plugin.source || 'builtin');
                    }}
                    className="px-4 py-1.5 bg-blue-600 text-white text-[8px] font-bold uppercase tracking-widest hover:bg-blue-500"
                >
                    Разрешить
                </button>
            </div>
        </div>
      )}

      {/* Subtle state accent (Stage 5) */}
      <div className={`absolute bottom-0 right-0 w-4 h-4 border-b border-r transition-colors ${plugin.installed ? 'border-green-500/40' : 'border-white/5'}`}
        style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }} />
    </div>
  );
};

