// src/pages/Teachers.jsx
import React, { useState, useEffect } from 'react';
import TeacherList from '../components/teachers/TeacherList';
import TeacherFormModal from '../components/teachers/TeacherFormModal';
import SetupGuide from '../components/common/SetupGuide';
import teacherService from '../services/teacherService';

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const data = await teacherService.getAll();
      setTeachers(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los profesores');
      console.error('Error cargando profesores:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeacher = () => {
    setSelectedTeacher(null);
    setIsModalOpen(true);
  };

  const handleEditTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
  };

  const handleDeleteTeacher = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este profesor?')) {
      try {
        await teacherService.delete(id);
        await loadTeachers();
      } catch (error) {
        setError('Error al eliminar el profesor');
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedTeacher) {
        await teacherService.update(selectedTeacher.id, formData);
      } else {
        await teacherService.create(formData);
      }
      await loadTeachers();
      setIsModalOpen(false);
    } catch (error) {
      throw new Error('Error al guardar el profesor');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <SetupGuide />
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Profesores</h1>
        <button
          onClick={handleCreateTeacher}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
        >
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M12 4v16m8-8H4"
            />
          </svg>
          Nuevo Profesor
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 text-red-600 p-4 rounded-md">
          {error}
        </div>
      )}

      <TeacherList
        teachers={teachers}
        onEdit={handleEditTeacher}
        onDelete={handleDeleteTeacher}
      />

      <TeacherFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedTeacher}
      />
    </div>
  );
}

export default Teachers;