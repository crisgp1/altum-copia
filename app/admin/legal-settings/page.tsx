'use client';

import { useState, useEffect } from 'react';
import { Save, Eye, AlertCircle, FileText, Shield, Megaphone } from 'lucide-react';
import toast from 'react-hot-toast';
import DraftJsEditor from '@/app/components/admin/DraftJsEditor';

interface LegalContent {
  id: string;
  type: 'terms' | 'privacy';
  title: string;
  content: string;
  bannerText?: string;
  bannerActive: boolean;
  lastUpdated: string;
}

// Content Editor Component
function ContentEditor({ content, onContentChange }: { 
  content: LegalContent, 
  onContentChange: (content: string) => void 
}) {
  return (
    <DraftJsEditor
      value={content.content}
      onChange={onContentChange}
      placeholder={`Contenido completo de ${content.type === 'terms' ? 'términos y condiciones' : 'política de privacidad'}`}
    />
  );
}

export default function LegalSettingsPage() {
  const [legalContents, setLegalContents] = useState<LegalContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms');

  useEffect(() => {
    fetchLegalContents();
  }, []);

  const fetchLegalContents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/legal-content');
      if (response.ok) {
        const data = await response.json();
        setLegalContents(data);
      }
    } catch (error) {
      console.error('Error fetching legal contents:', error);
      toast.error('Error al cargar el contenido legal');
    } finally {
      setIsLoading(false);
    }
  };

  const updateLegalContent = async (type: 'terms' | 'privacy', updates: Partial<LegalContent>) => {
    try {
      setIsSaving(type);
      const response = await fetch('/api/legal-content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, ...updates })
      });

      if (response.ok) {
        toast.success(`${type === 'terms' ? 'Términos y Condiciones' : 'Política de Privacidad'} actualizado`);
        fetchLegalContents();
      } else {
        toast.error('Error al actualizar el contenido');
      }
    } catch (error) {
      console.error('Error updating legal content:', error);
      toast.error('Error al actualizar el contenido');
    } finally {
      setIsSaving(null);
    }
  };

  const currentContent = legalContents.find(content => content.type === activeTab);

  const handleSave = (type: 'terms' | 'privacy') => {
    const formData = new FormData(document.getElementById(`${type}-form`) as HTMLFormElement);
    const currentContentData = legalContents.find(c => c.type === type);
    const updates = {
      title: formData.get('title') as string,
      content: currentContentData?.content || '',
      bannerText: formData.get('bannerText') as string,
      bannerActive: formData.get('bannerActive') === 'on'
    };
    updateLegalContent(type, updates);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-medium text-gray-800">Cargando configuración legal...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Shield className="w-7 h-7 mr-3 text-blue-600" />
                  Configuración Legal
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Gestiona términos, condiciones, privacidad y banners informativos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('terms')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-300 ${
                activeTab === 'terms'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Términos y Condiciones
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-300 ${
                activeTab === 'privacy'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Shield className="w-4 h-4 inline mr-2" />
              Política de Privacidad
            </button>
          </nav>
        </div>

        {/* Content Form */}
        {currentContent ? (
          <form id={`${activeTab}-form`} className="space-y-8">
            <div className="bg-white shadow-sm rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  {activeTab === 'terms' ? 'Términos y Condiciones' : 'Política de Privacidad'}
                </h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Título del Documento
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    defaultValue={currentContent.title}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Título de ${activeTab === 'terms' ? 'Términos y Condiciones' : 'Política de Privacidad'}`}
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contenido del Documento
                  </label>
                  <ContentEditor 
                    content={currentContent} 
                    onContentChange={(updatedContent) => {
                      setLegalContents(prev => 
                        prev.map(item => 
                          item.type === activeTab ? { ...item, content: updatedContent } : item
                        )
                      );
                    }}
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Editor enriquecido con soporte para formato visual. Acepta HTML y texto estructurado.
                  </p>
                </div>
              </div>
            </div>

            {/* Banner Configuration */}
            <div className="bg-white shadow-sm rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <Megaphone className="w-5 h-5 mr-2 text-amber-600" />
                  Banner Informativo
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Configura un banner que aparecerá en el sitio para notificar sobre actualizaciones
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* Banner Active Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="bannerActive" className="block text-sm font-medium text-gray-700">
                      Mostrar Banner
                    </label>
                    <p className="text-xs text-gray-500">
                      Activa el banner para informar sobre cambios en {activeTab === 'terms' ? 'términos' : 'privacidad'}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    name="bannerActive"
                    id="bannerActive"
                    defaultChecked={currentContent.bannerActive}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>

                {/* Banner Text */}
                <div>
                  <label htmlFor="bannerText" className="block text-sm font-medium text-gray-700 mb-2">
                    Texto del Banner
                  </label>
                  <textarea
                    name="bannerText"
                    id="bannerText"
                    rows={3}
                    defaultValue={currentContent.bannerText || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Mensaje a mostrar sobre actualizaciones de ${activeTab === 'terms' ? 'términos y condiciones' : 'política de privacidad'}`}
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Ejemplo: "Hemos actualizado nuestros términos y condiciones. Revisa los cambios aquí."
                  </p>
                </div>

                {/* Banner Preview */}
                {currentContent.bannerActive && currentContent.bannerText && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-amber-800 mb-2 flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      Vista Previa del Banner
                    </h4>
                    <div className="bg-amber-100 border-l-4 border-amber-500 p-4 rounded">
                      <div className="flex">
                        <AlertCircle className="h-5 w-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800">{currentContent.bannerText}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Última actualización: {new Date(currentContent.lastUpdated).toLocaleDateString('es-MX', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => window.open(`/${activeTab}`, '_blank')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Vista Previa
                </button>
                <button
                  type="button"
                  onClick={() => handleSave(activeTab)}
                  disabled={isSaving === activeTab}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                >
                  {isSaving === activeTab ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Guardar Cambios
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="bg-white shadow-sm rounded-lg p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay contenido disponible</h3>
            <p className="text-gray-500">Selecciona una pestaña para comenzar a editar el contenido legal.</p>
          </div>
        )}
      </div>
    </div>
  );
}