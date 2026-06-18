import React from 'react';
import { ShieldCheck, CloudDownload as DownloadCloud, X } from 'lucide-react';
import { SideBar } from './components/SideBar';
import { PluginCard, type Plugin } from './components/PluginCard';
import { ZipUpload } from './components/ZipUpload';
import { SettingsScreen } from './components/SettingsScreen';
import { PluginService } from './services/PluginService';
import { ExtensionService, type Extension } from './services/ExtensionService';
import { ExtensionHost } from './components/ExtensionHost';
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
  const [extensions, setExtensions] = React.useState<Extension[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [deckyStatus, setDeckyStatus] = React.useState('UNKNOWN');
  const [installingDecky, setInstallingDecky] = React.useState(false);
  const [installLogs, setInstallLogs] = React.useState<string[]>([]);
  const [updateInfo, setUpdateInfo] = React.useState<{ hasUpdate: boolean; currentVersion: string; latestVersion: string; releaseUrl: string } | null>(null);
  const [updateDismissed, setUpdateDismissed] = React.useState(false);
  const [updating, setUpdating] = React.useState(false);

  const theme = getTheme(activeTheme);
  const isDark = theme.isDark;
  const activeExtension = extensions.find(e => `ext-${e.id}` === activeTab);

  // Load Initial Config
  React.useEffect(() => {
    PluginService.getConfig().then(cfg => {
      if (cfg?.activeTheme) setActiveTheme(cfg.activeTheme);
    });
    PluginService.getDeckyStatus().then(setDeckyStatus);
    ExtensionService.getExtensions().then(setExtensions);
    PluginService.checkForUpdate().then(info => {
      if (info?.hasUpdate) setUpdateInfo(info);
    });
  }, []);

  const refreshPlugins = React.useCallback(() => {
    setLoading(true);
    const sourceMap: Record<string, string> = {
      plugins: 'builtin',
      decky: 'decky',
      zip: 'zip'
    };
    const source = sourceMap[activeTab] || 'builtin';

    if (activeTab.startsWith('ext-')) {
      setLoading(false);
      return;
    }

    PluginService.getPlugins(source).then((data) => {
      setPlugins(data);
      setLoading(false);
    });
  }, [activeTab]);

  // Persist Theme Change
  const handleThemeChange = (newTheme: string) => {
    setActiveTheme(newTheme);
    PluginService.setConfig({ activeTheme: newTheme });
  };

  // Log Polling
  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (installingDecky) {
      interval = setInterval(async () => {
        const logs = await PluginService.getInstallLogs();
        setInstallLogs(logs);
      }, 1000);
    } else {
      setInstallLogs([]);
    }
    return () => clearInterval(interval);
  }, [installingDecky]);

  React.useEffect(() => {
    refreshPlugins();
  }, [activeTab, refreshPlugins]);

  return (
    <div className={`flex w-full h-screen overflow-hidden ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-slate-900'} theme-${activeTheme}`}>

      {/* Global scanline overlay — cosmetic only */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <div className="w-full h-px bg-current opacity-[0.03] absolute animate-scanline" />
      </div>

      {/* Sidebar */}
      <SideBar activeTab={activeTab} onTabChange={setActiveTab} activeTheme={activeTheme} extensions={extensions} />

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
                {activeExtension ? activeExtension.title : (SCREEN_TITLES[activeTab] ?? activeTab.toUpperCase())}
              </h2>
              <div className={`h-px w-48 mt-2 ${isDark
                ? 'bg-gradient-to-r from-white/20 to-transparent'
                : 'bg-gradient-to-r from-gray-300 to-transparent'
                }`} />
            </header>

            {/* Tab content */}
            <AnimatePresence>
              {updateInfo && !updateDismissed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`col-span-full mb-4 p-4 border flex items-center justify-between transition-all ${isDark ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-yellow-300 bg-yellow-50'}`}
                >
                  <div className="flex items-center gap-4">
                    <DownloadCloud size={20} className={isDark ? 'text-yellow-400' : 'text-yellow-600'} />
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Доступно обновление: {updateInfo.latestVersion}
                      </span>
                      <span className={`text-[8px] font-cp-mono ml-3 ${isDark ? 'text-white/30' : 'text-gray-500'}`}>
                        (текущая: {updateInfo.currentVersion})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      disabled={updating}
                      onClick={async () => {
                        setUpdating(true);
                        const ok = await PluginService.applyUpdate();
                        setUpdating(false);
                        if (ok) setUpdateInfo(null);
                      }}
                      className={`px-5 py-2 text-[9px] font-bold uppercase tracking-[0.2em] border transition-all ${updating
                        ? 'opacity-50 cursor-wait'
                        : isDark ? 'border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black' : 'border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white'
                        }`}
                    >
                      {updating ? 'Обновление...' : 'Обновить'}
                    </button>
                    <button onClick={() => setUpdateDismissed(true)} className={`p-1 ${isDark ? 'text-white/30 hover:text-white' : 'text-gray-400 hover:text-slate-800'}`}>
                      <X size={14} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: activeTheme === 'portal' ? 16 : 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={theme.motion}
                className="grid grid-cols-1 xl:grid-cols-2 gap-x-8 gap-y-5"
              >
                {activeTab === 'decky' && (
                  <div className={`col-span-full mb-6 p-6 border flex items-center justify-between transition-all ${isDark ? 'border-blue-500/30 bg-blue-500/5' : 'border-blue-200 bg-blue-50'
                    }`}>
                    <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 flex items-center justify-center border-2 ${isDark ? 'border-blue-500/40 text-blue-400' : 'border-blue-400 text-blue-600'}`}>
                        <ShieldCheck size={24} />
                      </div>
                      <div>
                        <h4 className={`text-xs font-bold uppercase tracking-widest mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>Decky Loader</h4>
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${deckyStatus === 'INSTALLED' ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
                          <span className={`text-[10px] font-cp-mono uppercase tracking-widest ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
                            Статус: {deckyStatus === 'INSTALLED' ? 'Установлен' : 'Не установлен'}
                          </span>
                        </div>
                      </div>
                    </div>
                    {deckyStatus !== 'INSTALLED' && (
                      <button
                        onClick={() => {
                          setInstallingDecky(true);
                          PluginService.installDeckyLoader().then(success => {
                            setInstallingDecky(false);
                            if (success) PluginService.getDeckyStatus().then(setDeckyStatus);
                          });
                        }}
                        className={`px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] border transition-all ${isDark ? 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white' : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                          }`}
                      >
                        Установить Decky Loader
                      </button>
                    )}
                  </div>
                )}

                {/* Installation Overlay */}
                <AnimatePresence>
                  {installingDecky && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-10"
                    >
                      <div className={`max-w-2xl w-full p-8 border flex flex-col ${isDark ? 'bg-black border-white/20' : 'bg-white border-gray-200 shadow-2xl'}`}>
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                          <h3 className="text-lg font-cyber uppercase tracking-widest">Установка Decky Loader</h3>
                        </div>

                        <div className={`flex-1 min-h-[300px] max-h-[400px] overflow-y-auto mb-6 p-4 font-cp-mono text-[9px] leading-relaxed border ${isDark ? 'bg-white/5 border-white/10 text-blue-400' : 'bg-gray-50 border-gray-200 text-blue-600'}`}>
                          {installLogs.map((log, i) => (
                            <div key={i} className="mb-1">
                              <span className="opacity-30 mr-2">[{i.toString().padStart(3, '0')}]</span>
                              {log}
                            </div>
                          ))}
                          <div className="animate-pulse">_</div>
                        </div>

                        <div className="w-full h-1 bg-white/10 relative overflow-hidden mb-6">
                          <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="absolute inset-0 bg-blue-500"
                          />
                        </div>

                        <p className="font-cp-mono text-[8px] uppercase tracking-widest opacity-40">
                          Скрипт выполняется в фоновом режиме. Пожалуйста, дождитесь завершения.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

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
                    <SettingsScreen activeTheme={activeTheme} onThemeChange={handleThemeChange} />
                  </div>
                ) : activeExtension ? (
                  <div className="col-span-full h-[600px]">
                    <ExtensionHost frontendUrl={activeExtension.frontendUrl || ''} />
                  </div>
                ) : (
                  plugins.map(plugin => (
                    <PluginCard key={plugin.id} plugin={plugin} activeTheme={activeTheme} deckyStatus={deckyStatus} onAction={refreshPlugins} />
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

