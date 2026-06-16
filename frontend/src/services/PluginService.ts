import { type Plugin } from '../components/PluginCard';

const API_BASE = 'http://localhost:7070/api';

export const PluginService = {
  getApiBase: () => API_BASE,
  async getPlugins(source: string = 'builtin'): Promise<Plugin[]> {
    try {
      const response = await fetch(`${API_BASE}/plugins/${source}`);
      if (!response.ok) throw new Error('Ошибка сети');
      return await response.json();
    } catch (error) {
      console.error(`Ошибка при получении плагинов (${source}):`, error);
      return [];
    }
  },

  async installPlugin(id: string, source: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/plugins/${source}/${id}/install`, {
        method: 'POST',
      });
      return response.ok;
    } catch (error) {
      console.error('Ошибка при установке плагина:', error);
      return false;
    }
  },

  async uninstallPlugin(id: string, source: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/plugins/${source}/${id}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (error) {
      console.error('Ошибка при удалении плагина:', error);
      return false;
    }
  },

  async getDeckyStatus(): Promise<string> {
    try {
      const response = await fetch(`${API_BASE}/decky/status`);
      const data = await response.json();
      return data.status;
    } catch (error) {
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
    } catch (error) {
      return false;
    }
  },

  async getSystemStats(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE}/system/stats`);
      return await response.json();
    } catch (error) {
      return null;
    }
  },

  async getConfig(): Promise<{ activeTheme: string }> {
    try {
      const response = await fetch(`${API_BASE}/system/config`);
      return await response.json();
    } catch (error) {
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
    } catch (error) {
      console.error('Ошибка сохранения конфига:', error);
    }
  },

  async getInstallLogs(): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE}/decky/logs`);
      const data = await response.json();
      return data.logs || [];
    } catch (error) {
      return [];
    }
  },

  async checkForUpdate(): Promise<{ hasUpdate: boolean; currentVersion: string; latestVersion: string; releaseUrl: string } | null> {
    try {
      const response = await fetch(`${API_BASE}/system/update/check`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      return null;
    }
  },

  async applyUpdate(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/system/update/apply`, { method: 'POST' });
      const data = await response.json();
      return data.success === true;
    } catch (error) {
      return false;
    }
  }
};
