import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Database, RefreshCw, Cpu, Activity } from 'lucide-react';
import { CyberButton } from './CyberButton';

const SettingItem: React.FC<{ icon: any, title: string, desc: string, actionLabel: string, variant?: any }> = ({ icon: Icon, title, desc, actionLabel, variant='cyan' }) => (
  <div className="flex items-center justify-between p-6 border-b border-cyber-cyan/10 hover:bg-cyber-cyan/5 transition-colors group">
    <div className="flex items-center gap-6">
      <div className="p-3 bg-cyber-dark border border-cyber-cyan/30 text-cyber-cyan group-hover:shadow-neon-cyan transition-all">
        <Icon size={24} />
      </div>
      <div>
        <h3 className="font-cyber font-bold text-white uppercase tracking-wider">{title}</h3>
        <p className="text-gray-500 font-tech text-[10px] mt-1 italic">// {desc}</p>
      </div>
    </div>
    <CyberButton variant={variant} className="text-[10px] py-1">
      {actionLabel}
    </CyberButton>
  </div>
);

export const SettingsScreen: React.FC = () => {
  return (
    <div className="flex flex-col gap-2 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="p-6 bg-cyber-dark/40 border border-cyber-magenta/20 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-cyber-magenta font-tech text-xs">
            <Activity size={16} /> СИСТЕМНАЯ ДИАГНОСТИКА
          </div>
          <div className="space-y-2 mt-2">
            <div className="flex justify-between text-[10px] font-tech text-gray-500">
              <span>DECKY LOADER STATUS:</span>
              <span className="text-green-500">RUNNING</span>
            </div>
            <div className="flex justify-between text-[10px] font-tech text-gray-500">
              <span>STORAGE (PLUGINS):</span>
              <span className="text-cyber-cyan">1.2 GB / 50 GB</span>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-cyber-dark/40 border border-cyber-cyan/20 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-cyber-cyan font-tech text-xs">
            <Cpu size={16} /> ЯДРО CYBERMOD
          </div>
          <div className="space-y-2 mt-2">
            <div className="flex justify-between text-[10px] font-tech text-gray-500">
              <span>JAVA VERSION:</span>
              <span className="text-white font-bold">21.0.1+12</span>
            </div>
            <div className="flex justify-between text-[10px] font-tech text-gray-500">
              <span>UPTIME:</span>
              <span className="text-white">04:20:15</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-cyber-cyan/20 bg-cyber-black overflow-hidden shadow-2xl">
        <SettingItem 
          icon={RefreshCw} 
          title="Каналы обновлений" 
          desc="Выбор между релизными и бета-версиями плагинов" 
          actionLabel="СТАБИЛЬНЫЙ"
        />
        <SettingItem 
          icon={Database} 
          title="Очистка кэша" 
          desc="Удаление временных файлов установки и логов" 
          actionLabel="ОЧИСТИТЬ" 
          variant="magenta"
        />
        <SettingItem 
          icon={Shield} 
          title="Режим разработчика" 
          desc="Разрешить установку неподписанных манифестов" 
          actionLabel="ВКЛЮЧИТЬ"
          variant="yellow"
        />
      </div>
    </div>
  );
};
