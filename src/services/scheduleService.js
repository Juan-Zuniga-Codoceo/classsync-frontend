// src/services/scheduleService.js
import api from './api';

const scheduleService = {
  getAll: async () => {
    try {
      const response = await api.get('/schedules');
      return response.data;
    } catch (error) {
      console.error('Error getting schedules:', error);
      throw error;
    }
  },

  checkConfig: async () => {
    try {
      const response = await api.get('/schedules/check-config');
      return response.data;
    } catch (error) {
      console.error('Error checking config:', error);
      throw error;
    }
  },

  getConfig: async () => {
    try {
      const response = await api.get('/schedules/config');
      return response.data;
    } catch (error) {
      console.error('Error getting config:', error);
      throw error;
    }
  },

  updateConfig: async (config) => {
    try {
      const response = await api.put('/schedules/config', config);
      return response.data;
    } catch (error) {
      console.error('Error updating config:', error);
      throw error;
    }
  },

  generate: async () => {
    try {
      const response = await api.post('/schedules/generate');
      return response.data;
    } catch (error) {
      console.error('Error generating schedule:', error);
      throw error;
    }
  },

  exportToExcel: async () => {
    try {
      const response = await api.get('/schedules/export/excel', {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'horarios.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      throw error;
    }
  }
};

export default scheduleService;