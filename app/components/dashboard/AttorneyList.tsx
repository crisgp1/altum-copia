'use client';

import { AttorneyPublicDTO } from '@/app/lib/application/dtos/AttorneyDTO';
import Image from 'next/image';

interface AttorneyListProps {
  attorneys: AttorneyPublicDTO[];
  onEdit: (attorney: AttorneyPublicDTO) => void;
  onDelete: (id: string) => void;
}

export default function AttorneyList({ attorneys, onEdit, onDelete }: AttorneyListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {attorneys.map((attorney) => (
        <div
          key={attorney.id}
          className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
        >
          <div className="relative h-64 bg-gradient-to-br from-blue-500 to-blue-600">
            {attorney.imagenUrl ? (
              <Image
                src={attorney.imagenUrl}
                alt={attorney.nombre}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-white text-6xl font-bold">
                  {attorney.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
              </div>
            )}
            {attorney.esSocio && (
              <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Socio
              </div>
            )}
          </div>

          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {attorney.nombre}
            </h3>
            <p className="text-gray-600 mb-3">{attorney.cargo}</p>
            
            <p className="text-sm text-gray-700 mb-4 line-clamp-2">
              {attorney.descripcionCorta}
            </p>

            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Especializaciones:</p>
              <div className="flex flex-wrap gap-1">
                {attorney.especializaciones.slice(0, 3).map((esp, index) => (
                  <span
                    key={index}
                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                  >
                    {esp}
                  </span>
                ))}
                {attorney.especializaciones.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{attorney.especializaciones.length - 3}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <span>{attorney.experienciaAnios} años exp.</span>
              <span>{attorney.idiomas.length} idiomas</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onEdit(attorney)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Editar
              </button>
              <button
                onClick={() => onDelete(attorney.id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}