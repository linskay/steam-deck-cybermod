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
        cp-nav-item flex flex-col px-6 py-4 cursor-pointer relative
        ${isActive ? 'active' : ''}
      `}
    >
      <div className="flex items-center gap-4">
        <div className={`p-1.5 border transition-colors ${isActive ? 'border-cp-yellow text-cp-yellow' : 'border-gray-800 text-gray-500'}`}>
          <Icon size={16} />
        </div>
        <div className="flex flex-col">
          <span className="font-cyber text-[10px] tracking-[0.2em] uppercase text-white">{label}</span>
          <span className={`text-[7px] font-cp-mono uppercase transition-colors ${isActive ? 'text-cp-yellow/80' : 'text-gray-600'}`}>
            {subLabel}
          </span>
        </div>
        {isActive && <ChevronRight size={12} className="ml-auto text-cp-yellow animate-pulse" />}
      </div>

      {/* Accent corner */}
      <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r transition-colors ${isActive ? 'border-cp-yellow/60' : 'border-gray-800/40'}`} />
    </motion.div>
  </div>
);

const ControllerHint: React.FC = () => (
  <div className="flex items-center justify-center gap-3 py-2 bg-white/5 border-y border-white/5">
    <div className="controller-hint text-cp-cyan">
      <div className="dpad-icon" />
      <span>NAV</span>
    </div>
    <div className="w-px h-3 bg-white/10" />
    <div className="controller-hint text-cp-yellow">
      <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[6px] font-bold">A</div>
      <span>SELECT</span>
    </div>
  </div>
);

interface SideBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  activeTheme?: string;
}

export const SideBar: React.FC<SideBarProps> = ({ activeTab, onTabChange, activeTheme = 'cyberpunk' }) => {
  const menuItems = [
    { id: 'plugins', label: activeTheme === 'stalker' ? 'ЗАДАНИЯ' : activeTheme === 'doom' ? 'ARMORY' : activeTheme === 'portal' ? 'CHAMBERS' : activeTheme === 'deadspace' ? 'KINETICS' : 'LOCAL', sub: activeTheme === 'stalker' ? 'СПИСОК' : activeTheme === 'doom' ? 'MODULES' : activeTheme === 'portal' ? 'TEST_READY' : activeTheme === 'deadspace' ? 'MODULES' : 'PLUGINS', icon: Layers },
    { id: 'decky', label: activeTheme === 'stalker' ? 'ТОРГОВЦЫ' : activeTheme === 'doom' ? 'NETWORK' : activeTheme === 'portal' ? 'DATABASE' : activeTheme === 'deadspace' ? 'EXTERNAL' : 'ONLINE', sub: activeTheme === 'stalker' ? 'СЕТЬ' : activeTheme === 'doom' ? 'UAC_NET' : activeTheme === 'portal' ? 'ACCESS' : activeTheme === 'deadspace' ? 'NET_NODES' : 'REPO', icon: Package },
    { id: 'zip', label: activeTheme === 'stalker' ? 'АРХИВ' : activeTheme === 'doom' ? 'LOADING' : activeTheme === 'portal' ? 'UPLOADS' : activeTheme === 'deadspace' ? 'IMPORT' : 'MANUAL', sub: activeTheme === 'stalker' ? 'ШИФР' : activeTheme === 'doom' ? 'IMPORT' : activeTheme === 'portal' ? 'PROCESS' : activeTheme === 'deadspace' ? 'CHIP_SET' : 'INSTALL', icon: Download },
    { id: 'settings', label: activeTheme === 'stalker' ? 'ПРИБОР' : activeTheme === 'doom' ? 'HUD' : activeTheme === 'portal' ? 'SETTINGS' : activeTheme === 'deadspace' ? 'RIG_CAL' : 'SYSTEM', sub: activeTheme === 'stalker' ? 'ПДА' : activeTheme === 'doom' ? 'CONFIG' : activeTheme === 'portal' ? 'PARAMS' : activeTheme === 'deadspace' ? 'BIOMETRIC' : 'CONFIG', icon: Settings },
  ];

  return (
    <aside className={`w-72 h-full ${activeTheme === 'portal' ? 'bg-white border-blue-50' : activeTheme === 'deadspace' ? 'bg-black/80 border-cyan-500/20' : 'bg-cp-black/95 border-white/5'} border-r flex flex-col relative z-20 transition-all duration-700`}>
      {/* Decorative Top Logo Area */}
      <div className="p-8 pt-12">
        <div className="flex items-center gap-4 mb-8">
          <div className={`w-10 h-10 border-2 ${activeTheme === 'doom' ? 'border-red-600' : activeTheme === 'portal' ? 'border-blue-400 rounded-full' : activeTheme === 'deadspace' ? 'border-cyan-400 rounded-sm scale-90' : 'border-cp-yellow'} transform rotate-45 flex items-center justify-center transition-all`}>
            <div className={`w-6 h-6 ${activeTheme === 'doom' ? 'bg-red-600' : activeTheme === 'portal' ? 'bg-blue-400 rounded-full' : activeTheme === 'deadspace' ? 'bg-cyan-400' : 'bg-cp-yellow'} transform -rotate-45`} />
          </div>
          <div>
            <h1 className={`text-2xl ${activeTheme === 'portal' ? 'font-sans font-light text-slate-800' : activeTheme === 'deadspace' ? 'font-tech text-cyan-400' : 'font-cyber text-white'} tracking-tighter`}>
              {activeTheme === 'stalker' ? 'ПДА-3' :
                activeTheme === 'doom' ? 'DOOM // HUD' :
                  activeTheme === 'portal' ? 'APERTURE // OS' :
                    activeTheme === 'deadspace' ? 'RIG // HOLO' : 'CYBER_MOD'}
            </h1>
            <div className={`h-[2px] w-full ${activeTheme === 'doom' ? 'bg-red-600' : activeTheme === 'portal' ? 'bg-blue-400 opacity-20' : activeTheme === 'deadspace' ? 'bg-cyan-500/40' : 'bg-cp-yellow'} mt-1`} />
          </div>
        </div>
        <div className="text-[8px] font-cp-mono mt-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-cp-cyan rounded-full animate-pulse" />
          <span className="opacity-50 uppercase tracking-widest text-cp-cyan/70">LINK_STATUS: STABLE_v1.0.0</span>
        </div>
      </div>

      <nav className="flex-1 mt-2 overflow-y-auto">
        <div className="px-10 mb-6 flex items-center justify-between">
          <span className={`text-[8px] font-cp-mono ${activeTheme === 'portal' ? 'text-slate-400' : activeTheme === 'deadspace' ? 'text-cyan-400/40' : 'text-cp-yellow/40'} uppercase tracking-[0.3em]`}>
            {activeTheme === 'portal' ? 'Navigation' : activeTheme === 'deadspace' ? 'RIG_INTERFACES' : 'Навигация'}
          </span>
          <div className="flex gap-1">
            <div className={`w-1 h-1 ${activeTheme === 'portal' ? 'bg-blue-200' : activeTheme === 'deadspace' ? 'bg-cyan-900' : 'bg-cp-yellow/20'}`} />
            <div className={`w-1 h-1 ${activeTheme === 'portal' ? 'bg-blue-400' : activeTheme === 'deadspace' ? 'bg-cyan-600' : 'bg-cp-yellow/40'}`} />
            <div className={`w-1 h-1 ${activeTheme === 'portal' ? 'bg-blue-600' : activeTheme === 'deadspace' ? 'bg-cyan-400' : 'bg-cp-yellow/60'}`} />
          </div>
        </div>
        {menuItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            subLabel={item.sub}
            isActive={activeTab === item.id}
            onClick={() => onTabChange(item.id)}
          />
        ))}

        {/* Diegetic UI Block */}
        <div className="px-10 mt-12">
          <div className="cp-diag-block">
            <div>
              {activeTheme === 'stalker' ? 'СИГНАЛ: ОТЛИЧНЫЙ' :
                activeTheme === 'doom' ? 'LOCATION: HELL' :
                  activeTheme === 'portal' ? 'ANALYSIS: COMPLETE' :
                    activeTheme === 'deadspace' ? 'SYSTEM: READY' : 'NETWORK PING: 24ms'}
            </div>
            <div>
              {activeTheme === 'stalker' ? 'ДАННЫЕ: ЗАГРУЖЕНЫ' :
                activeTheme === 'doom' ? 'THREAT: EXTREME' :
                  activeTheme === 'portal' ? 'TEST_STATUS: READY' :
                    activeTheme === 'deadspace' ? 'BIOLINK: ACTIVE' : 'THREAT INDEX: MINIMAL'}
            </div>
            <div>
              {activeTheme === 'stalker' ? 'КАНАЛ: АКТИВЕН' :
                activeTheme === 'doom' ? 'WEAPON: BF-G9000' :
                  activeTheme === 'portal' ? 'NEURAL: OPTIMAL' :
                    activeTheme === 'deadspace' ? 'LINK_ESTABLISHED' : 'NEURAL LINK: ACTIVE'}
            </div>
            <div className="mt-2 text-[6px] opacity-30">
              {activeTheme === 'deadspace' ? 'SUBJECT: ISAAC' : 'LOAD_BUFFER: [#######---] 72%'}
            </div>
          </div>
        </div>
      </nav>

      <div className="bg-cyber-black/80 backdrop-blur-lg">
        <ControllerHint />
        <div className="p-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="cp-button flex items-center justify-center gap-2 py-3"
            >
              <Minimize2 size={12} className="relative z-10" />
              <span className="relative z-10">{activeTheme === 'portal' ? 'Sleep' : activeTheme === 'deadspace' ? 'SLEEP' : 'СВЕРНУТЬ'}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="cp-button cp-button-critical flex items-center justify-center gap-2 py-3"
            >
              <Power size={12} className="relative z-10" />
              <span className="relative z-10">{activeTheme === 'portal' ? 'Shutdown' : activeTheme === 'deadspace' ? 'OFFLINE' : 'ВЫХОД'}</span>
            </motion.button>
          </div>

          <div className="flex items-center justify-between font-cp-mono text-[7px] opacity-20 uppercase tracking-[0.2em]">
            <span>S_NET_DECK_LINK</span>
            <span className="flex items-center gap-1"><span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" /> LIVE</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
