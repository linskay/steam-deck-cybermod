import React from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, Package } from 'lucide-react';
import { getTheme } from '../themes/themeConfig';
import { PluginService } from '../services/PluginService';

export const ZipUpload: React.FC<{ activeTheme?: string }> = ({ activeTheme = 'cyberpunk' }) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [status, setStatus] = React.useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const theme = getTheme(activeTheme);
  const isDark = theme.isDark;

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file || !file.name.endsWith('.zip')) {
      setStatus('error');
      return;
    }

    setStatus('uploading');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(PluginService.getApiBase() + '/plugins/zip/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error('Upload failed', err);
      setStatus('error');
    }
  };

  return (
    <div className={`cp-card p-10 flex flex-col items-center justify-center min-h-[460px] border relative overflow-hidden transition-all duration-500 ${isDark ? 'bg-white/2 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>

      {/* ── Background decoration ─────────────────────────── */}
      <div className={`absolute top-0 right-0 p-8 opacity-[0.03] ${isDark ? 'text-white' : 'text-black'}`}>
        <FileText size={280} />
      </div>

      <div className="relative z-10 w-full max-w-xl flex flex-col items-center text-center">
        {/* ── Header Icon ──────────────────────────────────── */}
        <div className={`w-20 h-20 rounded-full border-2 flex items-center justify-center mb-8 transition-colors ${status === 'success' ? 'border-green-500 text-green-500' : isDark ? 'border-white/10 text-white/20' : 'border-gray-200 text-gray-300'}`}>
          {status === 'success' ? <CheckCircle size={40} /> : <Upload size={40} />}
        </div>

        <h3 className={`text-2xl font-cyber uppercase tracking-[0.2em] mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
          {status === 'success' ? 'Пакет загружен' : 'Импорт плагина'}
        </h3>

        <p className={`text-[10px] font-cp-mono uppercase tracking-[0.2em] mb-12 ${isDark ? 'text-white/30' : 'text-gray-500'}`}>
          {status === 'success' ? 'Модуль готов к установке' : 'Перетащите .zip архив во фрейм терминала'}
        </p>

        {/* ── Action Dropzone ───────────────────────────────── */}
        {status === 'idle' && (
          <motion.div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            animate={{ scale: isDragging ? 1.02 : 1 }}
            className={`w-full h-56 border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${isDragging ? 'border-white/40 bg-white/5' : isDark ? 'border-white/5 hover:border-white/10' : 'border-gray-100 hover:border-gray-200'}`}
          >
            <span className={`text-[9px] font-cp-mono uppercase tracking-[0.3em] font-bold ${isDark ? 'text-white/10' : 'text-gray-300'}`}>
              {isDragging ? 'ОТПУСТИТЕ ДЛЯ ИМПОРТА' : 'ПЕРЕТАЩИТЕ ZIP СЮДА'}
            </span>
          </motion.div>
        )}

        {status === 'uploading' && (
          <div className="w-full space-y-6">
            <div className={`h-1 w-full relative overflow-hidden ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-white/40"
              />
            </div>
            <span className={`text-[8px] font-cp-mono uppercase tracking-[0.2em] animate-pulse ${isDark ? 'text-white/30' : 'text-gray-500'}`}>
              Обработка архива...
            </span>
          </div>
        )}

        {/* ── Controls ─────────────────────────────────────── */}
        <div className="mt-12 flex gap-4">
          <button
            disabled={status === 'uploading'}
            onClick={() => setStatus('idle')}
            className={`px-12 py-3 text-[10px] uppercase font-bold tracking-widest border transition-all ${status === 'success'
              ? 'bg-white text-black border-white hover:bg-white/90'
              : isDark ? 'border-white/20 text-white bg-white/5 hover:bg-white/10' : 'border-gray-200 text-slate-800 bg-gray-50 hover:bg-gray-100'
              }`}
          >
            {status === 'success' ? 'Завершить' : 'Обзор файлов'}
          </button>
        </div>
      </div>

      {/* ── Bottom Strip (Stage 6) ───────────────────────── */}
      <div className={`absolute bottom-0 left-0 right-0 p-8 border-t font-cp-mono text-[7px] flex justify-between uppercase tracking-[0.2em] ${isDark ? 'border-white/5 text-white/10' : 'border-gray-50 text-gray-400'}`}>
        <div className="flex gap-10">
          <span>{status === 'success' ? 'CHECKSUM_OK' : theme.zipFlavor.l1}</span>
          <span>{status === 'success' ? 'PACKAGE_VERIFIED' : theme.zipFlavor.l2}</span>
        </div>
        <div className="flex items-center gap-2">
          {status === 'success' ? <Package size={10} /> : <AlertTriangle size={10} />}
          <span>{status === 'success' ? 'LINK_READY' : theme.zipFlavor.r1}</span>
        </div>
      </div>
    </div>
  );
};

