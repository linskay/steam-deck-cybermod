import React from 'react';
import { SideBar } from './components/SideBar';
import { PluginCard, type Plugin } from './components/PluginCard';
import { ZipUpload } from './components/ZipUpload';
import { SettingsScreen } from './components/SettingsScreen';
import { PluginService } from './services/PluginService';
import { useGamepadNavigation } from './hooks/useGamepadNavigation';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  useGamepadNavigation();
  const [activeTab, setActiveTab] = React.useState('plugins');
  const [plugins, setPlugins] = React.useState<Plugin[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadPlugins = async () => {
      setLoading(true);
      const data = await PluginService.getPlugins();
      setPlugins(data);
      setLoading(false);
    };
    loadPlugins();
  }, [activeTab]);

  return (
    <div className="flex w-full h-screen bg-cyber-black text-white overflow-hidden selection:bg-cyber-magenta selection:text-white">
      {/* Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <div className="w-full h-1 bg-cyber-cyan/5 absolute animate-scanline" />
      </div>

      {/* Sidebar */}
      <SideBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative flex flex-col">
        {/* Top Header Bar (Cyberpunk Dashboard Style) */}
        <header className="h-20 border-b border-cyber-magenta/20 bg-cyber-black/80 backdrop-blur-md sticky top-0 z-20 px-12 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3">
              <span className="font-tech text-[10px] text-cyber-cyan">УРОВЕНЬ_МОДА</span>
              <div className="w-10 h-6 border border-cyber-cyan flex items-center justify-center font-cyber text-xs text-cyber-cyan bg-cyber-cyan/10">15</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-tech text-[10px] text-cyber-magenta">РЕПУТАЦИЯ_ДЕКИ</span>
              <div className="w-10 h-6 border border-cyber-magenta flex items-center justify-center font-cyber text-xs text-cyber-magenta bg-cyber-magenta/10">23</div>
            </div>
          </div>

          <div className="flex items-center gap-6 font-tech text-[10px] tracking-widest text-gray-500">
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              SYSTEM_LIVE
            </span>
            <span>DATA_LINK: ESTABLISHED</span>
            <span className="text-cyber-yellow uppercase tracking-widest">v1.0.0_STABLE</span>
          </div>
        </header>

        <div className="p-12 relative flex-1">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyber-magenta/5 blur-[150px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyber-cyan/5 blur-[120px] pointer-events-none" />

          {/* Content Container */}
          <div className="max-w-7xl mx-auto">
            <header className="mb-10">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-6 h-6 border-2 border-cyber-magenta flex items-center justify-center font-cyber text-xs text-cyber-magenta">!</div>
                <h2 className="text-2xl font-cyber uppercase tracking-[0.3em] text-white">
                  {activeTab === 'plugins' ? 'ПЛАГИНЫ_DECK_CUSTOM' : 
                   activeTab === 'decky' ? 'КАТАЛОГ_DECKY_REPO' :
                   activeTab === 'zip' ? 'ИМПОРТ_АРХИВА_LOCAL' :
                   activeTab === 'installed' ? 'ТЕКУЩИЕ_МОДЫ_ACTIVE' : 'КОНФИГУРАЦИЯ_SYSTEM'}
                </h2>
              </div>
              <div className="h-[2px] w-48 bg-cyber-magenta shadow-neon-magenta" />
            </header>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 xl:grid-cols-2 gap-x-8 gap-y-4"
              >
                {loading ? (
                  <div className="col-span-full h-64 border border-cyber-magenta/10 bg-cyber-dark/40 flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 border-2 border-cyber-magenta border-t-transparent animate-spin rounded-full" />
                    <span className="text-cyber-magenta font-tech uppercase text-[10px] animate-pulse">Инициализация потока данных...</span>
                  </div>
                ) : activeTab === 'zip' ? (
                  <div className="col-span-full">
                     <ZipUpload />
                  </div>
                ) : activeTab === 'settings' ? (
                  <div className="col-span-full">
                     <SettingsScreen />
                  </div>
                ) : (
                  plugins.map(plugin => (
                    <PluginCard key={plugin.id} plugin={plugin} />
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Global Interface Overlay Tiles */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none border-[20px] border-cyber-black/20 z-40" />
    </div>
  );
}

export default App;
