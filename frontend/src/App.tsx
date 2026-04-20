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
  const [activeTheme, setActiveTheme] = React.useState('cyberpunk');
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
    <div className={`flex w-full h-screen bg-cyber-black text-white overflow-hidden theme-${activeTheme} selection:bg-cp-yellow selection:text-black`}>
      {/* Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <div className="w-full h-1 bg-cp-cyan/5 absolute animate-scanline" />
      </div>

      {/* Sidebar */}
      <SideBar activeTab={activeTab} onTabChange={setActiveTab} activeTheme={activeTheme} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative flex flex-col cp-grid-bg">
        <div className="cp-circuit-lines opacity-20" />

        {/* Top Header Bar (Cyberpunk Dashboard Style) */}
        <header className="h-16 border-b border-white/5 bg-cp-black/90 backdrop-blur-md sticky top-0 z-20 px-12 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3">
              <span className="font-cp-mono text-[8px] text-cp-cyan/60 uppercase tracking-widest">
                {activeTheme === 'stalker' ? 'КАНАЛ_СВЯЗИ' : 'MOD_LAYER_ID'}
              </span>
              <div className="w-10 h-5 border border-cp-cyan/30 flex items-center justify-center font-cp-mono text-[10px] text-cp-cyan bg-cp-cyan/5">15</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-cp-mono text-[8px] text-cp-yellow/60 uppercase tracking-widest">
                {activeTheme === 'stalker' ? 'ИНДЕКС_ЗОНЫ' : 'DECK_REP_INDEX'}
              </span>
              <div className="w-10 h-5 border border-cp-yellow/30 flex items-center justify-center font-cp-mono text-[10px] text-cp-yellow bg-cp-yellow/5">23</div>
            </div>
          </div>

          <div className="flex items-center gap-8 font-cp-mono text-[8px] tracking-[0.2em] text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500/50 rounded-full animate-pulse" />
              <span className="text-green-500/60">
                {activeTheme === 'stalker' ? 'СИГНАЛ: ЕСТЬ' : 'SYS_LINK: ACTIVE'}
              </span>
            </div>
            <div className="hidden lg:flex items-center gap-4 border-l border-white/5 pl-8">
              <span>PING: 24MS</span>
              <span className="text-cp-yellow/40">BUFFER: [####------]</span>
              <span className="text-cp-cyan/40">
                {activeTheme === 'stalker' ? 'ПДА_v.2.1' : 'v1.2.0_STABLE'}
              </span>
            </div>
          </div>
        </header>

        <div className="p-12 relative flex-1">
          {/* Background Decorative Elements - Cinematic Noise */}
          <div className="absolute top-20 right-20 w-32 h-32 border-t border-r border-cp-yellow/10 pointer-events-none" />
          <div className="absolute bottom-20 left-20 w-48 h-48 border-b border-l border-cp-cyan/10 pointer-events-none" />

          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cp-yellow/5 blur-[180px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cp-cyan/5 blur-[150px] pointer-events-none" />

          {/* Content Container */}
          <div className="max-w-7xl mx-auto relative z-10">
            <header className="mb-12">
              <div className="flex items-center gap-6 mb-3">
                <div className="w-8 h-8 border border-cp-yellow flex items-center justify-center font-cp-mono text-sm text-cp-yellow bg-cp-yellow/5">!</div>
                <h2 className="text-3xl font-cyber uppercase tracking-[0.4em] text-white">
                  {activeTab === 'plugins' ? (activeTheme === 'stalker' ? 'СПИСОК_ЗАДАНИЙ' : 'ВСТРОЕННЫЕ_МОДУЛИ') :
                    activeTab === 'decky' ? (activeTheme === 'stalker' ? 'СЕТЬ_ТОРГОВЦЕВ' : 'КАТАЛОГ_DECKY_REPO') :
                      activeTab === 'zip' ? (activeTheme === 'stalker' ? 'ЗАГРУЗКА_ШИФРА' : 'ИМПОРТ_АРХИВА_LOCAL') :
                        activeTab === 'settings' ? (activeTheme === 'stalker' ? 'НАСТРОЙКИ_ПДА' : 'КОНФИГУРАЦИЯ_SYSTEM') : 'АРХИВ_МОДОВ'}
                </h2>
              </div>
              <div className="h-[1px] w-64 bg-gradient-to-r from-cp-yellow to-transparent" />
            </header>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 xl:grid-cols-2 gap-x-10 gap-y-6"
              >
                {loading ? (
                  <div className="col-span-full h-80 border border-white/5 bg-cp-black/20 flex flex-col items-center justify-center gap-6">
                    <div className="w-16 h-16 border-2 border-cp-yellow border-t-transparent animate-spin" />
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-cp-yellow font-cp-mono uppercase text-[10px] animate-pulse tracking-widest">
                        {activeTheme === 'stalker' ? 'ПОДКЛЮЧЕНИЕ К НООСФЕРЕ...' : 'Инициализация потока данных...'}
                      </span>
                      <span className="text-gray-700 font-cp-mono text-[7px] uppercase">
                        {activeTheme === 'stalker' ? 'Дешифровка артефактов... 42%' : 'Decrypting Shards... 42%'}
                      </span>
                    </div>
                  </div>
                ) : activeTab === 'zip' ? (
                  <div className="col-span-full">
                    <ZipUpload />
                  </div>
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

        {/* Floating Background Noise Elements */}
        <div className="absolute bottom-12 right-12 flex flex-col items-end opacity-20 pointer-events-none">
          <div className="font-cp-mono text-[6px] text-cp-cyan mb-1">
            {activeTheme === 'stalker' ? 'SIGNAL_STRENGTH // 88%' : 'DATA_STREAM_01 // SECURE'}
          </div>
          <div className="flex gap-0.5">
            {[...Array(20)].map((_, i) => (
              <div key={i} className={`w-1 h-3 ${i % 3 === 0 ? 'bg-cp-cyan' : 'bg-white/10'}`} />
            ))}
          </div>
        </div>
      </main>

      {/* Global Interface Overlay Tiles */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none border-[15px] border-cp-black/40 z-40" />
    </div>
  );
}

export default App;
