'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserRole } from '@/app/lib/hooks/useUserRole';
import { PostStatus } from '@/app/lib/domain/entities/BlogPost';
import DraftJsEditor from '@/app/components/admin/DraftJsEditor';
import { BlogImageUpload } from '@/app/components/admin/BlogImageUpload';
import toast from 'react-hot-toast';

interface FormatConfig {
  lineHeight: number;
  paragraphSpacing: number;
}

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  authorId: string;
  hasExternalCollaborator: boolean;
  externalCollaboratorName: string;
  externalCollaboratorTitle: string;
  categoryId: string;
  tags: string[];
  status: PostStatus;
  seoTitle: string;
  seoDescription: string;
  publishedAt?: Date;
  formatConfig: FormatConfig;
}

interface Attorney {
  id: string;
  nombre: string;
  cargo: string;
  imagenUrl?: string;
  descripcionCorta: string;
  tipo?: string; // 'Socio' | 'Colaborador'
}

// Suggested categories for autocomplete
const suggestedCategories = [
  'Derecho Corporativo',
  'Derecho Fiscal', 
  'Derecho Digital',
  'Derecho Internacional',
  'Propiedad Intelectual',
  'Compliance',
  'Derecho Laboral',
  'Derecho Inmobiliario',
  'Derecho Penal',
  'Derecho Civil'
];

export default function NewBlogPost() {
  const router = useRouter();
  const { user, hasPermission } = useUserRole();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'settings'>('content');
  const [attorneys, setAttorneys] = useState<Attorney[]>([]);
  const [loadingAttorneys, setLoadingAttorneys] = useState(true);
  
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    authorId: '',
    hasExternalCollaborator: false,
    externalCollaboratorName: '',
    externalCollaboratorTitle: '',
    categoryId: '',
    tags: [],
    status: PostStatus.DRAFT,
    seoTitle: '',
    seoDescription: '',
    formatConfig: { lineHeight: 1.4, paragraphSpacing: 0.5 }
  });

  const [tagInput, setTagInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);

  // Fetch attorneys on component mount
  useEffect(() => {
    const fetchAttorneys = async () => {
      try {
        setLoadingAttorneys(true);
        const response = await fetch('/api/attorneys/all-members');
        if (response.ok) {
          const data = await response.json();
          setAttorneys(data);
        } else {
          toast.error('Error al cargar el equipo legal');
        }
      } catch (error) {
        console.error('Error fetching attorneys:', error);
        toast.error('Error al cargar el equipo legal');
      } finally {
        setLoadingAttorneys(false);
      }
    };

    fetchAttorneys();
  }, []);

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  };

  const handleInputChange = (field: keyof BlogFormData, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-generate slug when title changes
      if (field === 'title' && !prev.slug) {
        updated.slug = generateSlug(value);
      }
      
      // Auto-generate SEO title if empty
      if (field === 'title' && !prev.seoTitle) {
        updated.seoTitle = value;
      }
      
      // Auto-generate SEO description from excerpt if empty
      if (field === 'excerpt' && !prev.seoDescription) {
        updated.seoDescription = value;
      }
      
      return updated;
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      handleInputChange('tags', [...formData.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  // Handle category input changes
  const handleCategoryInputChange = (value: string) => {
    setCategoryInput(value);
    handleInputChange('categoryId', value);
    
    if (value.trim()) {
      const filtered = suggestedCategories.filter(category => 
        category.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCategories(filtered);
      setShowCategorySuggestions(filtered.length > 0);
    } else {
      setShowCategorySuggestions(false);
    }
  };

  const selectCategory = (category: string) => {
    setCategoryInput(category);
    handleInputChange('categoryId', category);
    setShowCategorySuggestions(false);
  };


  const handleSubmit = async (status: PostStatus) => {
    if (!hasPermission('create_content')) {
      toast.error('No tienes permisos para crear contenido');
      return;
    }

    // Validate required fields
    if (!formData.title.trim()) {
      toast.error('El título es requerido');
      return;
    }

    if (!formData.content.trim()) {
      toast.error('El contenido es requerido');
      return;
    }

    if (!formData.categoryId) {
      toast.error('La categoría es requerida');
      return;
    }

    if (!formData.authorId) {
      toast.error('Debes seleccionar un autor (abogado de la firma)');
      return;
    }
    
    if (formData.hasExternalCollaborator && !formData.externalCollaboratorName.trim()) {
      toast.error('Debes escribir el nombre del colaborador externo');
      return;
    }

    setIsLoading(true);
    
    try {
      const postData = {
        ...formData,
        status,
        publishedAt: status === PostStatus.PUBLISHED ? new Date() : undefined
      };

      const response = await fetch('/api/blog/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(`Post ${status === PostStatus.PUBLISHED ? 'publicado' : 'guardado como borrador'} exitosamente!`);
        router.push('/admin/blog');
      } else {
        toast.error(result.error || 'Error al crear el post');
      }
      
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Error al crear el post');
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasPermission('create_content')) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-4">
          Sin permisos de creación
        </h1>
        <p className="text-slate-600">
          No tienes permisos para crear contenido.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">Nuevo Post</h1>
          <p className="text-slate-600 mt-1 text-sm sm:text-base">Crea un nuevo artículo para el blog</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <button
            onClick={() => router.back()}
            className="px-3 sm:px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm sm:text-base order-3 sm:order-1"
          >
            Cancelar
          </button>
          <button
            onClick={() => handleSubmit(PostStatus.DRAFT)}
            disabled={isLoading || !formData.title.trim()}
            className="px-4 sm:px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base order-2"
          >
            {isLoading ? 'Guardando...' : 'Guardar Borrador'}
          </button>
          <button
            onClick={() => handleSubmit(PostStatus.PUBLISHED)}
            disabled={
              isLoading || 
              !formData.title.trim() || 
              !formData.content.trim() || 
              !formData.categoryId ||
              !formData.authorId ||
              (formData.hasExternalCollaborator && !formData.externalCollaboratorName.trim())
            }
            className="px-4 sm:px-6 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base order-1 sm:order-3"
            style={{ backgroundColor: '#B79F76' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9C8A6B'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#B79F76'}
          >
            {isLoading ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-6">
          {/* Tabs */}
          <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-stone-200">
            <div className="border-b border-stone-200">
              <nav className="flex space-x-4 sm:space-x-6 lg:space-x-8 px-3 sm:px-4 lg:px-6 overflow-x-auto" aria-label="Tabs">
                {[
                  { id: 'content', name: 'Contenido', icon: '📝' },
                  { id: 'seo', name: 'SEO', icon: '🔍' },
                  { id: 'settings', name: 'Configuración', icon: '⚙️' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-shrink-0 py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm ${
                      activeTab === tab.id
                        ? 'border-amber-500 text-amber-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    } transition-colors`}
                  >
                    <span className="mr-1 sm:mr-2">{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.name}</span>
                    <span className="sm:hidden">{tab.name.substring(0, 4)}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-3 sm:p-4 lg:p-6">
              {/* Content Tab */}
              {activeTab === 'content' && (
                <div className="space-y-4 sm:space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Título del Post *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Ingresa el título del post..."
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base sm:text-lg text-slate-900 placeholder:text-slate-400"
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      URL Slug
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-2 sm:px-3 text-xs sm:text-sm text-slate-500 bg-slate-50 border border-r-0 border-stone-300 rounded-l-lg">
                        /blog/
                      </span>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => handleInputChange('slug', generateSlug(e.target.value))}
                        placeholder="url-del-post"
                        className="flex-1 px-3 sm:px-4 py-2 border border-stone-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900 placeholder:text-slate-400 text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Extracto
                    </label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => handleInputChange('excerpt', e.target.value)}
                      placeholder="Breve descripción del post..."
                      rows={3}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900 placeholder:text-slate-400 text-sm sm:text-base"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      {formData.excerpt.length}/200 caracteres recomendados
                    </p>
                  </div>

                  {/* Category */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Categoría *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={categoryInput}
                        onChange={(e) => handleCategoryInputChange(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (filteredCategories.length > 0 && showCategorySuggestions) {
                              selectCategory(filteredCategories[0]);
                            } else if (categoryInput.trim()) {
                              selectCategory(categoryInput.trim());
                            }
                          }
                        }}
                        onFocus={() => {
                          if (filteredCategories.length > 0) {
                            setShowCategorySuggestions(true);
                          }
                        }}
                        onBlur={() => {
                          // Delay to allow click on suggestions
                          setTimeout(() => setShowCategorySuggestions(false), 200);
                        }}
                        placeholder="Escribe una categoría y presiona Enter..."
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm sm:text-base ${
                          !formData.categoryId 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-white' 
                            : 'border-green-300 focus:ring-green-500 focus:border-green-500 bg-green-50'
                        } text-slate-900 placeholder:text-slate-400`}
                      />
                      
                      {/* Success Icon */}
                      {formData.categoryId && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {/* Selected Category Badge */}
                    {formData.categoryId && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          {formData.categoryId}
                          <button
                            type="button"
                            onClick={() => {
                              setCategoryInput('');
                              handleInputChange('categoryId', '');
                            }}
                            className="ml-2 inline-flex items-center justify-center w-4 h-4 text-green-600 hover:text-green-800 hover:bg-green-200 rounded-full transition-colors"
                            title="Quitar categoría"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      </div>
                    )}
                    
                    {/* Category Suggestions Dropdown */}
                    {showCategorySuggestions && filteredCategories.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-stone-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                        {filteredCategories.map((category, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => selectCategory(category)}
                            className="w-full text-left px-3 sm:px-4 py-2 hover:bg-amber-50 text-slate-900 text-sm sm:text-base transition-colors"
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {!formData.categoryId && (
                      <p className="mt-1 text-sm text-red-600">La categoría es requerida</p>
                    )}
                    
                    <p className="text-xs text-slate-500 mt-1">
                      {formData.categoryId 
                        ? 'Categoría seleccionada. Puedes cambiarla escribiendo una nueva.' 
                        : 'Escribe una categoría y presiona Enter para agregarla, o selecciona de las sugerencias'
                      }
                    </p>
                  </div>

                  {/* Author Selection */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Autor Principal *
                    </label>
                    
                    {/* Attorney Selection */}
                    {loadingAttorneys ? (
                      <div className="flex items-center justify-center h-12 border border-stone-300 rounded-lg bg-slate-50">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-600"></div>
                        <span className="ml-2 text-sm text-slate-600">Cargando abogados...</span>
                      </div>
                    ) : (
                      <select
                        value={formData.authorId}
                        onChange={(e) => handleInputChange('authorId', e.target.value)}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm sm:text-base ${
                          !formData.authorId 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-white' 
                            : 'border-green-300 focus:ring-green-500 focus:border-green-500 bg-green-50'
                        } text-slate-900`}
                      >
                        <option value="">Seleccionar abogado autor...</option>
                        
                        {/* Group partners first */}
                        {attorneys.filter(attorney => attorney.tipo === 'Socio').length > 0 && (
                          <optgroup label="🏛️ Socios">
                            {attorneys.filter(attorney => attorney.tipo === 'Socio').map((attorney) => (
                              <option key={attorney.id} value={attorney.id}>
                                {attorney.nombre} - {attorney.cargo}
                              </option>
                            ))}
                          </optgroup>
                        )}
                        
                        {/* Then collaborators */}
                        {attorneys.filter(attorney => attorney.tipo === 'Colaborador').length > 0 && (
                          <optgroup label="👨‍💼 Abogados Colaboradores">
                            {attorneys.filter(attorney => attorney.tipo === 'Colaborador').map((attorney) => (
                              <option key={attorney.id} value={attorney.id}>
                                {attorney.nombre} - {attorney.cargo}
                              </option>
                            ))}
                          </optgroup>
                        )}
                      </select>
                    )}
                    
                    {/* Selected Attorney Preview */}
                    {formData.authorId && !loadingAttorneys && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        {(() => {
                          const selectedAttorney = attorneys.find(a => a.id === formData.authorId);
                          return selectedAttorney ? (
                            <div className="flex items-center space-x-3">
                              {selectedAttorney.imagenUrl && (
                                <img 
                                  src={selectedAttorney.imagenUrl} 
                                  alt={selectedAttorney.nombre}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              )}
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-green-900 text-sm">
                                    {selectedAttorney.nombre}
                                  </p>
                                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                                    Autor Principal
                                  </span>
                                  {selectedAttorney.tipo && (
                                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                      selectedAttorney.tipo === 'Socio' 
                                        ? 'bg-blue-100 text-blue-800' 
                                        : 'bg-purple-100 text-purple-800'
                                    }`}>
                                      {selectedAttorney.tipo}
                                    </span>
                                  )}
                                </div>
                                <p className="text-green-700 text-xs">
                                  {selectedAttorney.cargo}
                                </p>
                                <p className="text-green-600 text-xs mt-1">
                                  {selectedAttorney.descripcionCorta}
                                </p>
                              </div>
                            </div>
                          ) : null;
                        })()}
                      </div>
                    )}
                    
                    {!formData.authorId && (
                      <p className="mt-1 text-sm text-red-600">Debes seleccionar un abogado autor</p>
                    )}
                    
                    <p className="text-xs text-slate-500 mt-1">
                      Selecciona el abogado principal que escribió el artículo
                    </p>

                    {/* External Collaborator Section */}
                    <div className="mt-6 pt-4 border-t border-stone-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <input
                          type="checkbox"
                          id="hasExternalCollaborator"
                          checked={formData.hasExternalCollaborator}
                          onChange={(e) => {
                            handleInputChange('hasExternalCollaborator', e.target.checked);
                            // Clear external collaborator fields when unchecked
                            if (!e.target.checked) {
                              handleInputChange('externalCollaboratorName', '');
                              handleInputChange('externalCollaboratorTitle', '');
                            }
                          }}
                          className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500 focus:ring-2"
                        />
                        <label htmlFor="hasExternalCollaborator" className="text-sm font-medium text-slate-700">
                          🤝 ¿Tiene colaborador externo?
                        </label>
                      </div>

                      {/* External Collaborator Input */}
                      {formData.hasExternalCollaborator && (
                        <div className="space-y-4 pl-7">
                          <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                              Nombre del colaborador externo *
                            </label>
                            <input
                              type="text"
                              value={formData.externalCollaboratorName}
                              onChange={(e) => handleInputChange('externalCollaboratorName', e.target.value)}
                              placeholder="Ej: Dr. Juan Pérez, María González"
                              className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm sm:text-base ${
                                !formData.externalCollaboratorName.trim()
                                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-white' 
                                  : 'border-green-300 focus:ring-green-500 focus:border-green-500 bg-green-50'
                              } text-slate-900 placeholder:text-slate-400`}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                              Título o especialización (opcional)
                            </label>
                            <input
                              type="text"
                              value={formData.externalCollaboratorTitle}
                              onChange={(e) => handleInputChange('externalCollaboratorTitle', e.target.value)}
                              placeholder="Ej: Especialista en Derecho Internacional"
                              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900 placeholder:text-slate-400 text-sm sm:text-base"
                            />
                          </div>
                          
                          {/* External Collaborator Preview */}
                          {formData.externalCollaboratorName.trim() && (
                            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-blue-600 font-semibold text-sm">
                                    {formData.externalCollaboratorName.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium text-blue-900 text-sm">
                                      {formData.externalCollaboratorName}
                                    </p>
                                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                                      Colaborador Externo
                                    </span>
                                  </div>
                                  {formData.externalCollaboratorTitle && (
                                    <p className="text-blue-700 text-xs">
                                      {formData.externalCollaboratorTitle}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <p className="text-xs text-slate-500">
                            Persona externa que colaboró en el artículo junto al abogado autor
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content Editor */}
                  <div>
                    <label className="block text-base font-semibold text-slate-900 mb-2">
                      Contenido *
                    </label>
                    <DraftJsEditor
                      value={formData.content}
                      onChange={(value) => handleInputChange('content', value)}
                      placeholder="Escribe el contenido del post aquí... Usa la barra de herramientas para formatear el texto."
                      formatConfig={formData.formatConfig}
                      onFormatConfigChange={(config) => handleInputChange('formatConfig', config)}
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Editor enriquecido con soporte para formato visual. {formData.content.length} caracteres
                    </p>
                  </div>
                </div>
              )}

              {/* SEO Tab */}
              {activeTab === 'seo' && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                    <h3 className="font-medium text-blue-900 mb-2 text-sm sm:text-base">Optimización SEO</h3>
                    <p className="text-xs sm:text-sm text-blue-800">
                      Optimiza tu contenido para motores de búsqueda. Los campos se completan automáticamente si no los especificas.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Título SEO
                    </label>
                    <input
                      type="text"
                      value={formData.seoTitle}
                      onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                      placeholder="Título optimizado para SEO..."
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900 placeholder:text-slate-400 text-sm sm:text-base"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      {formData.seoTitle.length}/60 caracteres recomendados
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Meta Descripción
                    </label>
                    <textarea
                      value={formData.seoDescription}
                      onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                      placeholder="Descripción que aparecerá en los resultados de búsqueda..."
                      rows={3}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900 placeholder:text-slate-400 text-sm sm:text-base"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      {formData.seoDescription.length}/160 caracteres recomendados
                    </p>
                  </div>

                  {/* SEO Preview */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 sm:p-4">
                    <h4 className="font-medium text-slate-900 mb-3 text-sm sm:text-base">Vista previa en Google</h4>
                    <div className="bg-white border rounded p-3">
                      <div className="text-blue-600 text-base sm:text-lg hover:underline cursor-pointer">
                        {formData.seoTitle || formData.title || 'Título del post'}
                      </div>
                      <div className="text-green-700 text-xs sm:text-sm break-all">
                        altum-legal.com › blog › {formData.slug || 'url-del-post'}
                      </div>
                      <div className="text-slate-600 text-xs sm:text-sm mt-1">
                        {formData.seoDescription || formData.excerpt || 'Descripción del post...'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-4 sm:space-y-6">
                  {/* Featured Image Upload */}
                  <BlogImageUpload 
                    currentImage={formData.featuredImage}
                    onImageChange={(url) => handleInputChange('featuredImage', url)}
                  />

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Etiquetas
                    </label>
                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-3">
                      {formData.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-amber-100 text-amber-800"
                        >
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 text-amber-600 hover:text-amber-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                        placeholder="Agregar etiqueta..."
                        className="flex-1 px-3 sm:px-4 py-2 border border-stone-300 rounded-lg sm:rounded-l-lg sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900 placeholder:text-slate-400 text-sm sm:text-base"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-3 sm:px-4 py-2 bg-slate-200 text-slate-700 border border-stone-300 rounded-lg sm:rounded-r-lg sm:rounded-l-none sm:border-l-0 hover:bg-slate-300 transition-colors text-sm sm:text-base"
                      >
                        Agregar
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Presiona Enter o haz clic en "Agregar" para añadir etiquetas
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6 order-first lg:order-last">
          {/* Post Status */}
          <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-stone-200 p-4 sm:p-6">
            <h3 className="font-semibold text-slate-900 mb-3 sm:mb-4 text-sm sm:text-base">Estado del Post</h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-slate-600">Estado:</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  formData.status === PostStatus.PUBLISHED 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {formData.status === PostStatus.PUBLISHED ? 'Publicado' : 'Borrador'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-slate-600">Autor:</span>
                <span className="text-xs sm:text-sm font-medium text-slate-900 truncate ml-2">
                  {formData.authorId ? 
                    (() => {
                      const selectedAttorney = attorneys.find(a => a.id === formData.authorId);
                      return selectedAttorney ? selectedAttorney.nombre : 'Sin seleccionar';
                    })() : 
                    'Sin seleccionar'
                  }
                </span>
              </div>
              {formData.hasExternalCollaborator && (
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-slate-600">Colaborador:</span>
                  <span className="text-xs sm:text-sm font-medium text-orange-700 truncate ml-2">
                    {formData.externalCollaboratorName.trim() || 'Sin nombre'}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-slate-600">Creado:</span>
                <span className="text-xs sm:text-sm text-slate-600">
                  {new Date().toLocaleDateString('es-ES')}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg lg:rounded-xl p-4 sm:p-6">
            <h3 className="font-semibold text-amber-900 mb-3 sm:mb-4 text-sm sm:text-base">💡 Consejos</h3>
            <ul className="text-xs sm:text-sm text-amber-800 space-y-1 sm:space-y-2">
              <li>• Un buen título atrae más lectores</li>
              <li>• El extracto aparece en las previews</li>
              <li>• Usa etiquetas relevantes para SEO</li>
              <li>• La imagen destacada es importante</li>
              <li>• Revisa la vista previa SEO</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}