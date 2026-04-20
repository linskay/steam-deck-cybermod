import React from 'react';
import { Shield, Database, RefreshCw, Cpu, Activity, AlertTriangle, ChevronRight } from 'lucide-react';
import { THEMES, getTheme, type ThemeId } from '../themes/themeConfig';

// ─── Theme preview card ───────────────────────────────────────────────────────
interface ThemeCardProps {
  themeId: ThemeId;
  isActive: boolean;
  onApply: () => void;
}

const THEME_ACCENT: Record<string, string> = {
  cyberpunk: 'border-yellow-400/60 bg-yellow-400/5',
  stalker: 'border-green-600/60 bg-green-600/5',
  doom: 'border-red-600/60 bg-red-600/5',
  portal: 'border-blue-400/60 bg-blue-400/5',
  deadspace: 'border-cyan-400/60 bg-cyan-400/5',
};
const THEME_IDLE = 'border-white/8 bg-white/2';

const THEME_BULLETS: Record<string, string[]> = {
  cyberpunk: ['Неоновый интерфейс Night City', 'Острые углы, холодный неон', 'Glitch-анимации'],
  stalker: ['Военный ПДА Зоны отчуждения', 'Зернистость, помехи, износ', 'Мерцание сигнала'],
  doom: ['Боевой HUD солдата', 'Высокий контраст, красный акцент', 'Snap-анимации'],
  portal: ['Aperture Science лаборатория', 'Стерильная белая чистота', 'Плавные переходы'],
  deadspace: ['Голограмма RIG костюма', 'Холодный синий, левитирующий UI', 'Fade-in hologram'],
};

const ThemeCard: React.FC<ThemeCardProps> = ({ themeId, isActive, onApply }) => {
  const cfg = THEMES[themeId];
  const bullets = THEME_BULLETS[themeId] ?? [];

  return (
    <div className={`p-5 border transition-all duration-300 flex flex-col gap-4 relative ${isActive ? THEME_ACCENT[themeId] : THEME_IDLE
      }`}>
      {isActive && (
        <div className="absolute top-3 right-3 px-2 py-0.5 bg-cp-yellow text-black font-cp-mono text-[7px] font-bold uppercase tracking-widest">
          АКТИВНА
        </div>
      )}

      <div>
        <h4 className="text-[13px] font-cyber text-white tracking-wider">{cfg.label}</h4>
        <p className="text-[9px] font-cp-mono text-gray-500 mt-0.5 uppercase tracking-widest">{cfg.description}</p>
      </div>

      <ul className="space-y-1">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2 text-[9px] text-gray-400">
            <ChevronRight size={8} className="mt-0.5 flex-shrink-0 text-gray-600" />
            {b}
          </li>
        ))}
      </ul>

      <button
        onClick={onApply}
        disabled={isActive}
        className={`mt-auto h-9 font-cp-mono text-[9px] uppercase tracking-widest border transition-all ${isActive
            ? 'border-white/10 text-white/20 cursor-default'
            : 'border-white/20 text-white hover:bg-white/5 active:scale-[0.98]'
          }`}
      >
        {isActive ? 'Применена' : 'Применить'}
      </button>
    </div>
  );
};

// ─── Diagnostic row ───────────────────────────────────────────────────────────
const DiagRow: React.FC<{ label: string; value: string; status?: 'ok' | 'warn' | 'off' }> = ({ label, value, status = 'ok' }) => (
  <div className="flex items-center justify-between py-2 border-b border-white/5 text-[9px] font-cp-mono">
    <span className="text-gray-500 uppercase">{label}</span>
    <span className={
      status === 'ok' ? 'text-green-500 bg-green-500/10 px-2' :
        status === 'warn' ? 'text-yellow-500 bg-yellow-500/10 px-2' :
          'text-gray-600'
    }>{value}</span>
  </div>
);

// ─── Tool button ──────────────────────────────────────────────────────────────
const ToolBtn: React.FC<{ icon: React.ElementType; label: string; sub: string }> = ({ icon: Icon, label, sub }) => (
  <button className="flex flex-col items-center gap-2 group p-4 border border-white/5 bg-white/2 hover:bg-white/5 hover:border-white/15 transition-all">
    <div className="p-3 border border-white/10 text-gray-500 group-hover:text-white group-hover:border-white/30 transition-all">
      <Icon size={20} />
    </div>
    <div className="text-center">
      <div className="font-cp-mono text-[9px] text-white uppercase tracking-widest">{label}</div>
      <div className="font-cp-mono text-[7px] text-gray-600 mt-0.5">{sub}</div>
    </div>
  </button>
);

// ─── Main settings screen ─────────────────────────────────────────────────────
interface SettingsScreenProps {
  activeTheme?: string;
  onThemeChange?: (theme: string) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ activeTheme = 'cyberpunk', onThemeChange }) => {
  const theme = getTheme(activeTheme);

  return (
    <div className="flex flex-col gap-10 max-w-5xl">

      {/* ── I. Theme Gallery ──────────────────────────────── */}
      <section>
        <header className="mb-6">
          <h3 className="font-cyber text-[11px] tracking-[0.4em] text-white flex items-center gap-3 uppercase">
            <RefreshCw size={14} className="text-cp-yellow animate-spin-slow" />
            Оболочка интерфейса
          </h3>
          <div className="h-px w-full bg-gradient-to-r from-cp-yellow/40 via-transparent to-transparent mt-2" />
          <p className="text-[9px] font-cp-mono text-gray-600 mt-2 uppercase tracking-wider">
            Активная тема: <span className="text-cp-yellow">{theme.label}</span> · {theme.badge}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {(Object.keys(THEMES) as ThemeId[]).map((id) => (
            <ThemeCard
              key={id}
              themeId={id}
              isActive={activeTheme === id}
              onApply={() => onThemeChange?.(id)}
            />
          ))}
        </div>
      </section>

      {/* ── II. Diagnostics ───────────────────────────────── */}
      <section>
        <header className="mb-4">
          <h3 className="font-cyber text-[11px] tracking-[0.4em] text-white flex items-center gap-3 uppercase">
            <Activity size={14} className="text-cp-cyan" />
            Диагностика системы
          </h3>
          <div className="h-px w-full bg-gradient-to-r from-cp-cyan/40 via-transparent to-transparent mt-2" />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 border border-white/8 bg-white/2">
            <div className="text-[9px] font-cp-mono text-gray-500 uppercase tracking-widest mb-3">Decky / Плагины</div>
            <DiagRow label="Decky Loader" value="RUNNING" status="ok" />
            <DiagRow label="Память плагинов" value="1 225 MB / 50 000 MB" status="ok" />
            <DiagRow label="Активных тем" value="5" status="ok" />
          </div>
          <div className="p-5 border border-white/8 bg-white/2">
            <div className="text-[9px] font-cp-mono text-gray-500 uppercase tracking-widest mb-3">Среда выполнения</div>
            <DiagRow label="Java VM" value="v21.0.1 GraalVM" status="ok" />
            <DiagRow label="Uptime сессии" value="04:20:15" status="ok" />
            <DiagRow label="Build" value="v1.2.0-stable" status="ok" />
          </div>
        </div>
      </section>

      {/* ── III. Tools ────────────────────────────────────── */}
      <section>
        <header className="mb-4">
          <h3 className="font-cyber text-[11px] tracking-[0.4em] text-white flex items-center gap-3 uppercase">
            <Cpu size={14} className="text-cp-yellow" />
            Инструменты
          </h3>
          <div className="h-px w-full bg-gradient-to-r from-cp-yellow/40 via-transparent to-transparent mt-2" />
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <ToolBtn icon={RefreshCw} label="Каналы" sub="ВЕРСИИ ПО" />
          <ToolBtn icon={Database} label="Кэш" sub="ОЧИСТИТЬ" />
          <ToolBtn icon={Shield} label="Dev Mode" sub="УРОВЕНЬ 5" />
          <ToolBtn icon={Cpu} label="Оптим." sub="ЯДРО" />
          <ToolBtn icon={Activity} label="Логи" sub="МОНИТОР" />
        </div>
      </section>

      {/* ── IV. Risk notice ──────────────────────────────── */}
      <div className="flex items-start gap-4 py-4 px-5 border border-yellow-600/20 bg-yellow-600/5">
        <AlertTriangle size={14} className="text-yellow-600 mt-0.5 flex-shrink-0" />
        <p className="font-cp-mono text-[8px] text-gray-500 uppercase tracking-wider leading-relaxed">
          Изменение Dev Mode и параметров ядра может дестабилизировать Decky Loader.
          Используйте только если знаете, что делаете.
        </p>
      </div>
    </div>
  );
};
