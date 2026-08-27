import React, { useState, useRef } from 'react';
import { Download, Upload, RotateCcw, Check, AlertTriangle, FileText, Cloud, RefreshCw, Database } from 'lucide-react';

interface AdminBackupTabProps {
  onExportJSON: () => string;
  onImportJSON: (jsonString: string) => boolean;
  onResetToDefaults: () => void;
  onSyncCloud?: () => Promise<boolean>;
  isFirebaseConnected?: boolean;
  isFirebaseSyncing?: boolean;
}

export const AdminBackupTab: React.FC<AdminBackupTabProps> = ({
  onExportJSON,
  onImportJSON,
  onResetToDefaults,
  onSyncCloud,
  isFirebaseConnected = false,
  isFirebaseSyncing = false,
}) => {
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [resetConfirm, setResetConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDownloadBackup = () => {
    const jsonString = onExportJSON();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `punto-bocado-menu-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const ok = onImportJSON(content);
      if (ok) {
        setImportStatus('success');
        setTimeout(() => setImportStatus('idle'), 3000);
      } else {
        setImportStatus('error');
        setTimeout(() => setImportStatus('idle'), 4000);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleManualCloudSync = async () => {
    if (!onSyncCloud) return;
    try {
      const ok = await onSyncCloud();
      if (ok) {
        setCloudSyncStatus('success');
        setTimeout(() => setCloudSyncStatus('idle'), 3000);
      } else {
        setCloudSyncStatus('error');
        setTimeout(() => setCloudSyncStatus('idle'), 3000);
      }
    } catch {
      setCloudSyncStatus('error');
      setTimeout(() => setCloudSyncStatus('idle'), 3000);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-2xl mx-auto">
      {/* Firebase Cloud Sync Card */}
      <div className="bg-white p-3.5 sm:p-6 rounded-xl sm:rounded-2xl border border-[#ded8c9] shadow-xs">
        <div className="flex items-start sm:items-center gap-3 mb-3.5 sm:mb-4">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#c65526]/10 text-[#c65526] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <Cloud className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-[#272624]">
                Base de Datos Firebase (Firestore)
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isFirebaseConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {isFirebaseConnected ? 'Conectado' : 'Sincronizando'}
              </span>
            </div>
            <p className="text-xs text-[#706b61] mt-0.5">
              Proyecto activo: <strong className="text-[#272624] font-mono">restobar-874b6</strong>. Los cambios guardados se reflejan en tiempo real para todos los comensales.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
          <button
            onClick={handleManualCloudSync}
            disabled={isFirebaseSyncing}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#c65526] hover:bg-[#b0481d] disabled:opacity-50 active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${isFirebaseSyncing ? 'animate-spin' : ''}`} />
            <span>{isFirebaseSyncing ? 'Sincronizando...' : 'Forzar Sincronización Ahora'}</span>
          </button>

          {cloudSyncStatus === 'success' && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 flex items-center justify-center gap-1.5">
              <Check className="w-4 h-4 shrink-0" />
              ¡Base de datos actualizada en Firebase!
            </span>
          )}
          {cloudSyncStatus === 'error' && (
            <span className="text-xs font-bold text-red-700 bg-red-50 px-3 py-2 rounded-xl border border-red-200 flex items-center justify-center gap-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              Error de conexión con Firebase.
            </span>
          )}
        </div>
      </div>

      {/* Backup Card */}
      <div className="bg-white p-3.5 sm:p-6 rounded-xl sm:rounded-2xl border border-[#ded8c9] shadow-xs">
        <div className="flex items-start sm:items-center gap-3 mb-3.5 sm:mb-4">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#5b7b68]/10 text-[#5b7b68] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-[#272624]">
              Exportar Copia de Seguridad Local
            </h3>
            <p className="text-xs text-[#706b61]">
              Descargá un archivo .json con toda tu carta, precios, categorías y configuraciones.
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadBackup}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#5b7b68] hover:bg-[#4d6958] active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>Descargar Respaldo JSON</span>
        </button>
      </div>

      {/* Restore Card */}
      <div className="bg-white p-3.5 sm:p-6 rounded-xl sm:rounded-2xl border border-[#ded8c9] shadow-xs">
        <div className="flex items-start sm:items-center gap-3 mb-3.5 sm:mb-4">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#c65526]/10 text-[#c65526] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-[#272624]">
              Importar / Restaurar Carta
            </h3>
            <p className="text-xs text-[#706b61]">
              Cargá un archivo .json generado previamente para actualizar el menú al instante.
            </p>
          </div>
        </div>

        <input
          type="file"
          accept=".json"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
        />

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white border border-[#ded8c9] hover:bg-[#ede8db] active:scale-95 text-[#272624] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4 text-[#c65526]" />
            <span>Seleccionar Archivo JSON</span>
          </button>

          {importStatus === 'success' && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 flex items-center justify-center gap-1.5">
              <Check className="w-4 h-4 shrink-0" />
              ¡Carta importada y sincronizada correctamente!
            </span>
          )}

          {importStatus === 'error' && (
            <span className="text-xs font-bold text-red-700 bg-red-50 px-3 py-2 rounded-xl border border-red-200 flex items-center justify-center gap-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              Error al importar archivo. Verificá que sea un JSON válido.
            </span>
          )}
        </div>
      </div>

      {/* Reset Card */}
      <div className="bg-red-50/50 p-3.5 sm:p-6 rounded-xl sm:rounded-2xl border border-red-200">
        <div className="flex items-start sm:items-center gap-3 mb-3.5 sm:mb-4">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-red-900">
              Restablecer Menú a Valores Iniciales
            </h3>
            <p className="text-xs text-red-700">
              Elimina las modificaciones locales y vuelve a cargar todos los platos y precios originales de Punto Bocado.
            </p>
          </div>
        </div>

        {resetConfirm ? (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 bg-white rounded-xl border border-red-300">
            <span className="text-xs font-bold text-red-800 flex-1">
              ¿Estás seguro? Se perderán los cambios no exportados.
            </span>
            <div className="flex items-center gap-2 mt-1 sm:mt-0">
              <button
                onClick={() => {
                  onResetToDefaults();
                  setResetConfirm(false);
                }}
                className="flex-1 sm:flex-none px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold cursor-pointer text-center"
              >
                Sí, Restablecer
              </button>
              <button
                onClick={() => setResetConfirm(false)}
                className="flex-1 sm:flex-none px-3.5 py-2 rounded-lg bg-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-300 cursor-pointer text-center"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setResetConfirm(true)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-red-100 hover:bg-red-200 active:scale-95 text-red-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restablecer Carta</span>
          </button>
        )}
      </div>
    </div>
  );
};
