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

        {/* Theme Artwork Background */}
        <div
          className="fixed pointer-events-none z-0"
          style={{
            right: '0',
            bottom: '0',
            width: '45%',
            height: '80%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right bottom',
            backgroundSize: 'contain',
            opacity: activeTheme === 'cyberpunk' ? 0.07 :
              activeTheme === 'stalker' ? 0.06 :
                activeTheme === 'doom' ? 0.08 :
                  activeTheme === 'portal' ? 0.05 :
                    activeTheme === 'deadspace' ? 0.07 : 0.07,
            backgroundImage:
              activeTheme === 'cyberpunk' ? "url('https://logos-world.net/wp-content/uploads/2020/11/Cyberpunk-2077-Logo.png')" :
                activeTheme === 'stalker' ? "url('https://upload.wikimedia.org/wikipedia/en/2/2f/Stalker_Shadow_of_Chernobyl_logo.png')" :
                  activeTheme === 'doom' ? "url('https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Doom_game_logo.png/800px-Doom_game_logo.png')" :
                    activeTheme === 'portal' ? "url('https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Portal2-logo.png/800px-Portal2-logo.png')" :
                      activeTheme === 'deadspace' ? "url('https://upload.wikimedia.org/wikipedia/en/e/e5/Dead_Space_logo.png')" : 'none',
          }}
        />

        {/* Top Header Bar (Cyberpunk Dashboard Style) */}
        <header className="h-16 border-b border-white/5 bg-cp-black/90 backdrop-blur-md sticky top-0 z-20 px-12 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3">
              <span className="font-cp-mono text-[8px] text-cp-cyan/60 uppercase tracking-widest">
                {activeTheme === 'stalker' ? 'КАНАЛ_СВЯЗИ' :
                  activeTheme === 'doom' ? 'BATTLE_ID' :
                    activeTheme === 'portal' ? 'CHAMBER_ID' :
                      activeTheme === 'deadspace' ? 'HOLO_LINK' : 'MOD_LAYER_ID'}
              </span>
              <div className="w-10 h-5 border border-cp-cyan/30 flex items-center justify-center font-cp-mono text-[10px] text-cp-cyan bg-cp-cyan/5">
                {activeTheme === 'portal' ? '01' : activeTheme === 'doom' ? '666' : activeTheme === 'deadspace' ? '7B' : '15'}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-cp-mono text-[8px] text-cp-yellow/60 uppercase tracking-widest">
                {activeTheme === 'stalker' ? 'ИНДЕКС_ЗОНЫ' :
                  activeTheme === 'doom' ? 'THREAT_LVL' :
                    activeTheme === 'portal' ? 'STABILITY' :
                      activeTheme === 'deadspace' ? 'NODE_INDX' : 'DECK_REP_INDEX'}
              </span>
              <div className="w-10 h-5 border border-cp-yellow/30 flex items-center justify-center font-cp-mono text-[10px] text-cp-yellow bg-cp-yellow/5">
                {activeTheme === 'portal' ? '100%' : activeTheme === 'doom' ? '99' : activeTheme === 'deadspace' ? '!!' : '23'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8 font-cp-mono text-[8px] tracking-[0.2em] text-gray-600">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 ${activeTheme === 'portal' ? 'bg-blue-400' : activeTheme === 'deadspace' ? 'bg-cyan-500' : 'bg-green-500'} rounded-full animate-pulse`} />
              <span className={`${activeTheme === 'portal' ? 'text-blue-500' : activeTheme === 'doom' ? 'text-red-500' : activeTheme === 'deadspace' ? 'text-cyan-400' : 'text-green-500'} font-bold`}>
                {activeTheme === 'stalker' ? 'СИГНАЛ: ЕСТЬ' :
                  activeTheme === 'doom' ? 'STATUS: READY' :
                    activeTheme === 'portal' ? 'SUBJECT_STATUS: OPTIMAL' :
                      activeTheme === 'deadspace' ? 'HEALTH: STABLE' : 'SYS_LINK: ACTIVE'}
              </span>
            </div>
            <div className="hidden lg:flex items-center gap-4 border-l border-white/5 pl-8">
              <span>PING: {activeTheme === 'portal' ? '0MS' : activeTheme === 'deadspace' ? '--' : '24MS'}</span>
              <span className={`${activeTheme === 'deadspace' ? 'text-cyan-400/60' : 'text-cp-yellow/40'}`}>
                {activeTheme === 'portal' ? 'CAKE: [##########]' :
                  activeTheme === 'deadspace' ? 'OXYGEN: [#########-]' : 'BUFFER: [####------]'}
              </span>
              <span className="text-cp-cyan/40">
                {activeTheme === 'stalker' ? 'ПДА_v.2.1' :
                  activeTheme === 'doom' ? 'HUD_v.6.6.6' :
                    activeTheme === 'portal' ? 'APERTURE_v.01' :
                      activeTheme === 'deadspace' ? 'RIG_v.2114' : 'v1.2.0_STABLE'}
              </span>
            </div>
          </div>
        </header>

        <div className="p-12 relative flex-1">
          {/* Background Decorative Elements - Cinematic Noise */}
          {!['portal'].includes(activeTheme) && (
            <>
              <div className="absolute top-20 right-20 w-32 h-32 border-t border-r border-cp-yellow/10 pointer-events-none" />
              <div className="absolute bottom-20 left-20 w-48 h-48 border-b border-l border-cp-cyan/10 pointer-events-none" />
            </>
          )}

          {activeTheme === 'doom' && (
            <div className="absolute inset-0 bg-red-900/5 mix-blend-overlay pointer-events-none" />
          )}

          {activeTheme === 'portal' && (
            <div className="absolute inset-0 bg-blue-50/10 pointer-events-none" />
          )}

          {activeTheme === 'deadspace' && (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(34,211,238,0.05)_0%,transparent_100%)] pointer-events-none" />
          )}

          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cp-yellow/5 blur-[180px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cp-cyan/5 blur-[150px] pointer-events-none" />

          {/* Content Container */}
          <div className="max-w-7xl mx-auto relative z-10">
            <header className="mb-12">
              <div className="flex items-center gap-6 mb-3">
                <div className={`w-8 h-8 border ${activeTheme === 'portal' ? 'border-blue-400 rounded-full' : activeTheme === 'deadspace' ? 'border-cyan-400 rounded-sm' : 'border-cp-yellow'} flex items-center justify-center font-cp-mono text-sm theme-text-primary bg-cp-yellow/5`}>
                  {activeTheme === 'portal' ? 'P' : activeTheme === 'deadspace' ? 'R' : '!'}
                </div>
                <h2 className={`text-3xl ${activeTheme === 'portal' ? 'font-sans font-light italic' : activeTheme === 'deadspace' ? 'font-tech tracking-[0.6em]' : 'font-cyber uppercase'} tracking-[0.4em] text-white theme-text-primary`}>
                  {activeTab === 'plugins' ? (activeTheme === 'stalker' ? 'СПИСОК_ЗАДАНИЙ' : activeTheme === 'doom' ? 'ARMORY_MODULES' : activeTheme === 'portal' ? 'Module Repository' : activeTheme === 'deadspace' ? 'KINETIC_MODULES' : 'ВСТРОЕННЫЕ_МОДУЛИ') :
                    activeTab === 'decky' ? (activeTheme === 'stalker' ? 'СЕТЬ_ТОРГОВЦЕВ' : activeTheme === 'doom' ? 'UAC_NETWORK' : activeTheme === 'portal' ? 'Database Access' : activeTheme === 'deadspace' ? 'EXT_NET_NODES' : 'КАТАЛОГ_DECKY_REPO') :
                      activeTab === 'zip' ? (activeTheme === 'stalker' ? 'ЗАГРУЗКА_ШИФРА' : activeTheme === 'doom' ? 'IMPORT_DATA' : activeTheme === 'portal' ? 'Data Import' : activeTheme === 'deadspace' ? 'IMPORT_CHIPS' : 'ИМПОРТ_АРХИВА_LOCAL') :
                        activeTab === 'settings' ? (activeTheme === 'stalker' ? 'НАСТРОЙКИ_ПДА' : activeTheme === 'doom' ? 'HUD_CONFIGURATION' : activeTheme === 'portal' ? 'Interface Parameters' : activeTheme === 'deadspace' ? 'RIG_CALIBRATION' : 'КОНФИГУРАЦИЯ_SYSTEM') : 'АРХИВ_МОДОВ'}
                </h2>
              </div>
              <div className={`h-[1px] w-64 ${activeTheme === 'portal' ? 'bg-blue-200' : activeTheme === 'deadspace' ? 'bg-cyan-500/30' : 'bg-gradient-to-r from-cp-yellow to-transparent'}`} />
            </header>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{
                  opacity: 0,
                  scale: activeTheme === 'doom' ? 1.05 : activeTheme === 'portal' ? 0.98 : 1,
                  y: activeTheme === 'portal' ? 20 : 0
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0
                }}
                exit={{
                  opacity: 0,
                  scale: activeTheme === 'portal' ? 1.02 : 1
                }}
                transition={{
                  duration: activeTheme === 'doom' ? 0.05 : activeTheme === 'portal' ? 0.8 : 0.2,
                  ease: activeTheme === 'portal' ? [0.4, 0, 0.2, 1] : "easeOut"
                }}
                className="grid grid-cols-1 xl:grid-cols-2 gap-x-10 gap-y-6"
              >
                {loading ? (
                  <div className={`col-span-full h-80 border ${activeTheme === 'portal' ? 'border-blue-100 bg-white rounded-3xl shadow-sm' : 'border-white/5 bg-cp-black/20'} flex flex-col items-center justify-center gap-6`}>
                    <div className={`w-16 h-16 border-4 ${activeTheme === 'portal' ? 'border-blue-400' : 'border-cp-yellow'} border-t-transparent rounded-full animate-spin`} />
                    <div className="flex flex-col items-center gap-1">
                      <span className={`${activeTheme === 'portal' ? 'text-blue-500 font-sans' : 'text-cp-yellow font-cp-mono'} uppercase text-[10px] animate-pulse tracking-widest font-bold`}>
                        {activeTheme === 'stalker' ? 'ПОДКЛЮЧЕНИЕ К НООСФЕРЕ...' :
                          activeTheme === 'doom' ? 'LOADING COMBAT DATA...' :
                            activeTheme === 'portal' ? 'PROCESSING TEST DATA...' : 'Инициализация потока данных...'}
                      </span>
                      <span className="text-gray-400 font-cp-mono text-[7px] uppercase">
                        {activeTheme === 'stalker' ? 'Дешифровка артефактов... 42%' :
                          activeTheme === 'doom' ? 'SCANNING SECTOR... 666%' :
                            activeTheme === 'portal' ? 'COMPILING RESULTS... 99%' : 'Decrypting Shards... 42%'}
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
        {!['portal'].includes(activeTheme) && (
          <div className="absolute bottom-12 right-12 flex flex-col items-end opacity-20 pointer-events-none">
            <div className={`font-cp-mono text-[6px] ${activeTheme === 'doom' ? 'text-red-500' : 'text-cp-cyan'} mb-1`}>
              {activeTheme === 'stalker' ? 'SIGNAL_STRENGTH // 88%' :
                activeTheme === 'doom' ? 'CORE_TEMP // CRITICAL' : 'DATA_STREAM_01 // SECURE'}
            </div>
            <div className="flex gap-0.5">
              {[...Array(20)].map((_, i) => (
                <div key={i} className={`w-1 h-3 ${activeTheme === 'doom' ? 'bg-red-600' : i % 3 === 0 ? 'bg-cp-cyan' : 'bg-white/10'}`} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Global Interface Overlay Tiles */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none border-[15px] border-cp-black/40 z-40" />
    </div>
  );
}

export default App;
