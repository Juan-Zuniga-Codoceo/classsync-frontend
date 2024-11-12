// components/courses/CourseList.jsx
import React from 'react';

function CourseList({ courses, onEdit, onDelete }) {
  if (!courses?.length) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <p className="text-sm text-gray-500">No hay cursos registrados</p>
      </div>
    );
  }

  const getLevelBadgeStyle = (level) => {
    return level === 'primary' || level === 'Básica'
      ? 'bg-green-100 text-green-800' 
      : 'bg-blue-100 text-blue-800';
  };

  const getLevelLabel = (level) => {
    if (level === 'primary') return 'Básica';
    if (level === 'secondary') return 'Media';
    return level;
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nivel
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {courses.map((course) => (
            <tr key={course.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {course.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelBadgeStyle(course.level)}`}>
                  {getLevelLabel(course.level)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(course)}
                  className="text-indigo-600 hover:text-indigo-900 mx-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(course.id)}
                  className="text-red-600 hover:text-red-900 mx-2"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CourseList;