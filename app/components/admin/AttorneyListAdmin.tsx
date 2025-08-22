'use client';

import { AttorneyResponseDTO } from '@/app/lib/application/dtos/AttorneyDTO';
import Image from 'next/image';

interface AttorneyListAdminProps {
  attorneys: AttorneyResponseDTO[];
  onEdit: (attorney: AttorneyResponseDTO) => void;
  onDelete: (id: string) => void;
}

export default function AttorneyListAdmin({ attorneys, onEdit, onDelete }: AttorneyListAdminProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-stone-200">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[360px]">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="px-2 sm:px-3 lg:px-6 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Abogado
              </th>
              <th className="px-2 sm:px-3 lg:px-6 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                Cargo
              </th>
              <th className="px-2 sm:px-3 lg:px-6 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden md:table-cell">
                Especializaciones
              </th>
              <th className="px-2 sm:px-3 lg:px-6 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                Experiencia
              </th>
              <th className="px-2 sm:px-3 lg:px-6 py-2 text-center text-xs font-medium text-slate-500 uppercase tracking-wider w-16">
                Estado
              </th>
              <th className="px-2 sm:px-3 lg:px-6 py-2 text-center text-xs font-medium text-slate-500 uppercase tracking-wider w-20">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {attorneys.map((attorney) => (
              <tr key={attorney.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8 lg:h-10 lg:w-10">
                      {attorney.imagenUrl ? (
                        <Image
                          src={attorney.imagenUrl}
                          alt={attorney.nombre}
                          width={32}
                          height={32}
                          className="h-7 w-7 sm:h-8 sm:w-8 lg:h-10 lg:w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-7 w-7 sm:h-8 sm:w-8 lg:h-10 lg:w-10 rounded-full bg-amber-100 flex items-center justify-center">
                          <span className="text-amber-700 font-medium text-xs">
                            {attorney.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-2 min-w-0 flex-1">
                      <div className="text-xs sm:text-sm font-medium text-slate-900 truncate">
                        {attorney.nombre}
                      </div>
                      <div className="text-xs text-slate-500 truncate sm:hidden">
                        {attorney.cargo}
                      </div>
                      <div className="text-xs text-slate-500 truncate hidden sm:block lg:hidden">
                        {attorney.correo || 'Sin email'}
                      </div>
                      {/* Show specializations on mobile */}
                      <div className="flex items-center gap-1 mt-1 sm:hidden">
                        {attorney.esSocio ? (
                          <span className="inline-flex text-xs px-1 py-0.5 rounded bg-amber-100 text-amber-800 font-medium">
                            S
                          </span>
                        ) : (
                          <span className="inline-flex text-xs px-1 py-0.5 rounded bg-green-100 text-green-800">
                            A
                          </span>
                        )}
                        <span className="text-xs text-slate-500">
                          {attorney.experienciaAnios}a
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 hidden sm:table-cell">
                  <div className="text-xs sm:text-sm text-slate-900">{attorney.cargo}</div>
                </td>
                <td className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 hidden md:table-cell">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {attorney.especializaciones.slice(0, 2).map((esp, index) => (
                      <span
                        key={index}
                        className="inline-flex text-xs px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800"
                      >
                        {esp}
                      </span>
                    ))}
                    {attorney.especializaciones.length > 2 && (
                      <span className="inline-flex text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        +{attorney.especializaciones.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 hidden lg:table-cell">
                  <div className="text-xs sm:text-sm text-slate-900">{attorney.experienciaAnios} años</div>
                </td>
                <td className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 text-center">
                  <div className="flex flex-col items-center gap-1">
                    {/* Active/Inactive Status */}
                    {attorney.activo !== false ? (
                      <span className="inline-flex text-xs px-1.5 py-0.5 rounded-full bg-green-100 text-green-800 font-medium">
                        <span className="hidden sm:inline">Activo</span>
                        <span className="sm:hidden">✓</span>
                      </span>
                    ) : (
                      <span className="inline-flex text-xs px-1.5 py-0.5 rounded-full bg-red-100 text-red-800 font-medium">
                        <span className="hidden sm:inline">Inactivo</span>
                        <span className="sm:hidden">✗</span>
                      </span>
                    )}
                    {/* Partner Status */}
                    <div className="hidden sm:block">
                      {attorney.esSocio ? (
                        <span className="inline-flex text-xs px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">
                          Socio
                        </span>
                      ) : (
                        <span className="inline-flex text-xs px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          Asociado
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-1 sm:px-2 lg:px-6 py-2 sm:py-3">
                  <div className="flex items-center justify-center space-x-0.5 sm:space-x-1">
                    <button
                      onClick={() => onEdit(attorney)}
                      className="text-amber-600 hover:text-amber-900 p-1 rounded transition-colors duration-200 touch-target"
                      title="Editar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(attorney.id)}
                      className="text-red-600 hover:text-red-900 p-1 rounded transition-colors duration-200 touch-target"
                      title="Eliminar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}