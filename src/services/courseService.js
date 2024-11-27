// src/services/courseService.js
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
      // Transformar los datos al formato esperado por el backend
      const formattedData = {
        name: data.name.trim(),
        level: data.level,
        subjects: data.subjects?.map(subject => ({
          subjectId: parseInt(subject.subject.id),
          hoursPerWeek: parseInt(subject.hoursPerWeek)
        })) || []
      };

      const response = await api.post('/courses', formattedData);
      return response.data;
    } catch (error) {
      console.error('Error en create:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      // Transformar los datos al formato esperado por el backend
      const formattedData = {
        name: data.name.trim(),
        level: data.level,
        subjects: data.subjects?.map(subject => ({
          subjectId: parseInt(subject.subject.id),
          hoursPerWeek: parseInt(subject.hoursPerWeek)
        })) || []
      };

      console.log('Datos enviados al backend:', formattedData);
      
      const response = await api.put(`/courses/${id}`, formattedData);
      return response.data;
    } catch (error) {
      console.error('Error en update:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/courses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error en delete:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  }
};

export default courseService;