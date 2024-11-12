import React from 'react';

function TeacherList({ teachers, onEdit, onDelete }) {
  if (!Array.isArray(teachers) || teachers.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <p className="text-sm text-gray-500">No hay profesores para mostrar</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Teléfono
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contrato
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Horas
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Materias
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {teachers.map((teacher) => (
            <tr key={teacher.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                {teacher.firstName} {teacher.lastName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {teacher.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {teacher.phone || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  teacher.contractType === 'full-time' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {teacher.contractType === 'full-time' 
                    ? 'Tiempo Completo' 
                    : teacher.contractType === 'part-time'
                    ? 'Medio Tiempo'
                    : 'Por Horas'
                  }
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {teacher.totalHours}h
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {teacher.subjects && Array.isArray(teacher.subjects) && teacher.subjects.map((assignment) => (
                    assignment?.subject?.name && assignment?.course?.name && (
                      <span 
                        key={`${assignment.subject.id}-${assignment.course.id}`}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {assignment.subject.name} ({assignment.course.name})
                      </span>
                    )
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(teacher)}
                  className="text-indigo-600 hover:text-indigo-900 mx-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(teacher.id)}
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

export default TeacherList;