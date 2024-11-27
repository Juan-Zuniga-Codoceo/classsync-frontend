// src/components/courses/CourseList.jsx
import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

function CourseList({ courses = [], onEdit, onDelete }) {
  if (!courses?.length) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <p className="text-sm text-gray-500">No hay cursos registrados</p>
      </div>
    );
  }

  const getLevelStyle = (level) => {
    return level === 'primary'
      ? 'bg-green-100 text-green-800'
      : 'bg-blue-100 text-blue-800';
  };

  const getLevelLabel = (level) => {
    return level === 'primary' ? 'Básica' : 'Media';
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Nivel</TableHead>
            <TableHead>Asignaturas</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell className="font-medium">
                {course.name}
              </TableCell>
              <TableCell>
                <Badge className={getLevelStyle(course.level)}>
                  {getLevelLabel(course.level)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {course.courseSubjects?.length > 0 ? (
                    course.courseSubjects.map(cs => (
                      <Badge 
                        key={cs.id} 
                        variant="outline"
                        className="text-xs"
                      >
                        {cs.subject.name} ({cs.hoursPerWeek}h)
                      </Badge>
                    ))
                  ) : (
                    <span className="text-yellow-600">Sin asignaturas asignadas</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(course)}
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(course.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
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

export default CourseList;