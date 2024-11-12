// src/components/common/SetupGuide.jsx
import React, { useState } from 'react';

function SetupGuide() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-2">Pasos para configurar el sistema:</p>
            <ol className="list-decimal ml-4 space-y-1">
              <li>Crear las asignaturas que se impartirán en la institución</li>
              <li>Configurar los cursos disponibles</li>
              <li>Registrar a los profesores y asignarles materias y cursos</li>
            </ol>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="mt-3 md:mt-0 md:ml-6 text-sm text-blue-700 hover:text-blue-600 font-medium"
          >
            Entendido ×
          </button>
        </div>
      </div>
    </div>
  );
}

export default SetupGuide;