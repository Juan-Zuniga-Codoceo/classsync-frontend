// src/components/subjects/SubjectList.jsx
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

function SubjectList({ subjects, onEdit, onDelete }) {
  if (!subjects?.length) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <p className="text-sm text-gray-500">No hay asignaturas registradas</p>
      </div>
    );
  }

  // Función para calcular el total de horas por asignatura
  const calculateTotalHours = (courses) => {
    return courses?.reduce((total, course) => total + (course.hoursPerWeek || 0), 0) || 0;
  };

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Cursos y Horas</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjects.map((subject) => (
            <TableRow key={subject.id}>
              <TableCell className="font-medium">{subject.name}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  {subject.courses.map((course) => (
                    <div key={course.id} className="text-sm">
                      <span className="font-medium">{course.name}</span>
                      <span className="text-gray-500"> - {course.hoursPerWeek} horas semanales</span>
                    </div>
                  ))}
                  <div className="text-sm font-medium text-blue-600">
                    Total: {calculateTotalHours(subject.courses)} horas
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => onEdit(subject)}
                >
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => onDelete(subject.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default SubjectList;