import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function SubjectFormModal({ isOpen, onClose, onSubmit, initialData = null, courses = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    courses: []
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        courses: initialData.courseSubjects?.map(cs => ({
          courseId: cs.course.id,
          hoursPerWeek: cs.hoursPerWeek
        })) || []
      });
    } else {
      setFormData({
        name: '',
        courses: []
      });
    }
    setError(null);
  }, [initialData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.name.trim()) {
      setError('El nombre de la asignatura es requerido');
      return;
    }

    if (formData.courses.length === 0) {
      setError('Debe asignar al menos un curso');
      return;
    }

    // Validar que cada curso tenga horas asignadas
    const invalidCourse = formData.courses.find(
      c => !c.hoursPerWeek || c.hoursPerWeek < 1 || c.hoursPerWeek > 40
    );

    if (invalidCourse) {
      const course = courses.find(c => c.id === invalidCourse.courseId);
      setError(`Debe especificar un número válido de horas (1-40) para el curso ${course.name}`);
      return;
    }

    try {
      // Transformar los datos al formato esperado por el servicio
      const submissionData = {
        name: formData.name,
        courseIds: formData.courses.map(course => ({
          id: course.courseId,
          hoursPerWeek: parseInt(course.hoursPerWeek)
        }))
      };

      await onSubmit(submissionData);
      onClose();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCourseToggle = (courseId) => {
    setFormData(prev => {
      const exists = prev.courses.find(c => c.courseId === courseId);
      if (exists) {
        return {
          ...prev,
          courses: prev.courses.filter(c => c.courseId !== courseId)
        };
      } else {
        return {
          ...prev,
          courses: [...prev.courses, { courseId, hoursPerWeek: 0 }]
        };
      }
    });
    setError(null);
  };

  const handleHoursChange = (courseId, hours) => {
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.map(c => 
        c.courseId === courseId
          ? { ...c, hoursPerWeek: hours }
          : c
      )
    }));
    setError(null);
  };

  // Separar cursos por nivel
  const primaryCourses = courses.filter(c => c.level === 'primary');
  const secondaryCourses = courses.filter(c => c.level === 'secondary');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Editar Asignatura' : 'Nueva Asignatura'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md">
              {error}
            </div>
          )}

          <div>
            <Label>Nombre de la Asignatura</Label>
            <Input
              value={formData.name}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, name: e.target.value }));
                setError(null);
              }}
              placeholder="Ej: Matemáticas"
            />
          </div>

          <div className="space-y-4">
            {/* Cursos de Básica */}
            <div>
              <Label>Básica</Label>
              <div className="space-y-2">
                {primaryCourses.map(course => {
                  const courseAssignment = formData.courses.find(c => c.courseId === course.id);
                  return (
                    <div key={course.id} className="flex items-center gap-4 bg-gray-50 p-2 rounded-md">
                      <input
                        type="checkbox"
                        checked={!!courseAssignment}
                        onChange={() => handleCourseToggle(course.id)}
                      />
                      <span>{course.name}</span>
                      {courseAssignment && (
                        <div className="flex-1">
                          <Input
                            type="number"
                            min="1"
                            max="40"
                            value={courseAssignment.hoursPerWeek}
                            onChange={(e) => handleHoursChange(course.id, e.target.value)}
                            className="w-24 ml-auto"
                            placeholder="Horas"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cursos de Media */}
            <div>
              <Label>Media</Label>
              <div className="space-y-2">
                {secondaryCourses.map(course => {
                  const courseAssignment = formData.courses.find(c => c.courseId === course.id);
                  return (
                    <div key={course.id} className="flex items-center gap-4 bg-gray-50 p-2 rounded-md">
                      <input
                        type="checkbox"
                        checked={!!courseAssignment}
                        onChange={() => handleCourseToggle(course.id)}
                      />
                      <span>{course.name}</span>
                      {courseAssignment && (
                        <div className="flex-1">
                          <Input
                            type="number"
                            min="1"
                            max="40"
                            value={courseAssignment.hoursPerWeek}
                            onChange={(e) => handleHoursChange(course.id, e.target.value)}
                            className="w-24 ml-auto"
                            placeholder="Horas"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {initialData ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default SubjectFormModal;