// src/components/teachers/TeacherFormModal.jsx
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function TeacherFormModal({ 
  isOpen = false, 
  onClose = () => {}, 
  onSubmit = () => {}, 
  initialData = null, 
  subjects = [], 
  courses = [] 
}) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    contractType: 'full-time',
    totalHours: 44,
    subjects: []
  });

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState({
    subjectId: '',
    courseId: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        contractType: initialData.contractType || 'full-time',
        totalHours: initialData.totalHours || 44,
        subjects: initialData.assignments?.map(assignment => ({
          subjectId: assignment.subject?.id,
          courseId: assignment.course?.id,
          subject: assignment.subject,
          course: assignment.course
        })) || []
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        contractType: 'full-time',
        totalHours: 44,
        subjects: []
      });
    }
    setError(null);
  }, [initialData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validaciones
      if (!formData.firstName?.trim() || !formData.lastName?.trim() || !formData.email?.trim()) {
        throw new Error('Nombre, apellido y email son obligatorios');
      }

      if (!formData.totalHours || formData.totalHours < 1 || formData.totalHours > 44) {
        throw new Error('Las horas totales deben estar entre 1 y 44');
      }

      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error en submit:', error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSubject = () => {
    if (!currentAssignment.subjectId || !currentAssignment.courseId) {
      setError('Debe seleccionar una asignatura y un curso');
      return;
    }

    const subjectExists = formData.subjects.some(
      s => s.subjectId === currentAssignment.subjectId && s.courseId === currentAssignment.courseId
    );

    if (subjectExists) {
      setError('Esta asignación ya existe');
      return;
    }

    const subject = subjects.find(s => s.id === parseInt(currentAssignment.subjectId));
    const course = courses.find(c => c.id === parseInt(currentAssignment.courseId));

    if (!subject || !course) {
      setError('Asignatura o curso no encontrado');
      return;
    }

    setFormData(prev => ({
      ...prev,
      subjects: [
        ...prev.subjects,
        {
          subjectId: currentAssignment.subjectId,
          courseId: currentAssignment.courseId,
          subject,
          course
        }
      ]
    }));

    setCurrentAssignment({ subjectId: '', courseId: '' });
    setError(null);
  };

  const handleRemoveSubject = (index) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index)
    }));
  };

  // Validar que tenemos los datos necesarios
  if (!Array.isArray(subjects) || !Array.isArray(courses)) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Editar Profesor' : 'Nuevo Profesor'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Datos personales */}
            <div>
              <Label>Nombre</Label>
              <Input
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="Nombre"
                required
              />
            </div>

            <div>
              <Label>Apellido</Label>
              <Input
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Apellido"
                required
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@ejemplo.com"
                required
              />
            </div>

            <div>
              <Label>Teléfono</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="912345678"
              />
            </div>

            <div>
              <Label>Tipo de Contrato</Label>
              <Select
                value={formData.contractType}
                onChange={(e) => setFormData(prev => ({ ...prev, contractType: e.target.value }))}
              >
                <option value="full-time">Tiempo Completo</option>
                <option value="part-time">Medio Tiempo</option>
                <option value="hourly">Por Horas</option>
              </Select>
            </div>

            <div>
              <Label>Horas Totales</Label>
              <Input
                type="number"
                min="1"
                max="44"
                value={formData.totalHours}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  totalHours: parseInt(e.target.value) || 0 
                }))}
                required
              />
            </div>
          </div>

          {/* Asignación de materias */}
          <div>
            <Label>Asignaturas</Label>
            <div className="flex gap-2 mb-4">
              <Select
                value={currentAssignment.subjectId}
                onChange={(e) => setCurrentAssignment(prev => ({
                  ...prev,
                  subjectId: e.target.value
                }))}
              >
                <option value="">Seleccione una asignatura</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </Select>

              <Select
                value={currentAssignment.courseId}
                onChange={(e) => setCurrentAssignment(prev => ({
                  ...prev,
                  courseId: e.target.value
                }))}
              >
                <option value="">Seleccione un curso</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </Select>

              <Button type="button" onClick={handleAddSubject}>
                Agregar
              </Button>
            </div>

            {formData.subjects.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell>Asignatura</TableCell>
                    <TableCell>Curso</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.subjects.map((assignment, index) => (
                    <TableRow key={`${assignment.subjectId}-${assignment.courseId}`}>
                      <TableCell>{assignment.subject?.name || 'N/A'}</TableCell>
                      <TableCell>{assignment.course?.name || 'N/A'}</TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => handleRemoveSubject(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}