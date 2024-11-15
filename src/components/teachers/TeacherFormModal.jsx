import React, { useState, useEffect } from 'react';
import subjectService from '../../services/subjectService';
import courseService from '../../services/courseService';

function TeacherFormModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    contractType: 'full-time',
    totalHours: '44',
    subjects: []
  });

  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subjectAssignment, setSubjectAssignment] = useState({
    subjectId: '',
    courseId: ''
  });

  const formatLevel = (level) => {
    return level === 'primary' ? 'Básica' : 'Media';
  };

  useEffect(() => {
    if (isOpen) {
      loadInitialData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        contractType: initialData.contractType || 'full-time',
        totalHours: String(initialData.totalHours || 44),
        subjects: initialData.subjects || []
      });
    } else {
      resetForm();
    }
  }, [initialData, isOpen]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [subjectsData, coursesData] = await Promise.all([
        subjectService.getAll(),
        courseService.getAll()
      ]);
      setSubjects(subjectsData);
      // Ordenar cursos por nivel y nombre
      const sortedCourses = coursesData.sort((a, b) => {
        if (a.level === b.level) {
          return a.name.localeCompare(b.name);
        }
        return a.level === 'primary' ? -1 : 1;
      });
      setCourses(sortedCourses);
      setError(null);
    } catch (err) {
      setError('Error al cargar los datos necesarios');
      console.error('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      contractType: 'full-time',
      totalHours: '44',
      subjects: []
    });
    setSubjectAssignment({
      subjectId: '',
      courseId: ''
    });
    setError(null);
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('El nombre es requerido');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('El apellido es requerido');
      return false;
    }
    if (!formData.email.trim()) {
      setError('El email es requerido');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('El email no es válido');
      return false;
    }

    const totalHours = parseInt(formData.totalHours);
    if (isNaN(totalHours) || totalHours <= 0 || totalHours > 44) {
      setError('Las horas totales deben estar entre 1 y 44');
      return false;
    }

    const totalAssignedHours = formData.subjects.reduce((total, subject) => {
      const subjectData = subjects.find(s => s.id === subject.subjectId);
      return total + (subjectData?.hoursPerWeek || 0);
    }, 0);

    if (totalAssignedHours > totalHours) {
      setError(`Las horas asignadas (${totalAssignedHours}) superan el máximo permitido (${totalHours})`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        ...formData,
        totalHours: parseInt(formData.totalHours)
      });
      onClose();
    } catch (error) {
      console.error('Error en submit:', error);
      setError(error.response?.data?.error || 'Error al guardar el profesor');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleAddSubject = () => {
    if (!subjectAssignment.subjectId || !subjectAssignment.courseId) {
      setError('Debe seleccionar una asignatura y un curso');
      return;
    }

    // Verificar duplicados
    const exists = formData.subjects.some(
      s => s.subjectId === parseInt(subjectAssignment.subjectId) && 
           s.courseId === parseInt(subjectAssignment.courseId)
    );

    if (exists) {
      setError('Esta combinación de asignatura y curso ya está asignada');
      return;
    }

    // Validar horas
    const newSubject = subjects.find(s => s.id === parseInt(subjectAssignment.subjectId));
    const currentHours = formData.subjects.reduce((total, subject) => {
      const subjectData = subjects.find(s => s.id === subject.subjectId);
      return total + (subjectData?.hoursPerWeek || 0);
    }, 0);
    const newTotalHours = currentHours + (newSubject?.hoursPerWeek || 0);

    if (newTotalHours > parseInt(formData.totalHours)) {
      setError(`Agregar esta asignatura excedería el límite de ${formData.totalHours} horas`);
      return;
    }

    const subject = subjects.find(s => s.id === parseInt(subjectAssignment.subjectId));
    const course = courses.find(c => c.id === parseInt(subjectAssignment.courseId));

    setFormData(prev => ({
      ...prev,
      subjects: [...prev.subjects, {
        subjectId: parseInt(subjectAssignment.subjectId),
        courseId: parseInt(subjectAssignment.courseId),
        subject: { id: subject.id, name: subject.name },
        course: { 
          id: course.id, 
          name: course.name,
          level: course.level
        }
      }]
    }));

    setSubjectAssignment({ subjectId: '', courseId: '' });
    setError(null);
  };

  const handleRemoveSubject = (index) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {initialData ? 'Editar Profesor' : 'Nuevo Profesor'}
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Apellido</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tipo de Contrato
                </label>
                <select
                  name="contractType"
                  value={formData.contractType}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="full-time">Tiempo Completo</option>
                  <option value="part-time">Medio Tiempo</option>
                  <option value="hourly">Por Horas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Horas Totales
                </label>
                <input
                  type="number"
                  name="totalHours"
                  value={formData.totalHours}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  min="1"
                  max="44"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Asignación de Materias y Cursos
              </label>
              <div className="flex gap-4">
                <select
                  value={subjectAssignment.subjectId}
                  onChange={(e) => setSubjectAssignment(prev => ({
                    ...prev,
                    subjectId: e.target.value
                  }))}
                  className="flex-1 rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Seleccionar asignatura</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>

                <select
                  value={subjectAssignment.courseId}
                  onChange={(e) => setSubjectAssignment(prev => ({
                    ...prev,
                    courseId: e.target.value
                  }))}
                  className="flex-1 rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Seleccionar curso</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.name} ({formatLevel(course.level)})
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleAddSubject}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={!subjectAssignment.subjectId || !subjectAssignment.courseId}
                >
                  Agregar
                </button>
              </div>

              {formData.subjects.length > 0 && (
                <div className="mt-4">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Asignatura
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Curso
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {formData.subjects.map((item, index) => (
                        <tr key={`${item.subjectId}-${item.courseId}-${index}`}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.subject.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <span>{item.course.name} </span>
                              <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                item.course.level === 'primary' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {formatLevel(item.course.level)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              type="button"
                              onClick={() => handleRemoveSubject(index)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Guardando...
                  </span>
                ) : (
                  initialData ? 'Actualizar' : 'Crear'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Procesando...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherFormModal;