import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Database, RefreshCw, Cpu, Activity, Hexagon } from 'lucide-react';

interface CyberChipProps {
  icon: React.ElementType;
  label: string;
  desc: string;
  status: string;
  variant?: 'cyan' | 'magenta' | 'yellow';
}

const CyberChip: React.FC<CyberChipProps> = ({ icon: Icon, label, desc, status, variant = 'cyan' }) => {
  const colorClass = variant === 'magenta' ? 'text-cyber-magenta hover:text-white' : 
                     variant === 'yellow' ? 'text-cyber-yellow hover:text-white' : 
                     'text-cyber-cyan hover:text-white';
  
  const borderClass = variant === 'magenta' ? 'border-cyber-magenta/40' : 
                      variant === 'yellow' ? 'border-cyber-yellow/40' : 
                      'border-cyber-cyan/40';

  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="flex flex-col items-center group cursor-pointer"
    >
      <div className={`cyber-chip-slot ${variant === 'magenta' ? 'red' : ''} ${colorClass} flex items-center justify-center relative mb-4`}>
        <div className="chip-tab" />
        
        {/* Status indicator in the top right corner */}
        <div className="absolute top-2 right-2 font-tech text-[8px] opacity-70 group-hover:opacity-100 flex flex-col items-end">
           <span className="leading-none">{status}</span>
           <Hexagon size={6} className="mt-1" />
        </div>

        {/* The main icon */}
        <Icon size={32} className="opacity-60 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110" />

        {/* Decorative corner brackets */}
        <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-current opacity-30" />
      </div>

      <div className="text-center">
        <h4 className="font-cyber text-[10px] tracking-widest text-white group-hover:text-current transition-colors">
          {label}
        </h4>
        <p className="text-[7px] font-tech text-gray-500 mt-1 uppercase w-24 leading-tight opacity-0 group-hover:opacity-100 transition-opacity">
          {desc}
        </p>
      </div>
    </motion.div>
  );
};

export const SettingsScreen: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      {/* Top Section: System Diagnostics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 bg-cyber-dark/40 border-l-4 border-cyber-magenta flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-5">
            <Activity size={120} />
          </div>
          <div className="flex items-center gap-2 text-cyber-magenta font-tech text-xs tracking-[0.2em]">
            <Activity size={16} /> СИСТЕМНАЯ_ДИАГНОСТИКА
          </div>
          <div className="space-y-3 mt-4 relative z-10">
            <div className="flex justify-between text-[9px] font-tech border-b border-white/5 pb-2">
              <span className="text-gray-500">DECKY_LOADER:</span>
              <span className="text-green-500 font-bold bg-green-500/10 px-2">RUNNING</span>
            </div>
            <div className="flex justify-between text-[9px] font-tech border-b border-white/5 pb-2">
              <span className="text-gray-500">ПАМЯТЬ_ПЛАГИНОВ:</span>
              <span className="text-cyber-cyan">1_225_MB / 50_000_MB</span>
            </div>
          </div>
        </div>
        
        <div className="p-8 bg-cyber-dark/40 border-l-4 border-cyber-cyan flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-5">
            <Cpu size={120} />
          </div>
          <div className="flex items-center gap-2 text-cyber-cyan font-tech text-xs tracking-[0.2em]">
            <Cpu size={16} /> ЯДРО_CYBERMOD
          </div>
          <div className="space-y-3 mt-4 relative z-10">
            <div className="flex justify-between text-[9px] font-tech border-b border-white/5 pb-2">
              <span className="text-gray-500">JAVA_VM:</span>
              <span className="text-white font-bold italic">v21.0.1_GRAALVM</span>
            </div>
            <div className="flex justify-between text-[9px] font-tech border-b border-white/5 pb-2">
              <span className="text-gray-500">UPTIME_SESSION:</span>
              <span className="text-white">04:20:15_HRS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Settings Section - The Chips */}
      <div className="mt-4">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h3 className="font-cyber text-sm tracking-[0.4em] text-white flex items-center gap-4">
              <Hexagon size={16} className="text-cyber-magenta animate-spin-slow" />
              ИНТЕРФЕЙС_И_ЯДРО
            </h3>
            <div className="h-[1px] w-full bg-gradient-to-r from-cyber-magenta via-transparent to-transparent mt-2" />
          </div>
          <span className="font-tech text-[8px] text-gray-600 uppercase">MOD_SLOT_TOTAL: 6</span>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-12 justify-items-center">
          <CyberChip 
            icon={RefreshCw} 
            label="КАНАЛЫ" 
            desc="ВЫБОР_ВЕРСИЙ_ПО" 
            status="BETA"
            variant="cyan"
          />
          <CyberChip 
            icon={Database} 
            label="ОЧИСТКА_КЭША" 
            desc="УДАЛЕНИЕ_TMP" 
            status="TEMP"
            variant="magenta"
          />
          <CyberChip 
            icon={Shield} 
            label="DEV_MODE" 
            desc="УРОВЕНЬ_ДОСТУПА_5" 
            status="OFF"
            variant="yellow"
          />
          <CyberChip 
            icon={Cpu} 
            label="ПРОГРАММА" 
            desc="ОПТИМИЗАЦИЯ_ЯДРА" 
            status="MAX"
            variant="cyan"
          />
          <CyberChip 
            icon={Activity} 
            label="ЛОГИ_ЯДРА" 
            desc="МОНИТОРИНГ_ОШИБОК" 
            status="LOG"
            variant="cyan"
          />
        </div>
      </div>

      {/* Interface hint at the bottom */}
      <div className="mt-8 flex items-center gap-4 py-4 px-8 border border-white/5 bg-white/[0.02]">
        <div className="w-1 h-8 bg-cyber-yellow" />
        <p className="font-tech text-[9px] text-gray-500 uppercase tracking-widest italic leading-relaxed">
          Внимание: изменение параметров в DEV_MODE может привести к дестабилизации протокола Decky_Link. 
          Используйте на свой страх и риск.
        </p>
      </div>
    </div>
  );
};
