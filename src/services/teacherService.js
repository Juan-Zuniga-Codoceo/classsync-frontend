import api from './api';

const teacherService = {
  getAll: async () => {
    try {
      const response = await api.get('/teachers');
      return response.data;
    } catch (error) {
      console.error('Error en getAll:', error);
      throw new Error('Error al obtener los profesores');
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/teachers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error en getById:', error);
      throw new Error('Error al obtener el profesor');
    }
  },

  create: async (teacherData) => {
    try {
      const response = await api.post('/teachers', teacherData);
      return response.data;
    } catch (error) {
      console.error('Error en create:', error);
      throw new Error(error.response?.data?.error || 'Error al crear el profesor');
    }
  },

  update: async (id, teacherData) => {
    try {
      const response = await api.put(`/teachers/${id}`, teacherData);
      return response.data;
    } catch (error) {
      console.error('Error en update:', error);
      throw new Error(error.response?.data?.error || 'Error al actualizar el profesor');
    }
  },

  delete: async (id) => {
    try {
      await api.delete(`/teachers/${id}`);
    } catch (error) {
      console.error('Error en delete:', error);
      throw new Error('Error al eliminar el profesor');
    }
  },

  getStats: async () => {
    try {
      const teachers = await this.getAll();
      return {
        totalTeachers: teachers.length,
        fullTimeTeachers: teachers.filter(t => t.contractType === 'full-time').length,
        partTimeTeachers: teachers.filter(t => t.contractType === 'part-time').length,
        totalHours: teachers.reduce((sum, t) => sum + t.totalHours, 0),
        averageHours: Math.round(
          teachers.reduce((sum, t) => sum + t.totalHours, 0) / teachers.length
        )
      };
    } catch (error) {
      console.error('Error en getStats:', error);
      throw new Error('Error al obtener estadísticas');
    }
  }
};

export default teacherService;