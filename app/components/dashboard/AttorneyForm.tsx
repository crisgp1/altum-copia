'use client';

import { useState, useEffect } from 'react';
import { AttorneyPublicDTO } from '@/app/lib/application/dtos/AttorneyDTO';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface AttorneyFormProps {
  attorney: AttorneyPublicDTO | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
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

export default function AttorneyForm({ attorney, onSubmit, onCancel }: AttorneyFormProps) {
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
  }, [attorney]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen no debe superar los 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return formData.imagenUrl || null;

    setIsUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', imageFile);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!response.ok) throw new Error('Error al subir imagen');

      const data = await response.json();
      return data.url;
    } catch (error) {
      toast.error('Error al subir la imagen');
      console.error(error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.nombre || !formData.cargo || !formData.descripcionCorta || !formData.biografia) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    // Subir imagen si hay una nueva
    let imagenUrl = formData.imagenUrl;
    if (imageFile) {
      const uploadedUrl = await uploadImage();
      if (uploadedUrl) {
        imagenUrl = uploadedUrl;
      }
    }

    // Limpiar arrays vacíos
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {attorney ? 'Editar Abogado' : 'Nuevo Abogado'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Imagen de perfil */}
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto de Perfil
              </label>
              <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-2 text-sm"
              />
              {isUploading && (
                <p className="text-sm text-blue-600 mt-1">Subiendo imagen...</p>
              )}
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cargo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.cargo}
                  onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  required
                  value={formData.correo}
                  onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Información profesional */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Años de Experiencia *
              </label>
              <input
                type="number"
                required
                min="0"
                max="60"
                value={formData.experienciaAnios}
                onChange={(e) => setFormData({ ...formData, experienciaAnios: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn
              </label>
              <input
                type="url"
                value={formData.linkedIn}
                onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Es Socio */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="esSocio"
              checked={formData.esSocio}
              onChange={(e) => setFormData({ ...formData, esSocio: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="esSocio" className="text-sm font-medium text-gray-700">
              Es Socio de la Firma
            </label>
          </div>

          {/* Especializaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Especializaciones *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {especializacionesOptions.map((esp) => (
                <label key={esp} className="flex items-center gap-2">
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
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm">{esp}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Idiomas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Idiomas *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {idiomasOptions.map((idioma) => (
                <label key={idioma} className="flex items-center gap-2">
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
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm">{idioma}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Descripción corta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción Corta * (máx. 200 caracteres)
            </label>
            <textarea
              required
              maxLength={200}
              value={formData.descripcionCorta}
              onChange={(e) => setFormData({ ...formData, descripcionCorta: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.descripcionCorta.length}/200 caracteres
            </p>
          </div>

          {/* Biografía */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Biografía * (máx. 2000 caracteres)
            </label>
            <textarea
              required
              maxLength={2000}
              value={formData.biografia}
              onChange={(e) => setFormData({ ...formData, biografia: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.biografia.length}/2000 caracteres
            </p>
          </div>

          {/* Educación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Educación
            </label>
            {formData.educacion.map((edu, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={edu}
                  onChange={(e) => updateArrayField('educacion', index, e.target.value)}
                  placeholder="Ej: Licenciatura en Derecho - UNAM"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              + Agregar educación
            </button>
          </div>

          {/* Logros */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logros Destacados
            </label>
            {formData.logros.map((logro, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={logro}
                  onChange={(e) => updateArrayField('logros', index, e.target.value)}
                  placeholder="Ej: Mejor Abogado Corporativo 2023"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              + Agregar logro
            </button>
          </div>

          {/* Casos Destacados */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Casos Destacados
            </label>
            {formData.casosDestacados.map((caso, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={caso}
                  onChange={(e) => updateArrayField('casosDestacados', index, e.target.value)}
                  placeholder="Ej: Fusión empresa X con empresa Y"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              + Agregar caso destacado
            </button>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isUploading ? 'Subiendo imagen...' : (attorney ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}