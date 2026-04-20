import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Package, Download, Settings, ChevronRight, Minimize2, Power } from 'lucide-react';
import { getTheme } from '../themes/themeConfig';

// ─── Core nav items — labels are ALWAYS fixed, never theme-dependent ──────────
const NAV_ITEMS = [
  { id: 'plugins', label: 'Встроенные', icon: Layers },
  { id: 'decky', label: 'Decky', icon: Package },
  { id: 'zip', label: 'Импорт ZIP', icon: Download },
  { id: 'settings', label: 'Система', icon: Settings },
] as const;

// ─── Sub-components ──────────────────────────────────────────────────────────

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  hint: string;
  isActive: boolean;
  onClick: () => void;
  isDark: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, hint, isActive, onClick, isDark }) => (
  <div className="px-4 mb-1">
    <div
      onClick={onClick}
      className={`cp-nav-item flex items-center gap-4 px-5 py-3.5 cursor-pointer relative ${isActive ? 'active' : ''}`}
    >
      {/* Gamepad focus rail */}
      <div className={`absolute left-0 top-0 h-full w-[3px] transition-colors ${isActive ? 'bg-cp-yellow' : 'bg-transparent'}`} />

      <div className={`p-1.5 border transition-colors flex-shrink-0 ${isActive ? 'border-cp-yellow text-cp-yellow' : isDark ? 'border-gray-700 text-gray-500' : 'border-gray-300 text-gray-400'}`}>
        <Icon size={14} />
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        {/* Primary label — CORE, never changes */}
        <span className={`text-[11px] font-medium uppercase tracking-wider truncate ${isActive ? 'text-white' : isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {label}
        </span>
        {/* Secondary hint — flavor, from themeConfig */}
        <span className={`text-[8px] font-cp-mono uppercase tracking-widest mt-0.5 ${isActive ? 'text-cp-yellow/70' : isDark ? 'text-gray-600' : 'text-gray-400'}`}>
          {hint}
        </span>
      </div>

      {isActive && (
        <ChevronRight size={10} className="text-cp-yellow flex-shrink-0" />
      )}
    </div>
  </div>
);

const ControllerHint: React.FC<{ isDark: boolean }> = ({ isDark }) => (
  <div className={`flex items-center justify-center gap-3 py-2 border-y ${isDark ? 'bg-white/3 border-white/5' : 'bg-black/3 border-black/5'}`}>
    <div className="controller-hint text-cp-cyan">
      <div className="dpad-icon" />
      <span>NAV</span>
    </div>
    <div className={`w-px h-3 ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
    <div className="controller-hint text-cp-yellow">
      <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[6px] font-bold">A</div>
      <span>SELECT</span>
    </div>
  </div>
);

// ─── Main Sidebar ─────────────────────────────────────────────────────────────

interface SideBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  activeTheme?: string;
}

export const SideBar: React.FC<SideBarProps> = ({ activeTab, onTabChange, activeTheme = 'cyberpunk' }) => {
  const theme = getTheme(activeTheme);
  const isDark = activeTheme !== 'portal';

  const hints: Record<string, string> = {
    plugins: theme.menuHints.plugins,
    decky: theme.menuHints.online,
    zip: theme.menuHints.install,
    settings: theme.menuHints.settings,
  };

  return (
    <aside className={`w-64 h-full flex flex-col relative z-20 border-r transition-all duration-500 ${activeTheme === 'portal'
        ? 'bg-white border-gray-100'
        : activeTheme === 'deadspace'
          ? 'bg-black/90 border-cyan-500/15'
          : 'bg-cp-black/95 border-white/5'
      }`}>

      {/* ── Logo block ─────────────────────────────────────── */}
      <div className="px-7 pt-10 pb-6">
        <div className="flex items-center gap-4 mb-4">
          {/* Theme accent gem */}
          <div className={`w-8 h-8 border-2 flex items-center justify-center transform rotate-45 flex-shrink-0 ${activeTheme === 'doom' ? 'border-red-600' :
              activeTheme === 'portal' ? 'border-blue-400 rounded-full' :
                activeTheme === 'deadspace' ? 'border-cyan-400' :
                  activeTheme === 'stalker' ? 'border-green-500' :
                    'border-cp-yellow'
            }`}>
            <div className={`w-4 h-4 transform -rotate-45 ${activeTheme === 'doom' ? 'bg-red-600' :
                activeTheme === 'portal' ? 'bg-blue-400 rounded-full' :
                  activeTheme === 'deadspace' ? 'bg-cyan-400' :
                    activeTheme === 'stalker' ? 'bg-green-500' :
                      'bg-cp-yellow'
              }`} />
          </div>

          <div>
            {/* Always CYBER_MOD — core, never changes */}
            <h1 className={`text-xl font-cyber tracking-tighter ${isDark ? 'text-white' : 'text-slate-800'}`}>
              CYBER_MOD
            </h1>
            {/* Theme badge — flavor layer */}
            <div className={`text-[7px] font-cp-mono uppercase tracking-widest mt-0.5 ${activeTheme === 'stalker' ? 'text-green-500/60' :
                activeTheme === 'doom' ? 'text-red-500/60' :
                  activeTheme === 'portal' ? 'text-blue-400/60' :
                    activeTheme === 'deadspace' ? 'text-cyan-400/50' :
                      'text-cp-yellow/40'
              }`}>
              {theme.badge}
            </div>
          </div>
        </div>

        {/* Accent divider */}
        <div className={`h-px w-full ${activeTheme === 'doom' ? 'bg-red-700' :
            activeTheme === 'portal' ? 'bg-blue-200' :
              activeTheme === 'deadspace' ? 'bg-cyan-500/30' :
                activeTheme === 'stalker' ? 'bg-green-800' :
                  'bg-cp-yellow/30'
          }`} />

        {/* Connection status */}
        <div className="flex items-center gap-2 mt-4">
          <span className="w-1.5 h-1.5 bg-cp-cyan rounded-full animate-pulse flex-shrink-0" />
          <span className={`text-[8px] font-cp-mono uppercase tracking-widest truncate ${isDark ? 'text-cp-cyan/50' : 'text-slate-400'}`}>
            {theme.diegeticBlock.line3}
          </span>
        </div>
      </div>

      {/* ── Nav section label ──────────────────────────────── */}
      <div className={`px-7 mb-3 text-[7px] font-cp-mono uppercase tracking-[0.3em] ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
        Разделы
      </div>

      {/* ── Navigation ─────────────────────────────────────── */}
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
          />
        ))}

        {/* ── Diegetic status block ─────────────────────────── */}
        <div className="px-7 mt-8">
          <div className="cp-diag-block text-[8px] font-cp-mono leading-relaxed">
            <div className={`text-[6px] mb-2 uppercase tracking-widest ${isDark ? 'opacity-30' : 'opacity-20'}`}>
              SYSTEM_STATUS
            </div>
            <div>{theme.diegeticBlock.line1}</div>
            <div>{theme.diegeticBlock.line2}</div>
          </div>
        </div>
      </nav>

      {/* ── Bottom controls ─────────────────────────────────── */}
      <div className={`${isDark ? 'bg-black/30' : 'bg-gray-50'}`}>
        <ControllerHint isDark={isDark} />
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button className="cp-button flex items-center justify-center gap-2 py-2.5 text-[10px]">
              <Minimize2 size={11} />
              <span>Свернуть</span>
            </button>
            <button className="cp-button cp-button-critical flex items-center justify-center gap-2 py-2.5 text-[10px]">
              <Power size={11} />
              <span>Выход</span>
            </button>
          </div>

          <div className={`flex items-center justify-between font-cp-mono text-[7px] uppercase tracking-[0.2em] ${isDark ? 'opacity-20' : 'opacity-30'}`}>
            <span>S_NET_DECK_LINK</span>
            <span className="flex items-center gap-1">
              <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
              LIVE
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
