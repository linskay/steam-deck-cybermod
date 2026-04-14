import { type Plugin } from '../components/PluginCard';

const API_BASE = 'http://localhost:7070/api';

export const PluginService = {
  async getPlugins(): Promise<Plugin[]> {
    try {
      const response = await fetch(`${API_BASE}/plugins`);
      if (!response.ok) throw new Error('Ошибка сети');
      return await response.json();
    } catch (error) {
      console.error('Ошибка при получении плагинов:', error);
      return [];
    }
  },

  async installPlugin(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/install/${id}`, {
        method: 'POST',
      });
      return response.ok;
    } catch (error) {
      console.error('Ошибка при установке плагина:', error);
      return false;
    }
  }
};
