import { type Plugin } from '../components/PluginCard';

const API_BASE = 'http://localhost:7070/api';

export const PluginService = {
  async getPlugins(source: string = 'builtin'): Promise<Plugin[]> {
    try {
      const response = await fetch(`${API_BASE}/plugins/${source}`);
      if (!response.ok) throw new Error('Ошибка сети');
      return await response.json();
    } catch (err) {
      console.error(`Ошибка при получении плагинов (${source}):`, err);
      return [];
    }
  },

  async installPlugin(id: string, source: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/plugins/${source}/${id}/install`, {
        method: 'POST',
      });
      return response.ok;
    } catch (err) {
      console.error('Ошибка при установке плагина:', err);
      return false;
    }
  },

  async getDeckyStatus(): Promise<string> {
    try {
      const response = await fetch(`${API_BASE}/decky/status`);
      const data = await response.json();
      return data.status;
    } catch {
      return 'UNKNOWN';
    }
  },

  async installDeckyLoader(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/decky/install-loader`, {
        method: 'POST',
      });
      const data = await response.json();
      return data.success;
    } catch {
      return false;
    }
  },

  async getSystemStats(): Promise<{ status: string; memoryUsed: string; memoryTotal: string; cpuLoad: string } | null> {
    try {
      const response = await fetch(`${API_BASE}/system/stats`);
      return await response.json();
    } catch {
      return null;
    }
  },

  async getConfig(): Promise<{ activeTheme: string }> {
    try {
      const response = await fetch(`${API_BASE}/system/config`);
      return await response.json();
    } catch {
      return { activeTheme: 'cyberpunk' };
    }
  },

  async setConfig(config: { activeTheme: string }): Promise<void> {
    try {
      await fetch(`${API_BASE}/system/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
    } catch (err) {
      console.error('Ошибка сохранения конфига:', err);
    }
  },

  async getInstallLogs(): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE}/decky/logs`);
      const data = await response.json();
      return data.logs || [];
    } catch {
      return [];
    }
  }
};
