import React, { useState, useEffect } from 'react';

function CourseFormModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    name: '',
    level: 'primary'
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        console.log('Iniciando edición con datos:', initialData);
        setFormData({
          name: initialData.name || '',
          level: initialData.level || 'primary'
        });
      } else {
        setFormData({
          name: '',
          level: 'primary'
        });
      }
      setError(null);
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('El nombre del curso es requerido');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Enviando datos del formulario:', formData);
      await onSubmit({
        name: formData.name.trim(),
        level: formData.level
      });
      onClose();
    } catch (error) {
      console.error('Error en submit:', error);
      setError(error.response?.data?.error || 'Error al guardar el curso');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Cambio en campo:', name, 'nuevo valor:', value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {initialData ? 'Editar Curso' : 'Nuevo Curso'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre del Curso
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="Ej: 1°A"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nivel
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="primary">Básica</option>
                <option value="secondary">Media</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-md"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
              >
                {isSubmitting ? 'Guardando...' : (initialData ? 'Actualizar' : 'Crear')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CourseFormModal;