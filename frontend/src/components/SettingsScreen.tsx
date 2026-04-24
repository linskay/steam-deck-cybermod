import React from 'react';
import { Shield, Database, RefreshCw, Cpu, Activity, AlertTriangle, Check } from 'lucide-react';
import { THEMES, getTheme, type ThemeId } from '../themes/themeConfig';

// ─── Theme preview card (Stage 7) ─────────────────────────────────────────────
interface ThemeCardProps {
  themeId: ThemeId;
  isActive: boolean;
  onApply: () => void;
  isDark: boolean;
}

const ThemeCard: React.FC<ThemeCardProps> = ({ themeId, isActive, onApply, isDark }) => {
  const cfg = THEMES[themeId];

  return (
    <div className={`p-5 border transition-all duration-300 flex flex-col gap-4 relative ${isActive
      ? isDark ? 'border-white/40 bg-white/5' : 'border-blue-400 bg-blue-50 shadow-md'
      : isDark ? 'border-white/5 bg-white/2 hover:border-white/10' : 'border-gray-100 bg-white hover:border-gray-200'
      }`}>
      {isActive && (
        <div className={`absolute top-3 right-3 px-2 py-0.5 font-cp-mono text-[7px] font-bold uppercase tracking-widest ${isDark ? 'bg-white text-black' : 'bg-blue-500 text-white'}`}>
          Активна
        </div>
      )}

      <div>
        <h4 className={`text-[12px] font-cyber tracking-wider ${isDark ? 'text-white' : 'text-slate-800'}`}>{cfg.label}</h4>
        <p className={`text-[8px] font-cp-mono mt-0.5 uppercase tracking-widest ${isDark ? 'text-white/30' : 'text-gray-400'}`}>{cfg.description}</p>
      </div>

      <ul className="space-y-1 mt-2">
        {cfg.bullets.slice(0, 2).map((b, i) => (
          <li key={i} className={`flex items-start gap-2 text-[8px] uppercase tracking-widest font-cp-mono ${isDark ? 'text-white/20' : 'text-gray-400'}`}>
            <Check size={8} className="mt-0.5 flex-shrink-0" />
            {b}
          </li>
        ))}
      </ul>

      <button
        onClick={onApply}
        disabled={isActive}
        className={`mt-auto h-9 font-cp-mono text-[9px] uppercase tracking-widest border transition-all ${isActive
          ? 'opacity-0 pointer-events-none'
          : isDark ? 'border-white/10 text-white hover:bg-white/5' : 'border-gray-200 text-slate-800 hover:bg-gray-50'
          }`}
      >
        Выбрать
      </button>
    </div>
  );
};

// ─── Diagnostic row ───────────────────────────────────────────────────────────
const DiagRow: React.FC<{ label: string; value: string; status?: 'ok' | 'warn' | 'off'; isDark: boolean }> = ({ label, value, status = 'ok', isDark }) => (
  <div className={`flex items-center justify-between py-2 border-b text-[9px] font-cp-mono ${isDark ? 'border-white/5' : 'border-gray-50'}`}>
    <span className={`${isDark ? 'text-white/20' : 'text-gray-400'} uppercase`}>{label}</span>
    <span className={
      status === 'ok' ? 'text-green-500' :
        status === 'warn' ? 'text-yellow-500' :
          isDark ? 'text-white/10' : 'text-gray-300'
    }>{value}</span>
  </div>
);

// ─── Tool button ──────────────────────────────────────────────────────────────
const ToolBtn: React.FC<{ icon: React.ElementType; label: string; sub: string; isDark: boolean }> = ({ icon: Icon, label, sub, isDark }) => (
  <button className={`flex flex-col items-center gap-2 group p-4 border transition-all ${isDark ? 'border-white/5 bg-white/2 hover:bg-white/5' : 'border-gray-100 bg-white hover:bg-gray-50'}`}>
    <div className={`p-3 border transition-all ${isDark ? 'border-white/10 text-white/30 group-hover:text-white group-hover:border-white/30' : 'border-gray-200 text-gray-400 group-hover:text-slate-800 group-hover:border-gray-300'}`}>
      <Icon size={20} />
    </div>
    <div className="text-center">
      <div className={`font-cp-mono text-[9px] uppercase tracking-widest ${isDark ? 'text-white/40 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>{label}</div>
      <div className={`font-cp-mono text-[7px] mt-0.5 ${isDark ? 'text-white/10' : 'text-gray-400'}`}>{sub}</div>
    </div>
  </button>
);

// ─── Main settings screen ─────────────────────────────────────────────────────
import { PluginService } from '../services/PluginService';

export const SettingsScreen: React.FC<{ activeTheme?: string, onThemeChange?: (theme: string) => void }> = ({ activeTheme = 'cyberpunk', onThemeChange }) => {
  const currentTheme = getTheme(activeTheme);
  const isDark = currentTheme.isDark;
  const [stats, setStats] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchStats = async () => {
      const data = await PluginService.getSystemStats();
      if (data) setStats(data);
    };
    fetchStats();
    const timer = setInterval(fetchStats, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col gap-12 max-w-5xl">

      {/* ── I. Theme Gallery (Stage 7) ────────────────────── */}
      <section>
        <header className="mb-6">
          <h3 className={`font-cyber text-[11px] tracking-[0.4em] flex items-center gap-3 uppercase ${isDark ? 'text-white' : 'text-slate-800'}`}>
            <RefreshCw size={14} className={isDark ? 'text-white/40' : 'text-blue-500'} />
            Оболочка интерфейса
          </h3>
          <div className={`h-px w-full mt-2 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {(Object.keys(THEMES) as ThemeId[]).map((id) => (
            <ThemeCard
              key={id}
              themeId={id}
              isActive={activeTheme === id}
              onApply={() => onThemeChange?.(id)}
              isDark={isDark}
            />
          ))}
        </div>
      </section>

      {/* ── II. Active Theme Details (Stage 7) ─────────────── */}
      <section className={`p-8 border ${isDark ? 'bg-white/2 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-1/3 flex flex-col gap-4">
            <div className={`aspect-video border flex items-center justify-center overflow-hidden ${isDark ? 'border-white/10 bg-black' : 'border-gray-200 bg-gray-50'}`}>
              <img src={currentTheme.artwork.backgroundUrl} className="w-full h-full object-cover opacity-20 grayscale" alt="Preview" />
              <span className="absolute font-cp-mono text-[8px] uppercase tracking-widest opacity-40">Превью</span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 h-2 bg-white/10" />
              <div className="flex-1 h-2 bg-white/20" />
              <div className="flex-1 h-2 bg-white/30" />
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <div className={`text-[8px] font-cp-mono uppercase tracking-[0.3em] mb-2 ${isDark ? 'text-white/20' : 'text-gray-400'}`}>Текущая тема</div>
            <h4 className={`text-2xl font-cyber uppercase tracking-widest mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>{currentTheme.label}</h4>
            <ul className="space-y-3">
              {currentTheme.bullets.map((b, i) => (
                <li key={i} className={`flex items-center gap-3 text-[10px] uppercase tracking-widest font-cp-mono ${isDark ? 'text-white/40' : 'text-slate-600'}`}>
                  <div className={`w-1 h-1 rotate-45 ${isDark ? 'bg-white/20' : 'bg-blue-400'}`} />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── III. Diagnostics ──────────────────────────────── */}
      <section>
        <header className="mb-6">
          <h3 className={`font-cyber text-[11px] tracking-[0.4em] flex items-center gap-3 uppercase ${isDark ? 'text-white' : 'text-slate-800'}`}>
            <Activity size={14} className={isDark ? 'text-white/40' : 'text-green-500'} />
            Диагностика
          </h3>
          <div className={`h-px w-full mt-2 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-6 border ${isDark ? 'bg-white/2 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
            <div className={`text-[8px] font-cp-mono uppercase tracking-widest mb-4 font-bold ${isDark ? 'text-white/20' : 'text-gray-400'}`}>Среда</div>
            <DiagRow label="Decky Loader" value={stats?.status || 'POLLING...'} status={stats?.status === 'INSTALLED' ? 'ok' : 'off'} isDark={isDark} />
            <DiagRow label="Active Themes" value="5" status="ok" isDark={isDark} />
            <DiagRow label="Secure Link" value="CONNECTED" status="ok" isDark={isDark} />
          </div>
          <div className={`p-6 border ${isDark ? 'bg-white/2 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
            <div className={`text-[8px] font-cp-mono uppercase tracking-widest mb-4 font-bold ${isDark ? 'text-white/20' : 'text-gray-400'}`}>Производительность</div>
            <DiagRow label="Memory Used" value={stats?.memoryUsed || '...'} status="ok" isDark={isDark} />
            <DiagRow label="Memory Total" value={stats?.memoryTotal || '...'} status="ok" isDark={isDark} />
            <DiagRow label="CPU Load" value={stats?.cpuLoad || '...'} status="ok" isDark={isDark} />
          </div>
        </div>
      </section>

      {/* ── IV. Tools ────────────────────────────────────── */}
      <section>
        <header className="mb-6">
          <h3 className={`font-cyber text-[11px] tracking-[0.4em] flex items-center gap-3 uppercase ${isDark ? 'text-white' : 'text-slate-800'}`}>
            <Cpu size={14} className={isDark ? 'text-white/40' : 'text-yellow-500'} />
            Обслуживание
          </h3>
          <div className={`h-px w-full mt-2 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
        </header>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <ToolBtn icon={RefreshCw} label="Каналы" sub="PO_UPDATE" isDark={isDark} />
          <ToolBtn icon={Database} label="Кэш" sub="PURGE" isDark={isDark} />
          <ToolBtn icon={Shield} label="Dev Mode" sub="LVL_5" isDark={isDark} />
          <ToolBtn icon={Cpu} label="Оптим." sub="KERNEL" isDark={isDark} />
          <ToolBtn icon={Activity} label="Логи" sub="STREAM" isDark={isDark} />
        </div>
      </section>

      {/* ── V. Footer ─────────────────────────────────────── */}
      <footer className={`flex items-start gap-4 p-5 border ${isDark ? 'border-white/5 bg-white/2' : 'border-gray-100 bg-white shadow-sm'}`}>
        <AlertTriangle size={14} className="text-yellow-600 mt-0.5 flex-shrink-0" />
        <p className={`font-cp-mono text-[8px] uppercase tracking-wider leading-relaxed ${isDark ? 'text-white/20' : 'text-gray-500'}`}>
          Изменение параметров ядра может дестабилизировать систему. <br />
          Build v1.2.0-stable session_id: {Math.random().toString(16).slice(2, 10).toUpperCase()}
        </p>
      </footer>
    </div>
  );
};

