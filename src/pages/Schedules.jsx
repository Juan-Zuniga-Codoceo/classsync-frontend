// src/pages/Schedules.jsx
import React, { useState, useEffect } from 'react';
import { Settings2, Download, RefreshCw } from 'lucide-react';
import ScheduleGrid from '../components/schedules/ScheduleGrid';
import { ScheduleConfig } from '../components/schedules/ScheduleConfig';
import ScheduleValidationAlert from '../components/schedules/ScheduleValidationAlert';
import scheduleService from '../services/scheduleService';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [config, setConfig] = useState(null);
  const [validationStatus, setValidationStatus] = useState(null);
  const { toast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [schedulesData, configData, validationData] = await Promise.all([
        scheduleService.getAll(),
        scheduleService.getConfig(),
        scheduleService.checkConfig()
      ]);

      setSchedules(schedulesData);
      setConfig(configData);
      setValidationStatus(validationData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Error al cargar los datos');
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los datos"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerateSchedule = async () => {
    try {
      setLoading(true);
      setError(null);

      // Verificar configuración antes de generar
      const configCheck = await scheduleService.checkConfig();
      if (!configCheck.configured) {
        setError(configCheck.details || 'Debe configurar los parámetros necesarios');
        return;
      }

      await scheduleService.generate();
      await loadData();
      toast({
        title: "Éxito",
        description: "Horario generado correctamente"
      });
    } catch (error) {
      console.error('Error generating schedule:', error);
      setError(error.message || 'Error al generar el horario');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Horarios</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona y genera los horarios de clase
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsConfigOpen(true)}
            className="flex items-center gap-2"
          >
            <Settings2 className="h-4 w-4" />
            Configuración
          </Button>
          <Button
            variant="outline"
            onClick={scheduleService.exportToExcel}
            disabled={!schedules?.length || loading}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button
            onClick={handleGenerateSchedule}
            disabled={loading || !validationStatus?.configured}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Generando...' : 'Generar Horario'}
          </Button>
        </div>
      </div>

      {/* Mostrar alerta de validación si no se cumplen los requisitos */}
      {(!validationStatus?.configured || error) && (
        <ScheduleValidationAlert
          error={error}
          status={validationStatus}
        />
      )}

      <ScheduleGrid
        schedules={schedules}
        onConfigClick={() => setIsConfigOpen(true)}
        onRegenerateClick={handleGenerateSchedule}
        onExportClick={scheduleService.exportToExcel}
        isLoading={loading}
      />

      <ScheduleConfig
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        onSave={async (data) => {
          try {
            await scheduleService.updateConfig(data);
            await loadData();
            setIsConfigOpen(false);
            toast({
              title: "Éxito",
              description: "Configuración guardada correctamente"
            });
          } catch (error) {
            toast({
              variant: "destructive",
              title: "Error",
              description: error.message || "Error al guardar la configuración"
            });
          }
        }}
        initialConfig={config}
      />
    </div>
  );
}

export default Schedules;