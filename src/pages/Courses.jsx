// pages/Courses.jsx
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
      const data = await courseService.getAll();
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
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este curso?')) {
      try {
        await courseService.delete(id);
        await loadCourses();
      } catch (error) {
        setError('Error al eliminar el curso');
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedCourse) {
        await courseService.update(selectedCourse.id, formData);
      } else {
        await courseService.create(formData);
      }
      await loadCourses();
      setIsModalOpen(false);
    } catch (error) {
      throw new Error('Error al guardar el curso');
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
        <div className="mb-4 bg-red-50 text-red-600 p-4 rounded-md">
          {error}
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
        }}
        onSubmit={handleSubmit}
        initialData={selectedCourse}
      />
    </div>
  );
}

export default Courses;