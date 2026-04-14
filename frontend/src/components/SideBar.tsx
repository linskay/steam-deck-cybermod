import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Package, Download, Settings, LogOut, Minimize2 } from 'lucide-react';
import { CyberButton } from './CyberButton';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, isActive, onClick }) => (
  <motion.div
    whileHover={{ x: 5 }}
    onClick={onClick}
    className={`
      flex items-center gap-4 px-6 py-4 cursor-pointer transition-all duration-300
      ${isActive ? 'bg-cyber-cyan/10 border-r-4 border-cyber-cyan text-cyber-cyan' : 'text-gray-400 hover:text-white'}
    `}
  >
    <Icon size={24} className={isActive ? 'animate-neon-pulse' : ''} />
    <span className="font-cyber font-bold tracking-wider uppercase text-sm">{label}</span>
  </motion.div>
);

interface SideBarProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

export const SideBar: React.FC<SideBarProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'plugins', label: 'Кибер-плагины', icon: Layers },
    { id: 'decky', label: 'Каталог Decky', icon: Package },
    { id: 'zip', label: 'Установить ZIP', icon: Download },
    { id: 'installed', label: 'Установленные', icon: Package },
    { id: 'settings', label: 'Настройки', icon: Settings },
  ];

  return (
    <div className="w-72 h-screen flex flex-col bg-cyber-black border-r border-cyber-cyan/30">
      <div className="p-8">
        <h1 className="text-3xl font-black text-cyber-yellow tracking-tighter italic">
          CYBER<span className="text-white">MOD</span>
        </h1>
        <div className="text-[10px] text-cyber-cyan font-tech mt-1 opacity-60">SYSTEM v21.0.1</div>
      </div>

      <nav className="flex-1 mt-4">
        {menuItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeTab === item.id}
            onClick={() => onTabChange(item.id)}
          />
        ))}
      </nav>

      <div className="p-6 space-y-4">
        <CyberButton variant="cyan" className="w-full justify-start gap-2 flex items-center">
          <Minimize2 size={18} />
          <span>Свернуть</span>
        </CyberButton>
        <CyberButton variant="magenta" className="w-full justify-start gap-2 flex items-center">
          <LogOut size={18} />
          <span>Выход</span>
        </CyberButton>
      </div>
    </div>
  );
};
