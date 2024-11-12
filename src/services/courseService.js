// services/courseService.js
import api from './api';

const courseService = {
  getAll: async () => {
    try {
      const response = await api.get('/courses');
      return response.data;
    } catch (error) {
      console.error('Error en getAll:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/courses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error en getById:', error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await api.post('/courses', {
        name: data.name,
        level: data.level === 'Básica' ? 'primary' : 'secondary'
      });
      return response.data;
    } catch (error) {
      console.error('Error en create:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/courses/${id}`, {
        name: data.name,
        level: data.level === 'Básica' ? 'primary' : 'secondary'
      });
      return response.data;
    } catch (error) {
      console.error('Error en update:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await api.delete(`/courses/${id}`);
    } catch (error) {
      console.error('Error en delete:', error);
      throw error;
    }
  }
};

export default courseService;