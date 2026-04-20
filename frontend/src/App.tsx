import React from 'react';
import { SideBar } from './components/SideBar';
import { PluginCard, type Plugin } from './components/PluginCard';
import { ZipUpload } from './components/ZipUpload';
import { SettingsScreen } from './components/SettingsScreen';
import { PluginService } from './services/PluginService';
import { useGamepadNavigation } from './hooks/useGamepadNavigation';
import { AnimatePresence, motion } from 'framer-motion';
import { getTheme } from './themes/themeConfig';

// Screen title map — fixed, translatable, no theme-dependency
const SCREEN_TITLES: Record<string, string> = {
  plugins: 'Встроенные модули',
  decky: 'Каталог Decky',
  zip: 'Импорт архива',
  settings: 'Настройки системы',
};

// Motion profiles per theme (Layer B)
const MOTION_PROFILES: Record<string, { duration: number; ease: string | number[] }> = {
  cyberpunk: { duration: 0.18, ease: 'easeOut' },
  stalker: { duration: 0.15, ease: [0.2, 0.8, 0.6, 1] },
  doom: { duration: 0.06, ease: 'linear' },
  portal: { duration: 0.70, ease: [0.4, 0, 0.2, 1] },
  deadspace: { duration: 0.40, ease: [0.2, 0.8, 0.2, 1] },
};

function App() {
  useGamepadNavigation();
  const [activeTab, setActiveTab] = React.useState('plugins');
  const [activeTheme, setActiveTheme] = React.useState('cyberpunk');
  const [plugins, setPlugins] = React.useState<Plugin[]>([]);
  const [loading, setLoading] = React.useState(true);

  const theme = getTheme(activeTheme);
  const motion_prof = MOTION_PROFILES[activeTheme] ?? MOTION_PROFILES.cyberpunk;
  const isDark = activeTheme !== 'portal';

  React.useEffect(() => {
    setLoading(true);
    PluginService.getPlugins().then((data) => {
      setPlugins(data);
      setLoading(false);
    });
  }, [activeTab]);

  return (
    <div className={`flex w-full h-screen overflow-hidden ${isDark ? 'bg-cyber-black text-white' : 'bg-gray-50 text-slate-900'} theme-${activeTheme}`}>

      {/* Global scanline overlay — cosmetic only */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <div className="w-full h-px bg-cp-cyan/5 absolute animate-scanline" />
      </div>

      {/* Sidebar */}
      <SideBar activeTab={activeTab} onTabChange={setActiveTab} activeTheme={activeTheme} />

      {/* Main */}
      <main className="flex-1 overflow-y-auto relative flex flex-col cp-grid-bg">

        {/* Theme Artwork — watermark, Layer C */}
        <div
          className="fixed pointer-events-none z-0"
          style={{
            right: 0, bottom: 0,
            width: '42%', height: '75%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right bottom',
            backgroundSize: 'contain',
            opacity: 0.06,
            backgroundImage: `url('${theme.artworkUrl}')`,
            filter: 'grayscale(1)',
          }}
        />

        {/* ── Top header bar ──────────────────────────────── */}
        <header className={`h-14 border-b sticky top-0 z-20 px-10 flex items-center justify-between ${isDark
            ? 'bg-cp-black/90 border-white/5 backdrop-blur-md'
            : 'bg-white/90 border-gray-100 backdrop-blur-md'
          }`}>
          {/* Left: two flavor data-cells from themeConfig */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <span className={`font-cp-mono text-[7px] uppercase tracking-widest ${isDark ? 'text-cp-cyan/50' : 'text-blue-400/70'}`}>
                {theme.headerFlavor.leftLabel}
              </span>
              <div className={`px-2 h-5 border flex items-center font-cp-mono text-[10px] ${isDark ? 'border-cp-cyan/20 text-cp-cyan bg-cp-cyan/5' : 'border-blue-200 text-blue-500 bg-blue-50'}`}>
                {theme.headerFlavor.leftValue}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-cp-mono text-[7px] uppercase tracking-widest ${isDark ? 'text-cp-yellow/50' : 'text-orange-400/70'}`}>
                {theme.headerFlavor.rightLabel}
              </span>
              <div className={`px-2 h-5 border flex items-center font-cp-mono text-[10px] ${isDark ? 'border-cp-yellow/20 text-cp-yellow bg-cp-yellow/5' : 'border-orange-200 text-orange-500 bg-orange-50'}`}>
                {theme.headerFlavor.rightValue}
              </div>
            </div>
          </div>

          {/* Right: status from themeConfig */}
          <div className="flex items-center gap-2 font-cp-mono text-[8px]">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className={`font-bold ${isDark ? 'text-green-500' : 'text-green-600'}`}>
              {theme.headerFlavor.statusText}
            </span>
            <span className={`hidden lg:block ml-6 ${isDark ? 'text-gray-600' : 'text-gray-400'} uppercase tracking-widest`}>
              PING: 24MS
            </span>
          </div>
        </header>

        {/* ── Page content ─────────────────────────────────── */}
        <div className="p-10 relative flex-1">
          {/* Decorative corner frames */}
          {isDark && (
            <>
              <div className="absolute top-16 right-16 w-20 h-20 border-t border-r border-cp-yellow/10 pointer-events-none" />
              <div className="absolute bottom-16 left-16 w-28 h-28 border-b border-l border-cp-cyan/10 pointer-events-none" />
            </>
          )}

          <div className="max-w-6xl mx-auto relative z-10">

            {/* Screen title — fixed label, no flavor */}
            <header className="mb-10">
              <h2 className={`text-2xl font-cyber uppercase tracking-[0.3em] ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {SCREEN_TITLES[activeTab] ?? activeTab.toUpperCase()}
              </h2>
              <div className={`h-px w-48 mt-2 ${isDark
                  ? 'bg-gradient-to-r from-cp-yellow/60 to-transparent'
                  : 'bg-gradient-to-r from-blue-300/60 to-transparent'
                }`} />
            </header>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: activeTheme === 'portal' ? 16 : 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={motion_prof}
                className="grid grid-cols-1 xl:grid-cols-2 gap-x-8 gap-y-5"
              >
                {loading ? (
                  <div className={`col-span-full h-72 border flex flex-col items-center justify-center gap-5 ${isDark ? 'border-white/5 bg-cp-black/20' : 'border-gray-100 bg-white rounded-2xl shadow-sm'
                    }`}>
                    <div className={`w-12 h-12 border-4 border-t-transparent rounded-full animate-spin ${isDark ? 'border-cp-yellow' : 'border-blue-400'}`} />
                    <span className={`font-cp-mono text-[9px] uppercase tracking-widest animate-pulse ${isDark ? 'text-cp-yellow' : 'text-blue-500'}`}>
                      Загрузка данных...
                    </span>
                  </div>
                ) : activeTab === 'zip' ? (
                  <div className="col-span-full"><ZipUpload /></div>
                ) : activeTab === 'settings' ? (
                  <div className="col-span-full">
                    <SettingsScreen activeTheme={activeTheme} onThemeChange={setActiveTheme} />
                  </div>
                ) : (
                  plugins.map(plugin => (
                    <PluginCard key={plugin.id} plugin={plugin} activeTheme={activeTheme} />
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Frame overlay */}
      <div className={`fixed inset-0 pointer-events-none border-[12px] z-40 ${isDark ? 'border-cp-black/50' : 'border-gray-50/50'}`} />
    </div>
  );
}

export default App;
