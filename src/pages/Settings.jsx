import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import configService from '../services/configService';

function Settings() {
  const [config, setConfig] = useState({
    startTime: '08:00',
    endTime: '16:00',
    blockDuration: 45,
    breakDuration: 15
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const data = await configService.getScheduleConfig();
      setConfig(data);
    } catch (error) {
      console.error('Error loading config:', error);
      setError('Error al cargar la configuración');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      await configService.updateScheduleConfig(config);
      setSuccess('Configuración guardada exitosamente');
    } catch (error) {
      console.error('Error saving config:', error);
      setError(error.response?.data?.error || 'Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Configuración de Horarios</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="mb-4">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora de Inicio
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={config.startTime}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora de Término
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={config.endTime}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duración de Bloque (minutos)
                </label>
                <input
                  type="number"
                  name="blockDuration"
                  value={config.blockDuration}
                  onChange={handleChange}
                  min="30"
                  max="90"
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Entre 30 y 90 minutos
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duración de Recreo (minutos)
                </label>
                <input
                  type="number"
                  name="breakDuration"
                  value={config.breakDuration}
                  onChange={handleChange}
                  min="5"
                  max="30"
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Entre 5 y 30 minutos
                </p>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Guardando...' : 'Guardar Configuración'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Settings;