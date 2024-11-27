// src/components/teachers/SubjectAssignmentDialog.jsx
import React, { useState } from 'react';

const SubjectAssignmentDialog = ({
  isOpen,
  onClose,
  onSubmit,
  subjects = [],
  courses = [],
  initialData = null
}) => {
  const [formData, setFormData] = useState({
    type: initialData?.type || 'flex',
    subjectId: initialData?.subjectId || '',
    level: initialData?.level || 'basic',
    courseId: initialData?.courseId || '',
    isFlexible: initialData?.isFlexible || true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Asignar Materia</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Asignación
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={formData.type === 'flex'}
                    onChange={() => setFormData(prev => ({
                      ...prev,
                      type: 'flex',
                      isFlexible: true,
                      courseId: ''
                    }))}
                    className="mr-2"
                  />
                  Flexible
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={formData.type === 'specific'}
                    onChange={() => setFormData(prev => ({
                      ...prev,
                      type: 'specific',
                      isFlexible: false
                    }))}
                    className="mr-2"
                  />
                  Específica
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Asignatura
              </label>
              <select
                value={formData.subjectId}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  subjectId: e.target.value
                }))}
                className="w-full px-3 py-2 border rounded-md bg-white"
                required
              >
                <option value="">Seleccione una asignatura</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            {formData.type === 'flex' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nivel
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    level: e.target.value
                  }))}
                  className="w-full px-3 py-2 border rounded-md bg-white"
                >
                  <option value="basic">Básica</option>
                  <option value="middle">Media</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Curso
                </label>
                <select
                  value={formData.courseId}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    courseId: e.target.value
                  }))}
                  className="w-full px-3 py-2 border rounded-md bg-white"
                  required={formData.type === 'specific'}
                >
                  <option value="">Seleccione un curso</option>
                  {courses
                    .filter(course => formData.level ? course.level === formData.level : true)
                    .map(course => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))
                  }
                </select>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                disabled={!formData.subjectId || (formData.type === 'specific' && !formData.courseId)}
              >
                Asignar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubjectAssignmentDialog;