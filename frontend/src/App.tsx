import React from 'react';
import { SideBar } from './components/SideBar';
import { PluginCard, type Plugin } from './components/PluginCard';
import { ZipUpload } from './components/ZipUpload';
import { SettingsScreen } from './components/SettingsScreen';
import { PluginService } from './services/PluginService';
import { useGamepadNavigation } from './hooks/useGamepadNavigation';
import { AnimatePresence, motion } from 'framer-motion';
import { getTheme } from './themes/themeConfig';

const SCREEN_TITLES: Record<string, string> = {
  plugins: 'Встроенные модули',
  decky: 'Каталог Decky',
  zip: 'Импорт ZIP',
  settings: 'Система',
};

function App() {
  useGamepadNavigation();
  const [activeTab, setActiveTab] = React.useState('plugins');
  const [activeTheme, setActiveTheme] = React.useState('cyberpunk');
  const [plugins, setPlugins] = React.useState<Plugin[]>([]);
  const [loading, setLoading] = React.useState(true);

  const theme = getTheme(activeTheme);
  const isDark = theme.isDark;

  React.useEffect(() => {
    setLoading(true);
    PluginService.getPlugins().then((data) => {
      setPlugins(data);
      setLoading(false);
    });
  }, [activeTab]);

  return (
    <div className={`flex w-full h-screen overflow-hidden ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-slate-900'} theme-${activeTheme}`}>

      {/* Global scanline overlay — cosmetic only */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <div className="w-full h-px bg-current opacity-[0.03] absolute animate-scanline" />
      </div>

      {/* Sidebar */}
      <SideBar activeTab={activeTab} onTabChange={setActiveTab} activeTheme={activeTheme} />

      {/* Main */}
      <main className="flex-1 overflow-y-auto relative flex flex-col cp-grid-bg">

        {/* Theme Artwork — Watermark (Stage 8) */}
        <div
          className="fixed pointer-events-none z-0"
          style={{
            right: theme.artwork.placement === 'right' ? 0 : 'auto',
            left: theme.artwork.placement === 'left' ? 0 : theme.artwork.placement === 'center' ? '29%' : 'auto',
            bottom: 0,
            width: '42%', height: '75%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right bottom',
            backgroundSize: 'contain',
            opacity: theme.artwork.opacity,
            backgroundImage: `url('${theme.artwork.backgroundUrl}')`,
            filter: 'grayscale(1)',
            transform: `scale(${theme.artwork.scale})`,
          }}
        />

        {/* ── Top header bar (Stage 3) ────────────────────── */}
        <header className={`h-14 border-b sticky top-0 z-20 px-10 flex items-center justify-between ${isDark
          ? 'bg-black/90 border-white/5 backdrop-blur-md'
          : 'bg-white/90 border-gray-100 backdrop-blur-md'
          }`}>

          {/* Left: System Cell 1 */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className={`font-cp-mono text-[7px] uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                {theme.headerFlavor.leftLabel}
              </span>
              <div className={`px-2 h-5 border flex items-center font-cp-mono text-[10px] ${isDark ? 'border-white/10 text-white bg-white/5' : 'border-gray-200 text-slate-800 bg-gray-50'}`}>
                {theme.headerFlavor.leftValue}
              </div>
            </div>
          </div>

          {/* Center: Status / Mode */}
          <div className="flex items-center gap-2 font-cp-mono text-[8px] absolute left-1/2 -translate-x-1/2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className={`font-bold ${isDark ? 'text-green-500' : 'text-green-600'}`}>
              {theme.headerFlavor.statusText}
            </span>
          </div>

          {/* Right: System Cell 2 */}
          <div className="flex items-center gap-2">
            <div className={`px-2 h-5 border flex items-center font-cp-mono text-[10px] ${isDark ? 'border-white/10 text-white bg-white/5' : 'border-gray-200 text-slate-800 bg-gray-50'}`}>
              {theme.headerFlavor.rightValue}
            </div>
            <span className={`font-cp-mono text-[7px] uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
              {theme.headerFlavor.rightLabel}
            </span>
          </div>
        </header>

        {/* ── Page content ─────────────────────────────────── */}
        <div className="p-10 relative flex-1">
          {/* Decorative corner frames */}
          {isDark && (
            <>
              <div className="absolute top-16 right-16 w-20 h-20 border-t border-r border-white/5 pointer-events-none" />
              <div className="absolute bottom-16 left-16 w-28 h-28 border-b border-l border-white/5 pointer-events-none" />
            </>
          )}

          <div className="max-w-6xl mx-auto relative z-10">

            {/* Screen title — Stage 1 */}
            <header className="mb-10">
              <h2 className={`text-2xl font-cyber uppercase tracking-[0.3em] ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {SCREEN_TITLES[activeTab] ?? activeTab.toUpperCase()}
              </h2>
              <div className={`h-px w-48 mt-2 ${isDark
                ? 'bg-gradient-to-r from-white/20 to-transparent'
                : 'bg-gradient-to-r from-gray-300 to-transparent'
                }`} />
            </header>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: activeTheme === 'portal' ? 16 : 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={theme.motion}
                className="grid grid-cols-1 xl:grid-cols-2 gap-x-8 gap-y-5"
              >
                {loading ? (
                  <div className={`col-span-full h-72 border flex flex-col items-center justify-center gap-5 ${isDark ? 'border-white/5 bg-black/20' : 'border-gray-100 bg-white shadow-sm'
                    }`}>
                    <div className={`w-12 h-12 border-4 border-t-transparent rounded-full animate-spin ${isDark ? 'border-white/20' : 'border-blue-400'}`} />
                    <span className={`font-cp-mono text-[9px] uppercase tracking-widest animate-pulse ${isDark ? 'text-white/40' : 'text-blue-500'}`}>
                      Загрузка...
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
      <div className={`fixed inset-0 pointer-events-none border-[12px] z-40 ${isDark ? 'border-black/50' : 'border-gray-100/50'}`} />
    </div>
  );
}

export default App;

