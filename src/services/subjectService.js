import api from './api';

const subjectService = {
  getAll: async () => {
    try {
      const response = await api.get('/subjects');
      return response.data;
    } catch (error) {
      console.error('Error en getAll:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/subjects/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error en getById:', error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await api.post('/subjects', data);
      return response.data;
    } catch (error) {
      console.error('Error en create:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/subjects/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error en update:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/subjects/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error en delete:', error);
      // Propagar el error con el mensaje del backend
      if (error.response?.data?.error) {
        const customError = new Error(error.response.data.error);
        customError.response = error.response;
        throw customError;
      }
      throw error;
    }
  }
};

export default subjectService;