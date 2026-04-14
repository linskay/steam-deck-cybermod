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
      
      {/* Red corner accent from the photo */}
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyber-magenta/40" />
    </motion.div>
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
        <h1 className="text-3xl font-cyber text-white tracking-widest leading-none select-none uppercase">
          <span className="cyber-glitch-text" data-text="CYBERMOD">CYBERMOD</span>
        </h1>
        <div className="text-[8px] font-tech mt-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-cyber-cyan rounded-full animate-pulse" />
          <span className="opacity-50 uppercase tracking-widest">STATION: NIGHT_CITY_v1.0.0_STABLE</span>
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

      {/* Footer Buttons for Steam Deck */}
      <div className="p-6 space-y-3 bg-cyber-magenta/5 border-t border-cyber-magenta/20">
        <div className="grid grid-cols-2 gap-3">
          <motion.button 
             whileHover={{ scale: 1.02, backgroundColor: 'rgba(0, 251, 255, 0.1)' }}
             className="flex items-center justify-center gap-2 py-3 border border-cyber-cyan/30 text-[9px] font-cyber tracking-widest text-cyber-cyan uppercase italic"
             style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 85% 100%, 0 100%)' }}
          >
            <Minimize2 size={12} />
            СВЕРНУТЬ
          </motion.button>
          <motion.button 
             whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 0, 60, 0.1)' }}
             className="flex items-center justify-center gap-2 py-3 border border-cyber-magenta/30 text-[9px] font-cyber tracking-widest text-cyber-magenta uppercase italic"
             style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 85% 100%, 0 100%)' }}
          >
            <Power size={12} />
            ЗАКРЫТЬ
          </motion.button>
        </div>
        
        <div className="flex items-center justify-between font-tech text-[7px] opacity-30 uppercase">
          <span>S_NET_DECK</span>
          <span className="flex items-center gap-1"><span className="w-1 h-1 bg-green-500 rounded-full" /> ONLINE</span>
        </div>
      </div>
    </div>
  );
};
