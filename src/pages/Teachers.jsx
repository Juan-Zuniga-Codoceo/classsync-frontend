// src/pages/Teachers.jsx
import React, { useState, useEffect } from 'react';
import TeacherList from '../components/teachers/TeacherList';
import TeacherFormModal from '../components/teachers/TeacherFormModal';
import SetupGuide from '../components/common/SetupGuide';
import teacherService from '../services/teacherService';
import subjectService from '../services/subjectService';
import courseService from '../services/courseService';
import { PlusIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useToast } from '../components/ui/use-toast';

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [teachersData, subjectsData, coursesData] = await Promise.all([
        teacherService.getAll(),
        subjectService.getAll(),
        courseService.getAll()
      ]);

      setTeachers(teachersData);
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

  const handleCreateTeacher = () => {
    // Verificar que existan materias y cursos antes de permitir crear un profesor
    if (!subjects.length || !courses.length) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Debe crear materias y cursos antes de agregar profesores"
      });
      return;
    }

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
        toast({
          title: "Éxito",
          description: "Profesor eliminado correctamente"
        });
        await loadInitialData();
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Error al eliminar el profesor"
        });
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedTeacher) {
        await teacherService.update(selectedTeacher.id, formData);
        toast({
          title: "Éxito",
          description: "Profesor actualizado correctamente"
        });
      } else {
        await teacherService.create(formData);
        toast({
          title: "Éxito",
          description: "Profesor creado correctamente"
        });
      }
      await loadInitialData();
      setIsModalOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Error al guardar el profesor"
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

  // Verificar si se necesita mostrar la guía de configuración
  const showSetupGuide = !subjects.length || !courses.length;

  return (
    <div className="p-8">
      {showSetupGuide && (
        <div className="mb-8">
          <SetupGuide 
            steps={[
              {
                title: "Crear las asignaturas que se impartirán",
                completed: subjects.length > 0,
                link: "/subjects"
              },
              {
                title: "Configurar los cursos disponibles",
                completed: courses.length > 0,
                link: "/courses"
              },
              {
                title: "Registrar a los profesores y asignarles materias",
                completed: teachers.length > 0
              }
            ]}
          />
        </div>
      )}
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Profesores</h1>
        <Button
          onClick={handleCreateTeacher}
          className="flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Nuevo Profesor
        </Button>
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
        subjects={subjects}
        courses={courses}
      />
    </div>
  );
}

export default Teachers;