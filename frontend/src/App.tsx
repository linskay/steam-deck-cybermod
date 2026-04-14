import React from 'react';
import { SideBar } from './components/SideBar';
import { PluginCard, Plugin } from './components/PluginCard';
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
    <div className="flex w-full h-screen bg-cyber-black text-white overflow-hidden">
      {/* Sidebar */}
      <SideBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-12 relative">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-cyan/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyber-magenta/5 blur-[120px] pointer-events-none" />

        {/* Content Container */}
        <div className="max-w-6xl mx-auto">
          <header className="mb-12 border-b border-cyber-cyan/20 pb-8 flex justify-between items-end">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tighter text-cyber-cyan">
                {activeTab === 'plugins' ? 'Кибер-плагины' : 
                 activeTab === 'decky' ? 'Каталог Decky' :
                 activeTab === 'zip' ? 'Установка ZIP' :
                 activeTab === 'installed' ? 'Установленные' : 'Настройки'}
              </h2>
              <p className="text-gray-400 font-tech text-sm mt-2">
                // {activeTab === 'plugins' ? 'КАТАЛОГ КАСТОМНЫХ МОДИФИКАЦИЙ ДЛЯ ВАШЕГО STEAM DECK' : 
                    activeTab === 'decky' ? 'УПРАВЛЯЙТЕ ОФИЦИАЛЬНЫМИ ПЛАГИНАМИ DECKY LOADER' :
                    activeTab === 'zip' ? 'ИМПОРТИРУЙТЕ ПЛАГИНЫ ИЗ ЛОКАЛЬНЫХ АРХИВОВ' :
                    activeTab === 'installed' ? 'УПРАВЛЕНИЕ ТЕКУЩИМИ ПЛАГИНАМИ' : 'КОНФИГУРАЦИЯ СИСТЕМЫ CYBERMOD'}
              </p>
            </div>
            
            <div className="text-right font-tech text-[10px] text-cyber-magenta opacity-70">
              STATUS: CONNECTED<br/>
              TAB: {activeTab.toUpperCase()}
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {loading ? (
                <div className="col-span-full h-64 border border-cyber-cyan/10 bg-cyber-dark/40 flex items-center justify-center text-gray-600 font-tech uppercase text-xs animate-pulse">
                  Загрузка данных по протоколу...
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
      </main>

      {/* Overlays / Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] animate-pulse bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
    </div>
  );
}

export default App;
