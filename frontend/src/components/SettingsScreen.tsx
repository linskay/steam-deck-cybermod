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

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex flex-col items-center group cursor-pointer"
    >
      <div className={`cyber-chip-slot ${variant === 'magenta' ? 'red' : ''} ${colorClass} flex items-center justify-center relative mb-4`}>
        <div className="chip-tab" />
        <div className="absolute top-2 right-2 font-tech text-[8px] opacity-70 group-hover:opacity-100 flex flex-col items-end">
          <span className="leading-none">{status}</span>
          <Hexagon size={6} className="mt-1" />
        </div>
        <Icon size={32} className="opacity-60 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110" />
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

interface SettingsScreenProps {
  activeTheme?: string;
  onThemeChange?: (theme: string) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ activeTheme = 'cyberpunk', onThemeChange }) => {
  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      {/* Interface & Themes Section */}
      <div className="mt-4">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h3 className="font-cyber text-sm tracking-[0.4em] text-white flex items-center gap-4">
              <RefreshCw size={16} className="text-cp-yellow animate-spin-slow" />
              КОНФИГУРАЦИЯ_ОБОЛОЧКИ
            </h3>
            <div className="h-[1px] w-full bg-gradient-to-r from-cp-yellow via-transparent to-transparent mt-2" />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cyberpunk Theme Option */}
          <div className={`p-6 border ${activeTheme === 'cyberpunk' ? 'border-cp-yellow bg-cp-yellow/5' : 'border-white/5 bg-white/[0.02]'} flex flex-col gap-4 relative group`}>
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-cyber text-lg text-white">CYBERPUNK 2077</h4>
                <p className="font-cp-mono text-[8px] text-cp-cyan mt-1 uppercase tracking-widest">Протокол: ХАОС / НЕОН</p>
              </div>
              {activeTheme === 'cyberpunk' && <div className="px-2 py-1 bg-cp-yellow text-black font-cp-mono text-[8px] font-bold">АКТИВНО</div>}
            </div>
            <div className="flex gap-4 mt-2">
              <button
                onClick={() => onThemeChange?.('cyberpunk')}
                className="flex-1 h-10 bg-cp-cyan/10 border border-cp-cyan/30 hover:bg-cp-cyan/20 text-cp-cyan font-cp-mono text-[10px] uppercase tracking-widest transition-all"
              >
                Применить
              </button>
            </div>
          </div>

          {/* Stalker Theme Option */}
          <div className={`p-6 border ${activeTheme === 'stalker' ? 'border-cp-yellow bg-cp-yellow/5' : 'border-white/5 bg-white/[0.02]'} flex flex-col gap-4 relative group`}>
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-cyber text-lg text-white">S.T.A.L.K.E.R.</h4>
                <p className="font-cp-mono text-[8px] text-green-500 mt-1 uppercase tracking-widest">Протокол: ЗОНА / ПДА</p>
              </div>
              {activeTheme === 'stalker' && <div className="px-2 py-1 bg-cp-yellow text-black font-cp-mono text-[8px] font-bold">АКТИВНО</div>}
            </div>
            <div className="flex gap-4 mt-2">
              <button
                onClick={() => onThemeChange?.('stalker')}
                className="flex-1 h-10 bg-green-500/10 border border-green-500/30 hover:bg-green-500/20 text-green-500 font-cp-mono text-[10px] uppercase tracking-widest transition-all"
              >
                Применить
              </button>
            </div>
          </div>
        </div>
      </div>

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
              ИНСТРУМЕНТЫ_ЯДРА
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
            label="ЛОГИ"
            desc="МОНИТОРИНГ"
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
