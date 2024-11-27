// src/services/subjectService.js
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
      // Transformar los datos al formato esperado por el backend
      const formattedData = {
        name: data.name.trim(),
        courses: data.courseIds.map(course => ({
          id: course.id,
          hoursPerWeek: parseInt(course.hoursPerWeek)
        }))
      };

      const response = await api.post('/subjects', formattedData);
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
      const formattedData = {
        name: data.name.trim(),
        courses: data.courseIds.map(course => ({
          id: parseInt(course.id),
          hoursPerWeek: parseInt(course.hoursPerWeek)
        }))
      };
  
      console.log('Datos enviados al backend:', formattedData);
      
      const response = await api.put(`/subjects/${id}`, formattedData);
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
      const response = await api.delete(`/subjects/${id}`);
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

export default subjectService;