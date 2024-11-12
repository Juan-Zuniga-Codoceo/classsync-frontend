// services/subjectService.js
import api from './api';

const subjectService = {
  getAll: async () => {
    try {
      const response = await api.get('/subjects');
      return response.data;
    } catch (error) {
      console.error('Error en getAll:', error);
      throw new Error('Error al obtener las asignaturas');
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/subjects/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error en getById:', error);
      throw new Error('Error al obtener la asignatura');
    }
  },

  create: async (data) => {
    try {
      const response = await api.post('/subjects', {
        ...data,
        hoursPerWeek: parseInt(data.hoursPerWeek)
      });
      return response.data;
    } catch (error) {
      console.error('Error en create:', error);
      throw new Error(error.response?.data?.error || 'Error al crear la asignatura');
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/subjects/${id}`, {
        ...data,
        hoursPerWeek: parseInt(data.hoursPerWeek)
      });
      return response.data;
    } catch (error) {
      console.error('Error en update:', error);
      throw new Error(error.response?.data?.error || 'Error al actualizar la asignatura');
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/subjects/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error en delete:', error);
      throw new Error('Error al eliminar la asignatura');
    }
  }
};

export default subjectService;