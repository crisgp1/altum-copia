'use client';

import { useState, useEffect } from 'react';
import { AttorneyResponseDTO } from '@/app/lib/application/dtos/AttorneyDTO';
import { AttorneyService } from '@/app/lib/application/services/AttorneyService';
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

  useEffect(() => {
    if (attorney) {
      setFormData({
        nombre: attorney.nombre,
        cargo: attorney.cargo,
        especializaciones: attorney.especializaciones,
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
    }
    // Always start with General tab
    setActiveTab('general');
  }, [attorney]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onCancel]);

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
    if (customEspecializacion.trim() && !formData.especializaciones.includes(customEspecializacion.trim())) {
      setFormData({ 
        ...formData, 
        especializaciones: [...formData.especializaciones, customEspecializacion.trim()] 
      });
      setCustomEspecializacion('');
    }
  };

  const addCustomIdioma = () => {
    if (customIdioma.trim() && !formData.idiomas.includes(customIdioma.trim())) {
      setFormData({ 
        ...formData, 
        idiomas: [...formData.idiomas, customIdioma.trim()] 
      });
      setCustomIdioma('');
    }
  };

  const removeEspecializacion = (esp: string) => {
    setFormData({ 
      ...formData, 
      especializaciones: formData.especializaciones.filter(e => e !== esp) 
    });
  };

  const removeIdioma = (idioma: string) => {
    setFormData({ 
      ...formData, 
      idiomas: formData.idiomas.filter(i => i !== idioma) 
    });
  };

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
                              setFormData({ ...formData, especializaciones: [...formData.especializaciones, esp] });
                            } else {
                              setFormData({ ...formData, especializaciones: formData.especializaciones.filter(e => e !== esp) });
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
                              setFormData({ ...formData, idiomas: [...formData.idiomas, idioma] });
                            } else {
                              setFormData({ ...formData, idiomas: formData.idiomas.filter(i => i !== idioma) });
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