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
    <div className="bg-white rounded-xl shadow-sm border border-stone-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Abogado
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Cargo
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Especializaciones
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Experiencia
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {attorneys.map((attorney) => (
              <tr key={attorney.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {attorney.imagenUrl ? (
                        <Image
                          src={attorney.imagenUrl}
                          alt={attorney.nombre}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                          <span className="text-amber-700 font-medium">
                            {attorney.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-slate-900">
                        {attorney.nombre}
                      </div>
                      <div className="text-sm text-slate-500">
                        {attorney.correo || 'Sin email'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">{attorney.cargo}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {attorney.especializaciones.slice(0, 3).map((esp, index) => (
                      <span
                        key={index}
                        className="inline-flex text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800"
                      >
                        {esp}
                      </span>
                    ))}
                    {attorney.especializaciones.length > 3 && (
                      <span className="inline-flex text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                        +{attorney.especializaciones.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">{attorney.experienciaAnios} años</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {attorney.esSocio ? (
                    <span className="inline-flex text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800 font-medium">
                      Socio
                    </span>
                  ) : (
                    <span className="inline-flex text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                      Asociado
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(attorney)}
                    className="text-amber-600 hover:text-amber-900 mr-3"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(attorney.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}