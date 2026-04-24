import { type Plugin } from '../components/PluginCard';

const API_BASE = 'http://localhost:7070/api';

export const PluginService = {
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
  }
};
