import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Package, Download, Settings, ChevronRight, Minimize2, Power } from 'lucide-react';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  subLabel: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, subLabel, isActive, onClick }) => (
  <div className="px-6 mb-2">
    <motion.div
      onClick={onClick}
      className={`
        quest-nav-item flex flex-col px-6 py-4 cursor-pointer relative
        ${isActive ? 'active' : ''}
      `}
    >
      <div className="flex items-center gap-4">
        <div className={`p-1.5 border ${isActive ? 'border-cyber-cyan text-cyber-cyan' : 'border-gray-800 text-gray-500'}`}>
          <Icon size={16} className={isActive ? 'animate-neon-pulse' : ''} />
        </div>
        <div className="flex flex-col">
          <span className="font-cyber text-[10px] tracking-[0.2em] uppercase text-white">{label}</span>
          <span className="text-[7px] font-tech text-cyber-magenta/60 uppercase group-hover:text-cyber-magenta transition-colors">
            {subLabel}
          </span>
        </div>
        {isActive && <ChevronRight size={12} className="ml-auto text-cyber-magenta animate-pulse" />}
      </div>
      
      {/* Red corner accent */}
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyber-magenta/40" />
    </motion.div>
  </div>
);

const ControllerHint: React.FC = () => (
  <div className="flex items-center justify-center gap-3 py-2 bg-white/5 border-y border-white/5">
    <div className="controller-hint text-cyber-cyan">
       <div className="dpad-icon" />
       <span>NAV</span>
    </div>
    <div className="w-px h-3 bg-white/10" />
    <div className="controller-hint text-cyber-magenta">
       <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[6px] font-bold">A</div>
       <span>SELECT</span>
    </div>
  </div>
);

export const SideBar: React.FC<{ activeTab: string; onTabChange: (id: string) => void }> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'plugins', label: 'ПЛАГИНЫ', subLabel: 'MOD_CUSTOM_STACK', icon: Layers },
    { id: 'decky', label: 'КАТАЛОГ DECKY', subLabel: 'OFFICIAL_REPO', icon: Package },
    { id: 'zip', label: 'ИМПОРТ .ZIP', subLabel: 'LOCAL_INSTALL', icon: Download },
    { id: 'installed', label: 'УСТАНОВЛЕНО', subLabel: 'ACTIVE_MODULES', icon: Package },
    { id: 'settings', label: 'КОНФИГУРАЦИЯ', subLabel: 'SYSTEM_SETTINGS', icon: Settings },
  ];

  return (
    <div className="w-80 h-screen flex flex-col bg-cyber-black border-r border-cyber-magenta/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      <div className="p-10 relative">
        <div className="absolute top-10 left-8 w-1 h-12 bg-cyber-magenta opacity-50" />
        <div className="absolute top-10 right-10 w-8 h-8 opacity-10">
          <svg viewBox="0 0 100 100" className="fill-cyber-cyan">
            <path d="M0 0h100v20H0zM0 40h100v20H0zM0 80h100v20H0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-cyber text-white tracking-widest leading-none select-none uppercase">
          <span className="cyber-glitch-text" data-text="CYBERMOD">CYBERMOD</span>
        </h1>
        <div className="text-[8px] font-tech mt-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-cyber-cyan rounded-full animate-pulse" />
          <span className="opacity-50 uppercase tracking-widest text-cyber-cyan/70">STATION: NIGHT_CITY_v1.0.0</span>
        </div>
      </div>

      <nav className="flex-1 mt-2 overflow-y-auto">
        <div className="px-10 mb-6 text-[8px] font-tech text-cyber-magenta/40 uppercase tracking-[0.3em]">Навигация_интерфейса</div>
        {menuItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            subLabel={item.subLabel}
            isActive={activeTab === item.id}
            onClick={() => onTabChange(item.id)}
          />
        ))}
      </nav>

      {/* Footer Area with Controller Hints & System Buttons */}
      <div className="bg-cyber-black/80 backdrop-blur-lg">
        <ControllerHint />
        <div className="p-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <motion.button 
               whileHover={{ scale: 1.05, backgroundColor: 'rgba(0, 251, 255, 0.15)' }}
               className="flex items-center justify-center gap-2 py-3 border border-cyber-cyan/40 text-[9px] font-cyber tracking-widest text-cyber-cyan uppercase italic group relative overflow-hidden"
               style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 85% 100%, 0 100%)' }}
            >
              <div className="absolute inset-0 bg-cyber-cyan/5 group-hover:bg-cyber-cyan/20 transition-colors" />
              <Minimize2 size={12} className="relative z-10" />
              <span className="relative z-10">СВЕРНУТЬ</span>
            </motion.button>
            <motion.button 
               whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 0, 60, 0.15)' }}
               className="flex items-center justify-center gap-2 py-3 border border-cyber-magenta/40 text-[9px] font-cyber tracking-widest text-cyber-magenta uppercase italic group relative overflow-hidden"
               style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 85% 100%, 0 100%)' }}
            >
              <div className="absolute inset-0 bg-cyber-magenta/5 group-hover:bg-cyber-magenta/20 transition-colors" />
              <Power size={12} className="relative z-10" />
              <span className="relative z-10">ЗАКРЫТЬ</span>
            </motion.button>
          </div>
          
          <div className="flex items-center justify-between font-tech text-[7px] opacity-20 uppercase tracking-[0.2em]">
            <span>S_NET_DECK_LINK</span>
            <span className="flex items-center gap-1"><span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" /> LIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
