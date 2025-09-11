'use client';

import { useState, useEffect } from 'react';
import { CitationConfig, BlogPostCitation, ArticleReference, DEFAULT_CITATION_TEMPLATES, generateDefaultCitations } from '@/app/lib/domain/entities/Citation';
import BulkCitationImporter from './BulkCitationImporter';
import BulkReferenceImporter from './BulkReferenceImporter';

interface CitationManagerProps {
  citationConfig: CitationConfig;
  onCitationConfigChange: (config: CitationConfig) => void;
  postTitle: string;
  publishedAt?: Date;
  postSlug: string;
}

export default function CitationManager({
  citationConfig,
  onCitationConfigChange,
  postTitle,
  publishedAt,
  postSlug
}: CitationManagerProps) {
  const [config, setConfig] = useState<CitationConfig>(citationConfig);
  const [activeTab, setActiveTab] = useState<string>('apa');
  const [activeSection, setActiveSection] = useState<'citations' | 'references'>('citations');

  // Generate URL for this post
  const generatePostUrl = () => {
    return `${window.location.origin}/blog/${postSlug}`;
  };

  // Generate default citations when enabled
  const handleGenerateDefaults = () => {
    if (!publishedAt) return;
    
    const author = config.customAuthor || 'ALTUM Legal';
    const title = config.customTitle || postTitle;
    const url = generatePostUrl();
    
    const defaultCitations = generateDefaultCitations(title, publishedAt, url, author);
    
    const updatedConfig = {
      ...config,
      citations: defaultCitations
    };
    
    setConfig(updatedConfig);
    onCitationConfigChange(updatedConfig);
  };

  // Handle enabling/disabling citations
  const handleToggleEnabled = (enabled: boolean) => {
    const updatedConfig = { ...config, enabled };
    
    if (enabled && config.citations.length === 0 && publishedAt) {
      // Auto-generate default citations when first enabled
      const author = config.customAuthor || 'ALTUM Legal';
      const title = config.customTitle || postTitle;
      const url = generatePostUrl();
      
      updatedConfig.citations = generateDefaultCitations(title, publishedAt, url, author);
    }
    
    setConfig(updatedConfig);
    onCitationConfigChange(updatedConfig);
  };

  // Handle custom field changes
  const handleCustomFieldChange = (field: keyof CitationConfig, value: string) => {
    const updatedConfig = { ...config, [field]: value };
    setConfig(updatedConfig);
    onCitationConfigChange(updatedConfig);
  };

  // Handle individual citation changes
  const handleCitationChange = (format: string, citation: string) => {
    const updatedCitations = config.citations.map(c => 
      c.format === format 
        ? { ...c, citation, isCustom: true }
        : c
    );
    
    const updatedConfig = { ...config, citations: updatedCitations };
    setConfig(updatedConfig);
    onCitationConfigChange(updatedConfig);
  };

  // Handle bulk import of citations
  const handleBulkImport = (importedCitations: BlogPostCitation[]) => {
    const updatedConfig = {
      ...config,
      citations: importedCitations
    };
    
    setConfig(updatedConfig);
    onCitationConfigChange(updatedConfig);
  };

  // Handle bulk import of references
  const handleBulkReferenceImport = (importedReferences: ArticleReference[]) => {
    const updatedConfig = {
      ...config,
      references: importedReferences
    };
    
    setConfig(updatedConfig);
    onCitationConfigChange(updatedConfig);
  };

  // Get citation for current tab
  const getCurrentCitation = () => {
    return config.citations.find(c => c.format === activeTab);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Gestión de Citas Académicas</h3>
          <p className="text-sm text-gray-500 mt-1">
            Configure las citas académicas que se mostrarán en el artículo publicado
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => handleToggleEnabled(e.target.checked)}
              className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              Habilitar citas
            </span>
          </label>
        </div>
      </div>

      {config.enabled && (
        <>
          {/* Section Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveSection('citations')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeSection === 'citations'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📄 Citas para Lectores
                <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                  Para que citen este artículo
                </span>
              </button>
              <button
                onClick={() => setActiveSection('references')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeSection === 'references'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📚 Referencias del Artículo
                <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                  Fuentes consultadas
                </span>
              </button>
            </nav>
          </div>

          {activeSection === 'citations' && (
            <>
              {/* Custom Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Autor personalizado
              </label>
              <input
                type="text"
                value={config.customAuthor || ''}
                onChange={(e) => handleCustomFieldChange('customAuthor', e.target.value)}
                placeholder="ALTUM Legal"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título personalizado
              </label>
              <input
                type="text"
                value={config.customTitle || ''}
                onChange={(e) => handleCustomFieldChange('customTitle', e.target.value)}
                placeholder={postTitle}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha personalizada
              </label>
              <input
                type="text"
                value={config.customDate || ''}
                onChange={(e) => handleCustomFieldChange('customDate', e.target.value)}
                placeholder={publishedAt ? new Intl.DateTimeFormat('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }).format(publishedAt) : 'Fecha de publicación'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm"
              />
            </div>
          </div>

          {/* Generate Button and Bulk Import */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-3">
              <button
                onClick={handleGenerateDefaults}
                className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 text-sm font-medium"
              >
                Regenerar citas por defecto
              </button>
              
              <BulkCitationImporter 
                onImport={handleBulkImport}
                existingCitations={config.citations}
              />
            </div>
            
            <span className="text-xs text-gray-500">
              {config.citations.length} formato{config.citations.length !== 1 ? 's' : ''} configurado{config.citations.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Citation Tabs */}
          {config.citations.length > 0 && (
            <div>
              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {DEFAULT_CITATION_TEMPLATES.map((template) => {
                    const citation = config.citations.find(c => c.format === template.id);
                    return (
                      <button
                        key={template.id}
                        onClick={() => setActiveTab(template.id)}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === template.id
                            ? 'border-amber-500 text-amber-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {template.name}
                        {citation?.isCustom && (
                          <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Personalizada
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="mt-4">
                {(() => {
                  const template = DEFAULT_CITATION_TEMPLATES.find(t => t.id === activeTab);
                  const citation = getCurrentCitation();
                  
                  if (!template || !citation) return null;
                  
                  return (
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Cita en formato {template.name}
                          </label>
                          <span className="text-xs text-gray-500">
                            {template.description}
                          </span>
                        </div>
                        
                        <textarea
                          value={citation.citation}
                          onChange={(e) => handleCitationChange(activeTab, e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm font-mono"
                          placeholder={`Cita en formato ${template.name}...`}
                        />
                      </div>
                      
                      {/* Example */}
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <p className="text-xs font-medium text-blue-800 mb-1">Ejemplo de formato {template.name}:</p>
                        <p className="text-xs text-blue-700 font-mono">{template.example}</p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
            </>
          )}

          {activeSection === 'references' && (
            <>
              {/* References Section */}
              <div className="space-y-6">
                {/* Import Button */}
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Referencias del Artículo</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Fuentes consultadas y utilizadas en la elaboración de este artículo
                    </p>
                  </div>
                  
                  <BulkReferenceImporter 
                    onImport={handleBulkReferenceImport}
                    existingReferences={config.references || []}
                  />
                </div>

                {/* References List */}
                {config.references && config.references.length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(config.references.reduce((acc: Record<string, ArticleReference[]>, ref) => {
                      if (!acc[ref.category]) {
                        acc[ref.category] = [];
                      }
                      acc[ref.category].push(ref);
                      return acc;
                    }, {})).map(([category, refs]) => {
                      const categoryNames: Record<string, string> = {
                        'academicas': 'Fuentes Académicas',
                        'periodisticas': 'Fuentes Periodísticas', 
                        'gubernamentales': 'Fuentes Gubernamentales',
                        'legales': 'Fuentes Legales Especializadas',
                        'internacionales': 'Organizaciones Internacionales',
                        'derechos-humanos': 'Organizaciones de Derechos Humanos',
                        'enciclopedicas': 'Referencias Enciclopédicas',
                        'general': 'Referencias Generales'
                      };

                      return (
                        <div key={category} className="p-4 bg-gray-50 rounded-lg border">
                          <h5 className="font-medium text-gray-800 mb-3 border-b border-gray-200 pb-2">
                            {categoryNames[category]} ({refs.length})
                          </h5>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {refs.map((ref, index) => (
                              <div key={index} className="text-xs text-gray-700 font-mono bg-white p-2 rounded border">
                                {ref.text}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">
                      No hay referencias configuradas para este artículo
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Usa el botón "Importar Referencias" para agregar las fuentes consultadas
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}

      {!config.enabled && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-2 text-sm text-gray-500">
            Las citas académicas están deshabilitadas para este artículo
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Habilítalas para permitir que los lectores citen este artículo en trabajos académicos
          </p>
        </div>
      )}
    </div>
  );
}