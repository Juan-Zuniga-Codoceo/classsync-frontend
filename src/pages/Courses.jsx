// src/pages/Courses.jsx
import React, { useState, useEffect } from 'react';
import { PlusIcon } from 'lucide-react';
import CourseList from '../components/courses/CourseList';
import CourseFormModal from '../components/courses/CourseFormModal';
import courseService from '../services/courseService';
import subjectService from '../services/subjectService';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { toast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [coursesData, subjectsData] = await Promise.all([
        courseService.getAll(),
        subjectService.getAll()
      ]);

      setCourses(coursesData);
      setSubjects(subjectsData);
      setError(null);
    } catch (err) {
      console.error('Error al cargar los datos:', err);
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

  const handleCreateCourse = () => {
    setSelectedCourse(null);
    setIsModalOpen(true);
  };

  const handleEditCourse = (course) => {
    // Transformar los datos para el formato que espera el formulario
    const formattedCourse = {
      ...course,
      courseSubjects: course.courseSubjects?.map(cs => ({
        subject: cs.subject,
        hoursPerWeek: cs.hoursPerWeek
      })) || []
    };
    setSelectedCourse(formattedCourse);
    setIsModalOpen(true);
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este curso?')) {
      try {
        await courseService.delete(id);
        toast({
          title: "Éxito",
          description: "Curso eliminado correctamente"
        });
        await loadData();
      } catch (error) {
        console.error('Error al eliminar curso:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Error al eliminar el curso"
        });
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedCourse) {
        await courseService.update(selectedCourse.id, formData);
        toast({
          title: "Éxito",
          description: "Curso actualizado correctamente"
        });
      } else {
        await courseService.create(formData);
        toast({
          title: "Éxito",
          description: "Curso creado correctamente"
        });
      }
      setIsModalOpen(false);
      await loadData();
    } catch (error) {
      console.error('Error al guardar curso:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Error al guardar el curso"
      });
      throw error;
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
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Cursos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona los cursos y sus asignaturas asignadas
          </p>
        </div>
        <Button onClick={handleCreateCourse}>
          <PlusIcon className="h-5 w-5 mr-2" />
          Nuevo Curso
        </Button>
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
        subjects={subjects}
      />
    </div>
  );
}

export default Courses;