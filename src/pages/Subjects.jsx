import React, { useState, useEffect } from 'react';
import SubjectList from '../components/subjects/SubjectList';
import SubjectFormModal from '../components/subjects/SubjectFormModal';
import subjectService from '../services/subjectService';

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const data = await subjectService.getAll();
      setSubjects(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las asignaturas');
      console.error('Error cargando asignaturas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubject = () => {
    setSelectedSubject(null);
    setIsModalOpen(true);
  };

  const handleEditSubject = (subject) => {
    setSelectedSubject(subject);
    setIsModalOpen(true);
  };

  const handleDeleteSubject = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta asignatura?')) {
      try {
        setError(null);
        await subjectService.delete(id);
        await loadSubjects();
      } catch (error) {
        console.error('Error al eliminar:', error);
        // Mostrar mensaje específico para el error de profesores asignados
        if (error.response?.data?.error === 'No se puede eliminar la asignatura porque tiene profesores asignados') {
          alert('No se puede eliminar esta asignatura porque tiene profesores asignados. Por favor, primero desasocie los profesores de la asignatura.');
        } else {
          setError('Error al eliminar la asignatura');
        }
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setError(null);
      if (selectedSubject) {
        await subjectService.update(selectedSubject.id, formData);
      } else {
        await subjectService.create(formData);
      }
      await loadSubjects();
      setIsModalOpen(false);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error al guardar la asignatura';
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Asignaturas</h1>
        <button
          onClick={handleCreateSubject}
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
          Nueva Asignatura
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      <SubjectList
        subjects={subjects}
        onEdit={handleEditSubject}
        onDelete={handleDeleteSubject}
      />

      <SubjectFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSubject(null);
          setError(null);
        }}
        onSubmit={handleSubmit}
        initialData={selectedSubject}
      />
    </div>
  );
}

export default Subjects;