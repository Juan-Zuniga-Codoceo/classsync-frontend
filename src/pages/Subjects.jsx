// src/pages/Subjects.jsx
import React, { useState, useEffect } from 'react';
import SubjectList from '../components/subjects/SubjectList';
import SubjectFormModal from '../components/subjects/SubjectFormModal';
import subjectService from '../services/subjectService';
import courseService from '../services/courseService';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const { toast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [subjectsData, coursesData] = await Promise.all([
        subjectService.getAll(),
        courseService.getAll()
      ]);
      
      setSubjects(subjectsData);
      setCourses(coursesData);
      setError(null);
    } catch (err) {
      setError('Error al cargar los datos');
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los datos"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateSubject = () => {
    setSelectedSubject(null);
    setIsModalOpen(true);
  };

  const handleEditSubject = (subject) => {
    // Transformar los datos para el formato que espera el formulario
    const formattedSubject = {
      ...subject,
      courseSubjects: subject.courses.map(course => ({
        course,
        hoursPerWeek: course.hoursPerWeek
      }))
    };
    setSelectedSubject(formattedSubject);
    setIsModalOpen(true);
  };

  const handleDeleteSubject = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta asignatura?')) {
      try {
        await subjectService.delete(id);
        toast({
          title: "Éxito",
          description: "Asignatura eliminada correctamente"
        });
        await loadData();
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Error al eliminar la asignatura"
        });
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedSubject) {
        await subjectService.update(selectedSubject.id, formData);
        toast({
          title: "Éxito",
          description: "Asignatura actualizada correctamente"
        });
      } else {
        await subjectService.create(formData);
        toast({
          title: "Éxito",
          description: "Asignatura creada correctamente"
        });
      }
      setIsModalOpen(false);
      await loadData();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Error al guardar la asignatura"
      });
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Asignaturas</h1>
        <Button onClick={handleCreateSubject}>
          <PlusIcon className="h-5 w-5 mr-2" />
          Nueva Asignatura
        </Button>
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
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedSubject}
        courses={courses}
      />
    </div>
  );
}

export default Subjects;