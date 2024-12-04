import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings2, Download, RefreshCw } from 'lucide-react';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const BLOCKS = Array.from({ length: 8 }, (_, i) => i + 1);

export default function ScheduleGrid({
  schedules = [],
  onConfigClick,
  onRegenerateClick,
  onExportClick,
  isLoading
}) {
  const [viewMode, setViewMode] = useState('byDay');

  const getTimeForBlock = (block) => {
    const startHour = 8;
    const blockDuration = 90;
    const breakDuration = 15;
    const totalMinutes = (block - 1) * (blockDuration + breakDuration);
    const hours = Math.floor(totalMinutes / 60) + startHour;
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const getScheduleCell = (day, block) => {
    if (!schedules?.byDay?.[day-1]?.[block-1]) return null;

    const cell = schedules.byDay[day-1][block-1];
    return (
      <div className="p-2 space-y-2">
        <div className="font-medium text-sm">{cell.subject}</div>
        <div className="text-xs text-gray-600">{cell.teacher}</div>
        <Badge variant="outline" className="text-xs">
          {cell.course}
        </Badge>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">
            Vista de Horarios
          </label>
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="w-48 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none"
          >
            <option value="byDay">Por Día</option>
            <option value="byTeacher">Por Profesor</option>
            <option value="byCourse">Por Curso</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          {viewMode === 'byDay' && (
            <div className="min-w-[1000px]">
              <div className="grid grid-cols-[100px_repeat(5,1fr)] gap-4">
                {/* Header */}
                <div className="h-12" />
                {DAYS.map(day => (
                  <div
                    key={day}
                    className="bg-gray-100 p-2 rounded-md text-center font-semibold"
                  >
                    {day}
                  </div>
                ))}

                {/* Bloques */}
                {BLOCKS.map(block => (
                  <React.Fragment key={block}>
                    <div className="flex items-center justify-center text-sm font-medium text-gray-600">
                      {getTimeForBlock(block)}
                    </div>
                    {DAYS.map((_, dayIndex) => (
                      <Card 
                        key={`${dayIndex}-${block}`}
                        className="min-h-[100px]"
                      >
                        {getScheduleCell(dayIndex + 1, block)}
                      </Card>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
          
          {/* TODO: Implementar vistas por profesor y curso */}
          {viewMode === 'byTeacher' && (
            <div className="text-center p-4 text-gray-500">
              Vista por profesor próximamente
            </div>
          )}
          
          {viewMode === 'byCourse' && (
            <div className="text-center p-4 text-gray-500">
              Vista por curso próximamente
            </div>
          )}
        </div>
      </div>
    </div>
  );
}