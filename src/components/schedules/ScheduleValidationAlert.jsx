// src/components/schedules/ScheduleValidationAlert.jsx
import React from 'react';
import { AlertCircle, BookOpen, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ScheduleValidationAlert({ error }) {
  const navigate = useNavigate();

  return (
    <div className="mb-6 rounded-lg border border-red-200 bg-red-50">
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-red-800">
              Error de Validación
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>Para generar el horario necesitas:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Tener al menos un profesor registrado</li>
                <li>Tener asignaturas configuradas</li>
                <li>Tener cursos creados</li>
                <li>Asignar materias a los cursos</li>
                <li>Asignar profesores a las materias</li>
                <li>Configurar los bloques horarios</li>
              </ul>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/subjects')}
                className="inline-flex items-center rounded-md bg-red-50 px-4 py-2 text-sm font-medium text-red-700 border border-red-200 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Gestionar Asignaturas
              </button>
              <button
                onClick={() => navigate('/courses')}
                className="inline-flex items-center rounded-md bg-red-50 px-4 py-2 text-sm font-medium text-red-700 border border-red-200 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <GraduationCap className="mr-2 h-4 w-4" />
                Gestionar Cursos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}