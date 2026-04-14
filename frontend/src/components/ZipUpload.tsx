import React from 'react';
import { motion } from 'framer-motion';
import { Upload, FileArchive, AlertCircle } from 'lucide-react';
import { CyberButton } from './CyberButton';

export const ZipUpload: React.FC = () => {
  const [isDragging, setIsDragging] = React.useState(false);

  return (
    <div className="flex flex-col items-center justify-center w-full py-20 px-4">
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        className={`
          w-full max-w-2xl h-80 border-2 border-dashed flex flex-col items-center justify-center gap-6 transition-all duration-500
          ${isDragging ? 'border-cyber-cyan bg-cyber-cyan/10 scale-[1.02] shadow-neon-cyan' : 'border-cyber-cyan/30 bg-cyber-dark/20'}
        `}
        style={{
          clipPath: 'polygon(5% 0%, 100% 0%, 100% 95%, 95% 100%, 0% 100%, 0% 5%)'
        }}
      >
        <div className="relative">
          <FileArchive size={64} className={isDragging ? 'text-cyber-cyan' : 'text-gray-500'} />
          {isDragging && (
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-cyber-magenta p-1 rounded-full text-white"
            >
              <Upload size={16} />
            </motion.div>
          )}
        </div>

        <div className="text-center">
          <p className="font-tech text-lg text-white uppercase tracking-tighter">
            {isDragging ? 'ОТПУСТИТЕ ФАЙЛ ДЛЯ ЗАГРУЗКИ' : 'ПЕРЕТАЩИТЕ ZIP АРХИВ СЮДА'}
          </p>
          <p className="text-gray-500 font-tech text-[10px] mt-2 italic">
            // ПОДДЕРЖИВАЮТСЯ ТОЛЬКО ВАЛИДНЫЕ ПАКЕТЫ .ZIP
          </p>
        </div>

        <CyberButton variant={isDragging ? 'magenta' : 'cyan'}>
          ВЫБРАТЬ ФАЙЛ ВРУЧНУЮ
        </CyberButton>
      </motion.div>

      <div className="mt-12 w-full max-w-2xl bg-cyber-magenta/5 border-l-4 border-cyber-magenta p-4 flex gap-4 items-start">
        <AlertCircle className="text-cyber-magenta flex-shrink-0" />
        <div className="text-xs text-gray-400 font-tech">
          <span className="text-cyber-magenta font-bold">ВНИМАНИЕ:</span> Установка сторонних плагинов из ненадежных источников может привести к нестабильной работе SteamOS. Перед установкой CyberMod проводит автоматическую проверку структуры архива.
        </div>
      </div>
    </div>
  );
};
