import api from './api';

const courseService = {
  getAll: async () => {
    try {
      const response = await api.get('/courses');
      console.log('Respuesta de getAll:', response.data);
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
      console.log('Datos a enviar en create:', data);
      const response = await api.post('/courses', {
        name: data.name,
        level: data.level
      });
      console.log('Respuesta de create:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error en create:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      console.log('Datos a enviar en update:', { id, data });
      const response = await api.put(`/courses/${id}`, {
        name: data.name,
        level: data.level
      });
      console.log('Respuesta de update:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error en update:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      console.log('Intentando eliminar curso:', id);
      const response = await api.delete(`/courses/${id}`);
      console.log('Respuesta de delete:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error en delete:', error);
      // Propagar el error con el mensaje del backend si existe
      if (error.response?.data?.error) {
        const customError = new Error(error.response.data.error);
        customError.response = error.response;
        throw customError;
      }
      throw error;
    }
  }
};

export default courseService;