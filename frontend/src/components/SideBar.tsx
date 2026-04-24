import React from 'react';
import { Layers, Package, Download, Settings, ChevronRight, Minimize2, Power, Terminal } from 'lucide-react';
import { getTheme } from '../themes/themeConfig';

// ─── Stage 1: Core Navigation Items ──────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'plugins', label: 'Встроенные', icon: Layers },
  { id: 'decky', label: 'Catalog', icon: Package },
  { id: 'zip', label: 'Импорт ZIP', icon: Download },
  { id: 'settings', label: 'Настройки', icon: Settings },
  { id: 'exit', label: 'Выход', icon: Power, isAction: true },
] as const;

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  hint: string;
  isActive: boolean;
  onClick: () => void;
  isDark: boolean;
  isAction?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, hint, isActive, onClick, isDark, isAction }) => (
  <div className="px-4 mb-1">
    <div
      onClick={onClick}
      className={`cp-nav-item flex items-center gap-4 px-5 py-3.5 cursor-pointer relative ${isActive ? 'active' : ''} ${isAction ? 'opacity-80 hover:opacity-100' : ''}`}
    >
      <div className={`p-1.5 border transition-colors flex-shrink-0 ${isActive ? 'border-white/20 text-white' : isDark ? 'border-white/5 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
        <Icon size={14} />
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <span className={`text-[11px] font-medium uppercase tracking-wider truncate ${isActive ? 'text-white' : isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {label}
        </span>
        {!isAction && (
          <span className={`text-[8px] font-cp-mono uppercase tracking-widest mt-0.5 ${isActive ? 'text-white/40' : isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            {hint}
          </span>
        )}
      </div>

      {isActive && !isAction && (
        <ChevronRight size={10} className="text-white/40 flex-shrink-0" />
      )}
    </div>
  </div>
);

const ControllerHint: React.FC<{ isDark: boolean }> = ({ isDark }) => (
  <div className={`flex items-center justify-center gap-3 py-2 border-y ${isDark ? 'bg-white/3 border-white/5' : 'bg-black/3 border-black/5'}`}>
    <div className="flex items-center gap-1 text-[7px] font-cp-mono text-gray-500">
      <span>(LB/RB)</span>
      <span>NAV</span>
    </div>
    <div className={`w-px h-3 ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
    <div className="flex items-center gap-1 text-[7px] font-cp-mono text-gray-400">
      <div className="w-3 h-3 rounded-full border border-current flex items-center justify-center text-[5px]">A</div>
      <span>SELECT</span>
    </div>
  </div>
);

export const SideBar: React.FC<{ activeTab: string; onTabChange: (tab: string) => void; activeTheme?: string }> = ({ activeTab, onTabChange, activeTheme = 'cyberpunk' }) => {
  const theme = getTheme(activeTheme);
  const isDark = theme.isDark;

  const hints: Record<string, string> = {
    plugins: theme.menuHints.plugins,
    decky: theme.menuHints.online,
    zip: theme.menuHints.install,
    settings: theme.menuHints.settings,
  };

  return (
    <aside className={`w-64 h-full flex flex-col relative z-20 border-r transition-all duration-500 ${isDark ? 'bg-black/95 border-white/5' : 'bg-white border-gray-100'}`}>

      {/* ── Zone 1: Brand Block ─────────────────────────── */}
      <div className="px-7 pt-10 pb-4">
        <div className="flex items-center gap-4 mb-2">
          <div className={`w-8 h-8 border flex items-center justify-center flex-shrink-0 ${isDark ? 'border-white/20' : 'border-gray-200'}`}>
            <Terminal size={16} className={isDark ? 'text-white' : 'text-slate-800'} />
          </div>
          <h1 className={`text-xl font-cyber tracking-tighter ${isDark ? 'text-white' : 'text-slate-800'}`}>
            CYBER_MOD
          </h1>
        </div>

        {/* ── Zone 2: Active Theme Badge ─────────────────── */}
        <div className={`text-[7px] font-cp-mono uppercase tracking-[0.3em] font-bold ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
          {theme.badge}
        </div>
      </div>

      {/* ── Zone 3: Navigation ───────────────────────────── */}
      <div className={`px-7 mt-6 mb-3 text-[7px] font-cp-mono uppercase tracking-[0.2em] font-bold ${isDark ? 'text-white/20' : 'text-gray-400'}`}>
        Main Terminal
      </div>

      <nav className="flex-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            hint={hints[item.id] ?? ''}
            isActive={activeTab === item.id}
            onClick={() => onTabChange(item.id)}
            isDark={isDark}
            isAction={'isAction' in item}
          />
        ))}

        {/* ── Zone 4: Compact Status Block ────────────────── */}
        <div className="px-7 mt-8">
          <div className={`cp-diag-block text-[8px] font-cp-mono leading-relaxed border p-3 ${isDark ? 'bg-white/2 border-white/5 text-white/50' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>
            <div className="flex items-center gap-2 mb-2 opacity-40">
              <span className="w-1 h-1 bg-current rounded-full animate-pulse" />
              <span className="text-[6px] tracking-widest uppercase">System Link</span>
            </div>
            <div>{theme.diegeticBlock.line1}</div>
            <div>{theme.diegeticBlock.line2}</div>
            <div className="mt-2 text-[7px] opacity-30">{theme.diegeticBlock.line3}</div>
          </div>
        </div>
      </nav>

      {/* ── Zone 5: Bottom Controls ──────────────────────── */}
      <div className={`${isDark ? 'bg-black/30' : 'bg-gray-50/50'}`}>
        <ControllerHint isDark={isDark} />
        <div className="p-4">
          <button className={`w-full flex items-center justify-center gap-2 py-2 text-[9px] font-cp-mono uppercase tracking-widest border transition-all ${isDark ? 'border-white/5 text-white/40 hover:bg-white/5 hover:text-white' : 'border-gray-200 text-gray-400 hover:bg-gray-100 hover:text-gray-700'}`}>
            <Minimize2 size={11} />
            <span>Minimize Overlay</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

