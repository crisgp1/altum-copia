'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RoleGuard from '@/app/components/auth/RoleGuard';
import { ArrowLeft, Play, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface MigrationResult {
  nombre: string;
  slug: string;
  status: 'success' | 'failed';
  error?: string;
}

interface AttorneyInfo {
  nombre: string;
  slug: string;
  url: string;
}

interface MigrationResponse {
  success: boolean;
  message: string;
  total?: number;
  updated?: number;
  failed?: number;
  results?: MigrationResult[];
  allAttorneys?: AttorneyInfo[];
  error?: string;
  details?: string;
}

interface StatusResponse {
  success: boolean;
  totalAttorneys: number;
  attorneysWithSlug: number;
  attorneysWithoutSlug: number;
  needsMigration: boolean;
  attorneys: AttorneyInfo[];
}

export default function MigrateSlugsPage() {
  return (
    <RoleGuard requiredPermission="system_admin">
      <MigrateSlugsContent />
    </RoleGuard>
  );
}

function MigrateSlugsContent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [migrationResult, setMigrationResult] = useState<MigrationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/admin/migrate-slugs');
      const data = await response.json();

      if (data.success) {
        setStatus(data);
      } else {
        setError(data.error || 'Error al verificar el estado');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const runMigration = async () => {
    if (!confirm('¿Estás seguro de ejecutar la migración? Esto agregará slugs a todos los attorneys que no los tengan.')) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setMigrationResult(null);

      const response = await fetch('/api/admin/migrate-slugs', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setMigrationResult(data);
        // Refresh status
        await checkStatus();
      } else {
        setError(data.error || 'Error al ejecutar la migración');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors duration-300 mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Volver al Dashboard</span>
          </button>

          <h1 className="text-3xl font-bold text-slate-800">Migración de Slugs para Attorneys</h1>
          <p className="text-slate-600 mt-2">
            Esta herramienta genera slugs SEO-friendly para los perfiles de abogados
          </p>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex gap-4">
            <button
              onClick={checkStatus}
              disabled={isLoading}
              className="px-6 py-3 bg-slate-600 hover:bg-slate-700 disabled:bg-slate-400 text-white rounded-lg font-medium transition-colors duration-300 flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              Verificar Estado
            </button>

            <button
              onClick={runMigration}
              disabled={isLoading || (status && !status.needsMigration)}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 disabled:text-slate-500 text-white rounded-lg font-medium transition-colors duration-300 flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Play className="w-5 h-5" />
              )}
              Ejecutar Migración
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800">Error</h3>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Status Display */}
        {status && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Estado Actual</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-slate-800">{status.totalAttorneys}</div>
                <div className="text-sm text-slate-600">Total Attorneys</div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-800">{status.attorneysWithSlug}</div>
                <div className="text-sm text-green-600">Con Slug</div>
              </div>

              <div className="bg-amber-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-amber-800">{status.attorneysWithoutSlug}</div>
                <div className="text-sm text-amber-600">Sin Slug</div>
              </div>

              <div className={`rounded-lg p-4 ${status.needsMigration ? 'bg-red-50' : 'bg-blue-50'}`}>
                <div className={`text-2xl font-bold ${status.needsMigration ? 'text-red-800' : 'text-blue-800'}`}>
                  {status.needsMigration ? 'Sí' : 'No'}
                </div>
                <div className={`text-sm ${status.needsMigration ? 'text-red-600' : 'text-blue-600'}`}>
                  Requiere Migración
                </div>
              </div>
            </div>

            {/* Attorneys List */}
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-800 mb-3">Attorneys en el Sistema:</h3>
              {status.attorneys.map((attorney, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${attorney.slug && attorney.slug !== 'NO SLUG' ? 'bg-green-500' : 'bg-amber-500'}`} />
                    <span className="font-medium text-slate-800">{attorney.nombre}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <code className="text-sm text-slate-600 bg-white px-3 py-1 rounded border border-slate-200">
                      {attorney.slug}
                    </code>
                    {attorney.url !== 'N/A' && (
                      <a
                        href={attorney.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Ver Perfil →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Migration Results */}
        {migrationResult && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-slate-800">Resultado de la Migración</h2>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 font-medium">{migrationResult.message}</p>
              <div className="mt-2 text-sm text-green-700">
                <span className="font-semibold">{migrationResult.updated}</span> attorneys actualizados,{' '}
                <span className="font-semibold">{migrationResult.failed}</span> fallos
              </div>
            </div>

            {migrationResult.results && migrationResult.results.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-slate-800 mb-3">Detalles:</h3>
                {migrationResult.results.map((result, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      result.status === 'success' ? 'bg-green-50' : 'bg-red-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {result.status === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span className="font-medium text-slate-800">{result.nombre}</span>
                    </div>
                    <div>
                      {result.status === 'success' ? (
                        <code className="text-sm text-green-700 bg-white px-3 py-1 rounded border border-green-200">
                          {result.slug}
                        </code>
                      ) : (
                        <span className="text-sm text-red-600">{result.error}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {migrationResult.allAttorneys && migrationResult.allAttorneys.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="font-semibold text-slate-800 mb-3">URLs Actualizadas:</h3>
                <div className="space-y-2">
                  {migrationResult.allAttorneys.map((attorney, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="font-medium text-slate-800">{attorney.nombre}</span>
                      <a
                        href={attorney.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-mono"
                      >
                        {attorney.url}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        {!status && !migrationResult && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-blue-800 mb-3">Instrucciones</h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-700 text-sm">
              <li>Haz clic en "Verificar Estado" para ver el estado actual de los attorneys</li>
              <li>Si hay attorneys sin slugs, haz clic en "Ejecutar Migración"</li>
              <li>La migración generará slugs SEO-friendly para cada attorney basados en su nombre</li>
              <li>Ejemplo: "Roque Vivas" → slug: "roque-vivas" → URL: /equipo/roque-vivas</li>
              <li>Los slugs antiguos basados en MongoDB IDs seguirán funcionando para compatibilidad</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
