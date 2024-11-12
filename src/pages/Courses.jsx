import React, { useState, useEffect } from 'react';
import CourseList from '../components/courses/CourseList';
import CourseFormModal from '../components/courses/CourseFormModal';
import courseService from '../services/courseService';
import SetupGuide from '../components/common/SetupGuide';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await courseService.getAll();
      console.log('Cursos cargados:', data);
      setCourses(data);
    } catch (err) {
      setError('Error al cargar los cursos');
      console.error('Error loading courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = () => {
    setSelectedCourse(null);
    setIsModalOpen(true);
  };

  const handleEditCourse = (course) => {
    console.log('Editando curso:', course);
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este curso?')) {
      try {
        setError(null);
        await courseService.delete(id);
        await loadCourses();
      } catch (error) {
        console.error('Error al eliminar curso:', error);
        // Mostrar mensaje específico según el error
        if (error.response?.data?.error) {
          setError(error.response.data.error);
        } else {
          setError('Error al eliminar el curso');
        }
        
        // Si quieres mostrar una alerta en lugar de un mensaje en la interfaz
        if (error.response?.data?.error === 'No se puede eliminar el curso porque tiene profesores asignados') {
          alert('No se puede eliminar este curso porque tiene profesores asignados. Por favor, primero desasocie los profesores del curso.');
        }
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setError(null);
      console.log('Datos del formulario a enviar:', formData);
      if (selectedCourse) {
        await courseService.update(selectedCourse.id, formData);
      } else {
        await courseService.create(formData);
      }
      await loadCourses();
      setIsModalOpen(false);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error al guardar el curso';
      setError(errorMessage);
      throw new Error(errorMessage);
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
        <h1 className="text-2xl font-semibold text-gray-900">Cursos</h1>
        <button
          onClick={handleCreateCourse}
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
          Nuevo Curso
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      <CourseList
        courses={courses}
        onEdit={handleEditCourse}
        onDelete={handleDeleteCourse}
      />

      <CourseFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCourse(null);
          setError(null);
        }}
        onSubmit={handleSubmit}
        initialData={selectedCourse}
      />
    </div>
  );
}

export default Courses;