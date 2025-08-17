'use client';

import { useState, useEffect } from 'react';
import { AttorneyService } from '@/app/lib/application/services/AttorneyService';
import { AttorneyResponseDTO } from '@/app/lib/application/dtos/AttorneyDTO';
import AttorneyListAdmin from '@/app/components/admin/AttorneyListAdmin';
import AttorneyFormModal from '@/app/components/admin/AttorneyFormModal';
import { toast, Toaster } from 'react-hot-toast';
import { useUserRole } from '@/app/lib/hooks/useUserRole';

export default function AdminAttorneysPage() {
  const { hasPermission } = useUserRole();
  const [attorneys, setAttorneys] = useState<AttorneyResponseDTO[]>([]);
  const [selectedAttorney, setSelectedAttorney] = useState<AttorneyResponseDTO | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('');

  const attorneyService = new AttorneyService();

  useEffect(() => {
    fetchAttorneys();
  }, []);

  const fetchAttorneys = async () => {
    setIsLoading(true);
    try {
      const data = await attorneyService.getActiveAttorneys();
      setAttorneys(data);
    } catch (error) {
      toast.error('Error al cargar los abogados');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    if (!hasPermission('create_content')) {
      toast.error('No tienes permisos para crear abogados');
      return;
    }
    setSelectedAttorney(null);
    setIsFormOpen(true);
  };

  const handleEdit = (attorney: AttorneyResponseDTO) => {
    if (!hasPermission('manage_content')) {
      toast.error('No tienes permisos para editar abogados');
      return;
    }
    setSelectedAttorney(attorney);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!hasPermission('manage_content')) {
      toast.error('No tienes permisos para eliminar abogados');
      return;
    }

    if (!confirm('¿Está seguro de eliminar este abogado?')) return;

    try {
      await attorneyService.deleteAttorney(id);
      toast.success('Abogado eliminado exitosamente');
      fetchAttorneys();
    } catch (error) {
      toast.error('Error al eliminar el abogado');
      console.error(error);
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (selectedAttorney) {
        await attorneyService.updateAttorney(selectedAttorney.id, data);
        toast.success('Abogado actualizado exitosamente');
      } else {
        await attorneyService.createAttorney(data);
        toast.success('Abogado creado exitosamente');
      }
      
      setIsFormOpen(false);
      setSelectedAttorney(null);
      fetchAttorneys();
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar el abogado');
      console.error(error);
    }
  };

  const filteredAttorneys = attorneys.filter(attorney => {
    const matchesSearch = attorney.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          attorney.cargo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = !filterSpecialization || 
                                  attorney.especializaciones.includes(filterSpecialization);
    return matchesSearch && matchesSpecialization;
  });

  const especializaciones = [
    'Corporativo',
    'Fusiones y Adquisiciones',
    'Litigio Comercial',
    'Arbitraje',
    'Derecho Fiscal',
    'Derecho Laboral',
    'Propiedad Intelectual',
    'Derecho Inmobiliario',
    'Derecho Financiero',
    'Competencia Económica'
  ];

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-8 p-2 sm:p-0">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-stone-200 p-3 sm:p-4 lg:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6 mb-3 sm:mb-6">
          <div className="flex-1">
            <h1 className="text-base sm:text-xl lg:text-3xl font-bold text-slate-900 mb-1 leading-tight">
              Gestión de Abogados
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-slate-600">
              Administra los perfiles de los abogados
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 text-xs sm:text-sm lg:text-base flex-shrink-0 w-full sm:w-auto justify-center sm:justify-start"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Agregar Abogado</span>
            <span className="sm:hidden">+ Abogado</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4">
          <div className="w-full">
            <input
              type="search"
              placeholder="Buscar abogados..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder:text-slate-500"
            />
          </div>
          <select
            value={filterSpecialization}
            onChange={(e) => setFilterSpecialization(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Todas</option>
            {especializaciones.map(esp => (
              <option key={esp} value={esp}>{esp}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 lg:gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-2 sm:p-3 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-600 truncate">Total</p>
              <p className="text-sm sm:text-lg lg:text-3xl font-bold text-slate-900">{attorneys.length}</p>
            </div>
            <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 bg-blue-100 rounded flex items-center justify-center flex-shrink-0 ml-1">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-2 sm:p-3 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-600 truncate">Socios</p>
              <p className="text-sm sm:text-lg lg:text-3xl font-bold text-amber-600">
                {attorneys.filter(a => a.esSocio).length}
              </p>
            </div>
            <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 bg-amber-100 rounded flex items-center justify-center flex-shrink-0 ml-1">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-2 sm:p-3 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-600 truncate">Asociados</p>
              <p className="text-sm sm:text-lg lg:text-3xl font-bold text-green-600">
                {attorneys.filter(a => !a.esSocio).length}
              </p>
            </div>
            <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 bg-green-100 rounded flex items-center justify-center flex-shrink-0 ml-1">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-2 sm:p-3 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-600 truncate">Con Foto</p>
              <p className="text-sm sm:text-lg lg:text-3xl font-bold text-purple-600">
                {attorneys.filter(a => a.imagenUrl).length}
              </p>
            </div>
            <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 bg-purple-100 rounded flex items-center justify-center flex-shrink-0 ml-1">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Attorney List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-32 sm:h-48 lg:h-64 bg-white rounded-lg shadow-sm border border-stone-200">
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 lg:h-12 lg:w-12 border-b-2 border-amber-600"></div>
        </div>
      ) : (
        <AttorneyListAdmin
          attorneys={filteredAttorneys}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <AttorneyFormModal
          attorney={selectedAttorney}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsFormOpen(false);
            setSelectedAttorney(null);
          }}
          attorneyService={attorneyService}
        />
      )}
    </div>
  );
}