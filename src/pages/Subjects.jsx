// pages/Subjects.jsx
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

  useEffect(() => {
    loadSubjects();
  }, []);

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
        await subjectService.delete(id);
        await loadSubjects();
      } catch (error) {
        setError('Error al eliminar la asignatura');
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedSubject) {
        await subjectService.update(selectedSubject.id, formData);
      } else {
        await subjectService.create(formData);
      }
      await loadSubjects();
      setIsModalOpen(false);
    } catch (error) {
      throw new Error('Error al guardar la asignatura');
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
        <div className="mb-4 bg-red-50 text-red-600 p-4 rounded-md">
          {error}
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
        }}
        onSubmit={handleSubmit}
        initialData={selectedSubject}
      />
    </div>
  );
}

export default Subjects;