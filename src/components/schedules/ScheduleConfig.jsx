import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ScheduleConfig({ isOpen, onClose, onSave, initialConfig }) {
  const [formData, setFormData] = useState({
    startTime: '08:00',
    endTime: '16:00',
    blockDuration: 45,
    breakDuration: 15
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialConfig) {
      setFormData({
        startTime: initialConfig.startTime || '08:00',
        endTime: initialConfig.endTime || '16:00',
        blockDuration: initialConfig.blockDuration || 45,
        breakDuration: initialConfig.breakDuration || 15
      });
    }
  }, [initialConfig]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    
    // Validaciones
    if (formData.blockDuration < 30 || formData.blockDuration > 90) {
      setError('La duración del bloque debe estar entre 30 y 90 minutos');
      return;
    }

    if (formData.breakDuration < 5 || formData.breakDuration > 30) {
      setError('La duración del recreo debe estar entre 5 y 30 minutos');
      return;
    }

    const start = new Date(`2000-01-01T${formData.startTime}`);
    const end = new Date(`2000-01-01T${formData.endTime}`);
    
    if (start >= end) {
      setError('La hora de inicio debe ser anterior a la hora de fin');
      return;
    }

    // Calcular bloques posibles
    const totalMinutes = (end - start) / (1000 * 60);
    const possibleBlocks = Math.floor(totalMinutes / (formData.blockDuration + formData.breakDuration));
    
    if (possibleBlocks < 4) {
      setError('La configuración debe permitir al menos 4 bloques de clase');
      return;
    }

    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configuración del Horario</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="startTime">Hora de Inicio</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  startTime: e.target.value
                }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="endTime">Hora de Término</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  endTime: e.target.value
                }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="blockDuration">Duración del Bloque (minutos)</Label>
              <Input
                id="blockDuration"
                type="number"
                min="30"
                max="90"
                value={formData.blockDuration}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  blockDuration: parseInt(e.target.value)
                }))}
                required
              />
              <span className="text-sm text-gray-500">Entre 30 y 90 minutos</span>
            </div>

            <div>
              <Label htmlFor="breakDuration">Duración del Recreo (minutos)</Label>
              <Input
                id="breakDuration"
                type="number"
                min="5"
                max="30"
                value={formData.breakDuration}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  breakDuration: parseInt(e.target.value)
                }))}
                required
              />
              <span className="text-sm text-gray-500">Entre 5 y 30 minutos</span>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button type="submit">
              Guardar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}