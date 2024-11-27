import api from './api';

const configService = {
  getScheduleConfig: async () => {
    try {
      const response = await api.get('/config/schedule');
      return response.data;
    } catch (error) {
      console.error('Error getting schedule config:', error);
      // Retornar configuración por defecto si hay error
      return {
        startTime: '08:00',
        endTime: '16:00',
        blockDuration: 45,
        breakDuration: 15
      };
    }
  },

  updateScheduleConfig: async (config) => {
    try {
      const response = await api.put('/config/schedule', config);
      return response.data;
    } catch (error) {
      console.error('Error updating schedule config:', error);
      throw error;
    }
  }
};

export default configService;