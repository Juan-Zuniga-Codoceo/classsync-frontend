import api from './api';

const teacherService = {
  getAll: async () => {
    try {
      const response = await api.get('/teachers');
      console.log('Profesores obtenidos:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error en getAll:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/teachers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error en getById:', error);
      throw error;
    }
  },

  create: async (teacherData) => {
    try {
      console.log('Datos a enviar en create:', teacherData);
      const response = await api.post('/teachers', {
        ...teacherData,
        totalHours: parseInt(teacherData.totalHours)
      });
      console.log('Profesor creado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error en create:', error);
      if (error.response?.data?.error) {
        const customError = new Error(error.response.data.error);
        customError.response = error.response;
        throw customError;
      }
      throw error;
    }
  },

  update: async (id, teacherData) => {
    try {
      console.log('Datos a enviar en update:', { id, teacherData });
      const response = await api.put(`/teachers/${id}`, {
        ...teacherData,
        totalHours: parseInt(teacherData.totalHours)
      });
      console.log('Profesor actualizado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error en update:', error);
      if (error.response?.data?.error) {
        const customError = new Error(error.response.data.error);
        customError.response = error.response;
        throw customError;
      }
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/teachers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error en delete:', error);
      if (error.response?.data?.error) {
        const customError = new Error(error.response.data.error);
        customError.response = error.response;
        throw customError;
      }
      throw error;
    }
  }
};

export default teacherService;