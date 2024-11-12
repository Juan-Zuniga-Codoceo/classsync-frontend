// components/subjects/SubjectFormModal.jsx
import React, { useState, useEffect } from 'react';

function SubjectFormModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    name: '',
    hoursPerWeek: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        hoursPerWeek: initialData.hoursPerWeek?.toString() || ''
      });
    } else {
      setFormData({
        name: '',
        hoursPerWeek: ''
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Asegurarse de que hoursPerWeek sea un número
    const submissionData = {
      ...formData,
      hoursPerWeek: parseInt(formData.hoursPerWeek, 10)
    };
    onSubmit(submissionData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {initialData ? 'Editar Asignatura' : 'Nueva Asignatura'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la Asignatura
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="Ej: Matemáticas"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Horas por Semana
              </label>
              <input
                type="number"
                value={formData.hoursPerWeek}
                onChange={(e) => setFormData({ ...formData, hoursPerWeek: e.target.value })}
                className="w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="Ej: 6"
                required
                min="1"
                max="40"
              />
              <p className="mt-1 text-sm text-gray-500">
                Ingrese el número de horas semanales (entre 1 y 40)
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                {initialData ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SubjectFormModal;