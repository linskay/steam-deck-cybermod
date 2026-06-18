export interface Extension {
  id: string;
  title: string;
  description: string;
  icon: string;
  frontendUrl?: string;
  backendPort?: number;
  status: 'not_started' | 'starting' | 'running' | 'failed' | 'stopped';
}

const API_BASE = 'http://localhost:7070/api';

export const ExtensionService = {
  async getExtensions(): Promise<Extension[]> {
    try {
      const response = await fetch(`${API_BASE}/extensions`);
      if (!response.ok) throw new Error('Ошибка сети');
      return await response.json();
    } catch (error) {
      console.error('Ошибка при получении расширений:', error);
      return [];
    }
  }
};
