'use client';

import { useState, useEffect, useCallback } from 'react';
import { AttorneyResponseDTO } from '@/app/lib/application/dtos/AttorneyDTO';
import { AttorneyService } from '@/app/lib/application/services/AttorneyService';
import { useServicesStore } from '@/app/lib/stores/servicesStore';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { UploadIndicator, AnimatedUploadZone, UploadState } from './UploadAnimations';
import { DragDropUpload } from './DragDropUpload';

interface AttorneyFormModalProps {
  attorney: AttorneyResponseDTO | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  attorneyService: AttorneyService;
}

const especializacionesOptions = [
  'Corporativo',
  'Fusiones y Adquisiciones',
  'Litigio Comercial',
  'Arbitraje',
  'Derecho Fiscal',
  'Derecho Laboral',
  'Propiedad Intelectual',
  'Derecho Inmobiliario',
  'Derecho Financiero',
  'Competencia Económica',
  'Energía y Recursos Naturales',
  'Telecomunicaciones',
  'Protección de Datos',
  'Comercio Internacional',
  'Reestructura e Insolvencia'
];

const idiomasOptions = [
  'Español',
  'Inglés',
  'Francés',
  'Alemán',
  'Portugués',
  'Italiano',
  'Mandarín',
  'Japonés'
];

export default function AttorneyFormModal({ 
  attorney, 
  onSubmit, 
  onCancel,
  attorneyService 
}: AttorneyFormModalProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    cargo: '',
    especializaciones: [] as string[],
    serviciosQueAtiende: [] as string[], // New field for services the attorney can handle
    experienciaAnios: 0,
    educacion: [''],
    idiomas: [] as string[],
    correo: '',
    telefono: '',
    biografia: '',
    logros: [''],
    casosDestacados: [''],
    imagenUrl: '',
    linkedIn: '',
    esSocio: false,
    descripcionCorta: '',
    activo: true
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string>('');
  const [activeTab, setActiveTab] = useState('general');
  const [customEspecializacion, setCustomEspecializacion] = useState('');
  const [customIdioma, setCustomIdioma] = useState('');
  const [serviceSearchQuery, setServiceSearchQuery] = useState('');
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());
  const [showExpandHint, setShowExpandHint] = useState<string | null>(null);
  
  // Use Zustand store directly to avoid infinite loops
  const availableServices = useServicesStore((state) => state.services);
  const servicesLoading = useServicesStore((state) => state.isLoading);
  const servicesError = useServicesStore((state) => state.error);
  const fetchServices = useServicesStore((state) => state.fetchServices);
  const getServiceById = useServicesStore((state) => state.getServiceById);

  // Debug logging
  useEffect(() => {
    console.log('🔍 AttorneyFormModal - Services state:', {
      servicesCount: availableServices.length,
      isLoading: servicesLoading,
      error: servicesError,
      services: availableServices
    });
  }, [availableServices, servicesLoading, servicesError]); // Dependencia completa para logging consistente

  // Fetch services on mount
  useEffect(() => {
    if (availableServices.length === 0 && !servicesLoading) {
      fetchServices();
    }
  }, [availableServices.length, servicesLoading]); // fetchServices es estable en el store

  // Cargar datos del attorney solo cuando servicios estén disponibles
  useEffect(() => {
    // Solo proceder si hay attorney Y servicios están cargados (o no hay servicios que validar)
    if (!attorney) return;

    console.log('🔍 Loading attorney data:', attorney);

    // Validar servicios solo si hay servicios disponibles
    let validatedServices = attorney.serviciosQueAtiende || [];
    if (availableServices.length > 0 && validatedServices.length > 0) {
      console.log('🔧 Validating attorney services against available services...');
      validatedServices = validatedServices.filter((serviceId: string) =>
        getServiceById(serviceId)
      );
      console.log('✅ Valid services found:', validatedServices);
    }

    setFormData({
      nombre: attorney.nombre,
      cargo: attorney.cargo,
      especializaciones: attorney.especializaciones,
      serviciosQueAtiende: validatedServices,
      experienciaAnios: attorney.experienciaAnios,
      educacion: attorney.educacion.length > 0 ? attorney.educacion : [''],
      idiomas: attorney.idiomas,
      correo: attorney.correo || '',
      telefono: attorney.telefono || '',
      biografia: attorney.biografia,
      logros: attorney.logros.length > 0 ? attorney.logros : [''],
      casosDestacados: attorney.casosDestacados.length > 0 ? attorney.casosDestacados : [''],
      imagenUrl: attorney.imagenUrl || '',
      linkedIn: attorney.linkedIn || '',
      esSocio: attorney.esSocio,
      descripcionCorta: attorney.descripcionCorta,
      activo: true
    });

    if (attorney.imagenUrl) {
      setImagePreview(attorney.imagenUrl);
    }

    console.log('✅ Attorney data loaded with services:', validatedServices);

    // Auto-expandir servicios padre que tienen hijos seleccionados o están seleccionados
    if (availableServices.length > 0 && validatedServices.length > 0) {
      const parentsToExpand = new Set<string>();
      validatedServices.forEach((serviceId: string) => {
        const service = getServiceById(serviceId);
        if (service) {
          // Si es hijo, expandir su padre
          if (service.parentId) {
            parentsToExpand.add(service.parentId);
          }
          // Si es padre, expandirlo
          if (service.isParent) {
            parentsToExpand.add(service.id);
          }
        }
      });
      setExpandedServices(parentsToExpand);
    }

    // Always start with General tab
    setActiveTab('general');
  }, [attorney?.id, availableServices.length]); // Dependencias estables: solo IDs y length

  // Handle services error
  useEffect(() => {
    if (servicesError) {
      toast.error(servicesError);
    }
  }, [servicesError]);

  // Handle Escape key to close modal (memoized to prevent multiple listeners)
  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      if (isServiceDropdownOpen) {
        setIsServiceDropdownOpen(false);
        setServiceSearchQuery('');
      } else {
        onCancel();
      }
    }
  }, [isServiceDropdownOpen, onCancel]);

  useEffect(() => {
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [handleEscapeKey]);

  // Handle click outside to close dropdown
  useEffect(() => {
    if (!isServiceDropdownOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Check if click is outside the dropdown container
      if (!target.closest('.service-dropdown-container')) {
        setIsServiceDropdownOpen(false);
        setServiceSearchQuery('');
      }
    };

    // Small delay to avoid closing immediately after opening
    const timer = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isServiceDropdownOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileSelect = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error('La imagen no debe superar los 10MB');
      setUploadState('error');
      setUploadError('La imagen no debe superar los 10MB');
      return;
    }
    
    // Reset upload states
    setUploadState('idle');
    setUploadProgress(0);
    setUploadError('');
    
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return formData.imagenUrl || null;

    setIsUploading(true);
    setUploadState('uploading');
    setUploadProgress(0);
    
    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 20;
      });
    }, 200);

    try {
      const url = await attorneyService.uploadAttorneyImage(imageFile);
      
      // Complete progress
      setUploadProgress(100);
      setTimeout(() => {
        setUploadState('success');
        clearInterval(progressInterval);
      }, 300);
      
      return url;
    } catch (error) {
      clearInterval(progressInterval);
      setUploadState('error');
      const errorMessage = error instanceof Error ? error.message : 'Error al subir la imagen';
      setUploadError(errorMessage);
      toast.error(errorMessage);
      console.error(error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.cargo || !formData.descripcionCorta || !formData.biografia) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    if (formData.serviciosQueAtiende.length === 0) {
      toast.error('Por favor seleccione al menos un servicio que el abogado pueda atender');
      return;
    }

    let imagenUrl = formData.imagenUrl;
    if (imageFile) {
      const uploadedUrl = await uploadImage();
      if (uploadedUrl) {
        imagenUrl = uploadedUrl;
      }
    }

    const cleanedData = {
      ...formData,
      imagenUrl,
      educacion: formData.educacion.filter(e => e.trim() !== ''),
      logros: formData.logros.filter(l => l.trim() !== ''),
      casosDestacados: formData.casosDestacados.filter(c => c.trim() !== ''),
      serviciosQueAtiende: formData.serviciosQueAtiende // Include services field
    };

    onSubmit(cleanedData);
  };

  const addArrayField = (field: 'educacion' | 'logros' | 'casosDestacados') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const updateArrayField = (field: 'educacion' | 'logros' | 'casosDestacados', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const removeArrayField = (field: 'educacion' | 'logros' | 'casosDestacados', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addCustomEspecializacion = () => {
    if (customEspecializacion.trim()) {
      setFormData(prev => {
        if (prev.especializaciones.includes(customEspecializacion.trim())) {
          return prev;
        }
        return {
          ...prev,
          especializaciones: [...prev.especializaciones, customEspecializacion.trim()]
        };
      });
      setCustomEspecializacion('');
    }
  };

  const addCustomIdioma = () => {
    if (customIdioma.trim()) {
      setFormData(prev => {
        if (prev.idiomas.includes(customIdioma.trim())) {
          return prev;
        }
        return {
          ...prev,
          idiomas: [...prev.idiomas, customIdioma.trim()]
        };
      });
      setCustomIdioma('');
    }
  };

  const removeEspecializacion = (esp: string) => {
    setFormData(prev => ({
      ...prev,
      especializaciones: prev.especializaciones.filter(e => e !== esp)
    }));
  };

  const removeIdioma = (idioma: string) => {
    setFormData(prev => ({
      ...prev,
      idiomas: prev.idiomas.filter(i => i !== idioma)
    }));
  };

  const toggleService = (serviceId: string, hasChildren: boolean) => {
    const isExpanded = expandedServices.has(serviceId);

    // Si tiene hijos y NO está expandido, mostrar hint
    if (hasChildren && !isExpanded) {
      setShowExpandHint(serviceId);
      setTimeout(() => setShowExpandHint(null), 2000);
    }

    setFormData(prevData => ({
      ...prevData,
      serviciosQueAtiende: prevData.serviciosQueAtiende.includes(serviceId)
        ? prevData.serviciosQueAtiende.filter(id => id !== serviceId)
        : [...prevData.serviciosQueAtiende, serviceId]
    }));
  };

  const toggleServiceExpansion = (serviceId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevenir que se ejecute toggleService
    setExpandedServices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId);
      } else {
        newSet.add(serviceId);
      }
      return newSet;
    });
  };

  const removeService = (serviceId: string) => {
    setFormData(prevData => ({
      ...prevData,
      serviciosQueAtiende: prevData.serviciosQueAtiende.filter(id => id !== serviceId)
    }));
  };

  // Filter services based on search query using store methods
  const filteredServices = availableServices.filter(service =>
    service.name.toLowerCase().includes(serviceSearchQuery.toLowerCase())
  );

  // Group filtered services by parent using store methods
  const parentServices = filteredServices.filter(service => service.isParent);
  const getChildServices = (parentId: string) =>
    filteredServices.filter(service => service.parentId === parentId);

  return (
    <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm sm:max-w-2xl lg:max-w-5xl max-h-[95vh] overflow-hidden flex flex-col mx-2 sm:mx-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-amber-200">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg lg:text-2xl font-bold text-slate-900 truncate pr-2">
              {attorney ? 'Editar Abogado' : 'Nuevo Abogado'}
            </h2>
            <button
              onClick={onCancel}
              className="text-slate-500 hover:text-slate-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-50">
          {[
            { key: 'general', label: 'General', fullLabel: 'General' },
            { key: 'profesional', label: 'Profesional', fullLabel: 'Profesional' },
            { key: 'academico', label: 'Académico', fullLabel: 'Formación' },
            { key: 'multimedia', label: 'Multimedia', fullLabel: 'Multimedia' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-3 sm:px-4 py-3 sm:py-4 font-medium text-sm sm:text-base transition-colors ${
                activeTab === tab.key
                  ? 'text-amber-700 border-b-2 border-amber-600 bg-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              {tab.fullLabel}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 lg:space-y-8">
            {/* General Tab */}
            {activeTab === 'general' && (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-blue-900 mb-1">Información General</h3>
                  <p className="text-sm text-blue-700">Complete la información básica del abogado</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 placeholder:text-slate-900 placeholder:opacity-90 text-slate-900 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                      Cargo *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.cargo}
                      onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 placeholder:text-slate-900 placeholder:opacity-90 text-slate-900 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.correo}
                      onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 placeholder:text-slate-900 placeholder:opacity-90 text-slate-900 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 placeholder:text-slate-900 placeholder:opacity-90 text-slate-900 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                      Años de Experiencia *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="60"
                      value={formData.experienciaAnios}
                      onChange={(e) => setFormData({ ...formData, experienciaAnios: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 placeholder:text-slate-900 placeholder:opacity-90 text-slate-900 text-sm"
                    />
                  </div>
                </div>

                {/* Services Assignment Section - Improved UX with CSS Classes */}
                <div className="service-dropdown-container">
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Servicios que puede atender *
                  </label>
                  <p className="text-xs text-slate-600 mb-4">
                    Busque y seleccione los servicios que este abogado puede atender.
                  </p>
                  
                  {servicesLoading ? (
                    <div className="flex items-center justify-center py-8 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700 mr-3"></div>
                      <span className="text-slate-600">Cargando servicios...</span>
                    </div>
                  ) : (
                    <>
                      {/* Selected Services Tags - Similar to Specializations Style */}
                      {formData.serviciosQueAtiende.length > 0 && (
                        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                          <h4 className="text-sm font-medium text-orange-900 mb-2">
                            Servicios seleccionados:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {formData.serviciosQueAtiende.map((serviceId) => {
                              const service = availableServices.find(s => s.id === serviceId);
                              if (!service) return null;
                              
                              return (
                                <span
                                  key={serviceId}
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full"
                                >
                                  {service.name}
                                  <button
                                    type="button"
                                    onClick={() => removeService(serviceId)}
                                    className="text-orange-600 hover:text-orange-900 ml-1"
                                  >
                                    ×
                                  </button>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Search and Select Interface */}
                      <div className="relative">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Haga clic para buscar y seleccionar servicios..."
                            value={serviceSearchQuery}
                            onChange={(e) => {
                              setServiceSearchQuery(e.target.value);
                              if (!isServiceDropdownOpen) {
                                setIsServiceDropdownOpen(true);
                              }
                            }}
                            onFocus={() => setIsServiceDropdownOpen(true)}
                            className="service-search-input w-full"
                          />
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                            <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <button
                              type="button"
                              onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
                              className="text-slate-400 hover:text-slate-600"
                            >
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isServiceDropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Dropdown Results - Always show when open */}
                        {isServiceDropdownOpen && (
                          <>
                            <div className="service-dropdown absolute w-full mt-2">
                              {availableServices.length === 0 ? (
                                <div className="service-dropdown-item text-center">
                                  <div className="py-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-700 mx-auto mb-2"></div>
                                    <p>Cargando servicios...</p>
                                  </div>
                                </div>
                              ) : filteredServices.length === 0 ? (
                                <div className="service-dropdown-item text-center">
                                  <p className="py-4">No se encontraron servicios que coincidan con "{serviceSearchQuery}"</p>
                                  <button
                                    type="button"
                                    onClick={() => setServiceSearchQuery('')}
                                    className="text-sm text-blue-600 hover:text-blue-700"
                                  >
                                    Ver todos los servicios
                                  </button>
                                </div>
                              ) : (
                                <>
                                  {parentServices.map(parentService => {
                                    const childServices = getChildServices(parentService.id);
                                    const isSelected = formData.serviciosQueAtiende.includes(parentService.id);
                                    
                                    return (
                                      <div key={parentService.id} className="relative">
                                        {/* Parent Service Option */}
                                        <div className={`service-dropdown-item parent-service ${isSelected ? 'selected' : ''} ${showExpandHint === parentService.id ? 'ring-2 ring-blue-400 ring-offset-1' : ''}`}>
                                          <div className="flex items-center justify-between w-full">
                                            <div
                                              onClick={() => {
                                                toggleService(parentService.id, childServices.length > 0);
                                                setServiceSearchQuery('');
                                              }}
                                              className="flex-1 flex items-center gap-3 cursor-pointer"
                                            >
                                              <div className={`status-dot ${isSelected ? 'selected' : 'unselected'}`}></div>
                                              <span>{parentService.name}</span>
                                              <span className="service-badge parent">Principal</span>
                                              {isSelected && (
                                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                              )}
                                            </div>

                                            {/* Botón de expansión/colapso */}
                                            {childServices.length > 0 && (
                                              <button
                                                type="button"
                                                onClick={(e) => toggleServiceExpansion(parentService.id, e)}
                                                className={`ml-2 p-1 hover:bg-gray-200 rounded transition-all ${showExpandHint === parentService.id ? 'bg-blue-100 ring-2 ring-blue-500 animate-pulse' : ''}`}
                                                title={expandedServices.has(parentService.id) ? "Ocultar especialidades" : "Mostrar especialidades"}
                                              >
                                                <svg
                                                  className={`w-4 h-4 transition-transform duration-200 ${expandedServices.has(parentService.id) ? 'rotate-90' : ''} ${showExpandHint === parentService.id ? 'text-blue-600' : ''}`}
                                                  fill="none"
                                                  stroke="currentColor"
                                                  viewBox="0 0 24 24"
                                                >
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                              </button>
                                            )}
                                          </div>
                                        </div>

                                        {/* Hint tooltip cuando se hace click sin expandir */}
                                        {showExpandHint === parentService.id && childServices.length > 0 && !expandedServices.has(parentService.id) && (
                                          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-lg p-3 animate-fade-in">
                                            <div className="flex items-start gap-2">
                                              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                              </svg>
                                              <div className="text-sm text-blue-800">
                                                <p className="font-semibold">💡 Este servicio tiene especialidades</p>
                                                <p className="text-xs mt-1">Usa la flecha <span className="inline-flex items-center mx-1 px-1.5 py-0.5 bg-blue-100 rounded">→</span> para ver y seleccionar especialidades</p>
                                              </div>
                                            </div>
                                          </div>
                                        )}

                                        {/* Child Services Options - Solo mostrar si está expandido */}
                                        {expandedServices.has(parentService.id) && childServices.map(childService => {
                                          const isChildSelected = formData.serviciosQueAtiende.includes(childService.id);
                                          return (
                                            <div
                                              key={childService.id}
                                              onClick={() => {
                                                toggleService(childService.id, false);
                                                setServiceSearchQuery('');
                                              }}
                                              className={`service-dropdown-item child-service ${isChildSelected ? 'selected' : ''}`}
                                            >
                                              <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                  <div className={`status-dot ${isChildSelected ? 'selected' : 'unselected'}`}></div>
                                                  <span>{childService.name}</span>
                                                  <span className="service-badge child">Especialidad</span>
                                                </div>
                                                {isChildSelected && (
                                                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                  </svg>
                                                )}
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    );
                                  })}
                                  
                                  {/* Close dropdown button */}
                                  <div className="border-t border-slate-200 p-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setIsServiceDropdownOpen(false);
                                        setServiceSearchQuery('');
                                      }}
                                      className="w-full text-center py-2 text-sm text-slate-500 hover:text-slate-700 font-medium"
                                    >
                                      Cerrar lista
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 mt-2">
                        {formData.serviciosQueAtiende.length === 0
                          ? 'Debe seleccionar al menos un servicio'
                          : `${formData.serviciosQueAtiende.length} servicio${formData.serviciosQueAtiende.length === 1 ? '' : 's'} seleccionado${formData.serviciosQueAtiende.length === 1 ? '' : 's'}`
                        }
                      </p>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.esSocio}
                      onChange={(e) => setFormData({ ...formData, esSocio: e.target.checked })}
                      className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-xs sm:text-sm font-medium text-slate-700">Es Socio de la Firma</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Descripción Corta * (máx. 200 caracteres)
                  </label>
                  <textarea
                    required
                    maxLength={200}
                    value={formData.descripcionCorta}
                    onChange={(e) => setFormData({ ...formData, descripcionCorta: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 placeholder:text-slate-900 placeholder:opacity-90 text-slate-900"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {formData.descripcionCorta.length}/200 caracteres
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Biografía * (máx. 2000 caracteres)
                  </label>
                  <textarea
                    required
                    maxLength={2000}
                    value={formData.biografia}
                    onChange={(e) => setFormData({ ...formData, biografia: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 placeholder:text-slate-900 placeholder:opacity-90 text-slate-900"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {formData.biografia.length}/2000 caracteres
                  </p>
                </div>
              </>
            )}

            {/* Profesional Tab */}
            {activeTab === 'profesional' && (
              <>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-amber-900 mb-1">Información Profesional</h3>
                  <p className="text-sm text-amber-700">Especializaciones, idiomas y experiencia profesional</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Especializaciones *
                  </label>
                  
                  {/* Selected Specializations */}
                  {formData.especializaciones.length > 0 && (
                    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <h4 className="text-sm font-medium text-amber-900 mb-2">Especializaciones seleccionadas:</h4>
                      <div className="flex flex-wrap gap-2">
                        {formData.especializaciones.map((esp, index) => (
                          <span 
                            key={index} 
                            className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full"
                          >
                            {esp}
                            <button
                              type="button"
                              onClick={() => removeEspecializacion(esp)}
                              className="text-amber-600 hover:text-amber-900 ml-1"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto bg-stone-50 p-4 rounded-lg border border-stone-200">
                    {especializacionesOptions.map((esp) => (
                      <label key={esp} className="flex items-start gap-3 cursor-pointer hover:bg-white p-2 rounded transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.especializaciones.includes(esp)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({ ...prev, especializaciones: [...prev.especializaciones, esp] }));
                            } else {
                              setFormData(prev => ({ ...prev, especializaciones: prev.especializaciones.filter(e => e !== esp) }));
                            }
                          }}
                          className="w-4 h-4 text-amber-600 border-stone-300 rounded focus:ring-amber-500 mt-0.5"
                        />
                        <span className="text-sm text-slate-700 leading-relaxed">{esp}</span>
                      </label>
                    ))}
                  </div>

                  {/* Add Custom Specialization */}
                  <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Agregar otra especialización:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customEspecializacion}
                        onChange={(e) => setCustomEspecializacion(e.target.value)}
                        placeholder="Escriba la especialización"
                        className="flex-1 px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 placeholder:text-slate-900 placeholder:opacity-90 text-slate-900"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addCustomEspecializacion();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={addCustomEspecializacion}
                        className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                      >
                        Agregar
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mt-2">
                    Seleccionadas: {formData.especializaciones.length}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Idiomas *
                  </label>

                  {/* Selected Languages */}
                  {formData.idiomas.length > 0 && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-900 mb-2">Idiomas seleccionados:</h4>
                      <div className="flex flex-wrap gap-2">
                        {formData.idiomas.map((idioma, index) => (
                          <span 
                            key={index} 
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                          >
                            {idioma}
                            <button
                              type="button"
                              onClick={() => removeIdioma(idioma)}
                              className="text-blue-600 hover:text-blue-900 ml-1"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-3 bg-stone-50 p-4 rounded-lg border border-stone-200">
                    {idiomasOptions.map((idioma) => (
                      <label key={idioma} className="flex items-start gap-3 cursor-pointer hover:bg-white p-2 rounded transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.idiomas.includes(idioma)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({ ...prev, idiomas: [...prev.idiomas, idioma] }));
                            } else {
                              setFormData(prev => ({ ...prev, idiomas: prev.idiomas.filter(i => i !== idioma) }));
                            }
                          }}
                          className="w-4 h-4 text-amber-600 border-stone-300 rounded focus:ring-amber-500 mt-0.5"
                        />
                        <span className="text-sm text-slate-700 leading-relaxed">{idioma}</span>
                      </label>
                    ))}
                  </div>

                  {/* Add Custom Language */}
                  <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Agregar otro idioma:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customIdioma}
                        onChange={(e) => setCustomIdioma(e.target.value)}
                        placeholder="Escriba el idioma"
                        className="flex-1 px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 placeholder:text-slate-900 placeholder:opacity-90 text-slate-900"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addCustomIdioma();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={addCustomIdioma}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Agregar
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mt-2">
                    Seleccionados: {formData.idiomas.length}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Casos Destacados
                  </label>
                  {formData.casosDestacados.map((caso, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={caso}
                        onChange={(e) => updateArrayField('casosDestacados', index, e.target.value)}
                        placeholder="Descripción breve del caso"
                        className="flex-1 px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      />
                      {formData.casosDestacados.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayField('casosDestacados', index)}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayField('casosDestacados')}
                    className="text-sm text-amber-600 hover:text-amber-700"
                  >
                    + Agregar caso destacado
                  </button>
                </div>
              </>
            )}

            {/* Academico Tab */}
            {activeTab === 'academico' && (
              <>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-green-900 mb-1">Formación y Logros</h3>
                  <p className="text-sm text-green-700">Educación, logros destacados y casos relevantes</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Educación
                  </label>
                  {formData.educacion.map((edu, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={edu}
                        onChange={(e) => updateArrayField('educacion', index, e.target.value)}
                        placeholder="Licenciatura en Derecho - UNAM"
                        className="flex-1 px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 placeholder:text-slate-900 placeholder:opacity-90 text-slate-900"
                      />
                      {formData.educacion.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayField('educacion', index)}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayField('educacion')}
                    className="text-sm text-amber-600 hover:text-amber-700"
                  >
                    + Agregar educación
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Logros Destacados
                  </label>
                  {formData.logros.map((logro, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={logro}
                        onChange={(e) => updateArrayField('logros', index, e.target.value)}
                        placeholder="Reconocimiento o premio destacado"
                        className="flex-1 px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      />
                      {formData.logros.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayField('logros', index)}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayField('logros')}
                    className="text-sm text-amber-600 hover:text-amber-700"
                  >
                    + Agregar logro
                  </button>
                </div>
              </>
            )}

            {/* Multimedia Tab */}
            {activeTab === 'multimedia' && (
              <>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-purple-900 mb-1">Imagen y Enlaces</h3>
                  <p className="text-sm text-purple-700">Foto de perfil y enlaces a redes sociales</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-4">
                    Foto de Perfil
                  </label>
                  
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mb-6 flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-green-800">Imagen seleccionada</p>
                        <p className="text-sm text-green-600">
                          {imageFile?.name} ({imageFile ? (imageFile.size / (1024 * 1024)).toFixed(2) : 0} MB)
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview('');
                          setUploadState('idle');
                          setUploadProgress(0);
                          setUploadError('');
                        }}
                        className="text-green-600 hover:text-green-800 p-1"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Drag & Drop Upload */}
                  <DragDropUpload
                    onFileSelect={handleFileSelect}
                    accept="image/*"
                    maxSize={10 * 1024 * 1024} // 10MB
                    supportedFormats={['JPG', 'PNG', 'WebP', 'GIF']}
                    uploadState={uploadState}
                    uploadProgress={uploadProgress}
                    uploadError={uploadError}
                    disabled={isUploading}
                    className="mb-6"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    value={formData.linkedIn}
                    onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                    placeholder="https://linkedin.com/in/usuario"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 placeholder:text-slate-900 placeholder:opacity-90 text-slate-900"
                  />
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-6 py-2 border border-stone-300 text-slate-700 rounded-lg hover:bg-stone-100 text-sm touch-target order-2 sm:order-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="w-full sm:w-auto px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 text-sm touch-target order-1 sm:order-2"
            >
              {isUploading ? 'Subiendo imagen...' : (attorney ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}