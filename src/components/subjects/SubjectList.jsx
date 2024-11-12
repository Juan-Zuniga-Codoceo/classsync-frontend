// components/subjects/SubjectList.jsx
import React from 'react';

function SubjectList({ subjects, onEdit, onDelete }) {
  if (!subjects?.length) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <p className="text-sm text-gray-500">No hay asignaturas registradas</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Horas por Semana
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {subjects.map((subject) => (
            <tr key={subject.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {subject.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {`${subject.hoursPerWeek || 0} horas`}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                <button
                  onClick={() => onEdit(subject)}
                  className="text-indigo-600 hover:text-indigo-900 font-medium"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(subject.id)}
                  className="text-red-600 hover:text-red-900 font-medium"
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

export default SubjectList;