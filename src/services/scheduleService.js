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

  getStats: async () => {
    try {
      const response = await api.get('/schedules/stats');
      return response.data;
    } catch (error) {
      console.error('Error getting stats:', error);
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
  },

  // Métodos para bloques específicos
  getBlock: async (id) => {
    try {
      const response = await api.get(`/schedules/block/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting block:', error);
      throw error;
    }
  },

  createBlock: async (data) => {
    try {
      const response = await api.post('/schedules/block', data);
      return response.data;
    } catch (error) {
      console.error('Error creating block:', error);
      throw error;
    }
  },

  updateBlock: async (id, data) => {
    try {
      const response = await api.put(`/schedules/block/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating block:', error);
      throw error;
    }
  },

  deleteBlock: async (id) => {
    try {
      await api.delete(`/schedules/block/${id}`);
    } catch (error) {
      console.error('Error deleting block:', error);
      throw error;
    }
  },

  // Métodos para obtener bloques por profesor y curso
  getBlocksByTeacher: async (teacherId) => {
    try {
      const response = await api.get(`/schedules/teacher/${teacherId}/blocks`);
      return response.data;
    } catch (error) {
      console.error('Error getting teacher blocks:', error);
      throw error;
    }
  },

  getBlocksByCourse: async (courseId) => {
    try {
      const response = await api.get(`/schedules/course/${courseId}/blocks`);
      return response.data;
    } catch (error) {
      console.error('Error getting course blocks:', error);
      throw error;
    }
  }
};

export default scheduleService;