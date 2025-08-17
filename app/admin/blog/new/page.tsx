'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserRole } from '@/app/lib/hooks/useUserRole';
import { PostStatus } from '@/app/lib/domain/entities/BlogPost';
import SlateEditor from '@/app/components/admin/SlateEditor';
import toast from 'react-hot-toast';

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  categoryId: string;
  tags: string[];
  status: PostStatus;
  seoTitle: string;
  seoDescription: string;
  publishedAt?: Date;
}

const categories = [
  { id: 'derecho-corporativo', name: 'Derecho Corporativo' },
  { id: 'derecho-fiscal', name: 'Derecho Fiscal' },
  { id: 'derecho-digital', name: 'Derecho Digital' },
  { id: 'derecho-internacional', name: 'Derecho Internacional' },
  { id: 'propiedad-intelectual', name: 'Propiedad Intelectual' },
  { id: 'compliance', name: 'Compliance' }
];

export default function NewBlogPost() {
  const router = useRouter();
  const { user, hasPermission } = useUserRole();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'settings'>('content');
  
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    categoryId: '',
    tags: [],
    status: PostStatus.DRAFT,
    seoTitle: '',
    seoDescription: '',
  });

  const [tagInput, setTagInput] = useState('');

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

    setIsLoading(true);
    
    try {
      const postData = {
        ...formData,
        status,
        authorId: user?.id || '',
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
            disabled={isLoading || !formData.title.trim() || !formData.content.trim() || !formData.categoryId}
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
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Categoría *
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => handleInputChange('categoryId', e.target.value)}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm sm:text-base ${
                        !formData.categoryId 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : 'border-stone-300 focus:ring-amber-500 focus:border-amber-500'
                      } text-slate-900`}
                    >
                      <option value="">Selecciona una categoría</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {!formData.categoryId && (
                      <p className="mt-1 text-sm text-red-600">La categoría es requerida</p>
                    )}
                  </div>

                  {/* Content Editor */}
                  <div>
                    <label className="block text-base font-semibold text-slate-900 mb-2">
                      Contenido *
                    </label>
                    <SlateEditor
                      value={formData.content}
                      onChange={(value) => handleInputChange('content', value)}
                      placeholder="Escribe el contenido del post aquí... Usa la barra de herramientas para formatear el texto."
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
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Imagen Destacada
                    </label>
                    <div className="border-2 border-dashed border-stone-300 rounded-lg p-4 sm:p-6 text-center hover:border-stone-400 transition-colors">
                      {formData.featuredImage ? (
                        <div className="space-y-3">
                          <img 
                            src={formData.featuredImage} 
                            alt="Preview" 
                            className="max-h-32 sm:max-h-40 mx-auto rounded"
                          />
                          <button
                            onClick={() => handleInputChange('featuredImage', '')}
                            className="text-red-600 hover:text-red-700 text-xs sm:text-sm"
                          >
                            Eliminar imagen
                          </button>
                        </div>
                      ) : (
                        <div>
                          <svg className="w-8 h-8 sm:w-12 sm:h-12 text-stone-400 mx-auto mb-2 sm:mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-slate-600 mb-2 text-xs sm:text-sm">Subir imagen destacada</p>
                          <input
                            type="url"
                            placeholder="https://ejemplo.com/imagen.jpg"
                            onChange={(e) => handleInputChange('featuredImage', e.target.value)}
                            className="w-full max-w-xs sm:max-w-sm px-3 py-2 border border-stone-300 rounded text-xs sm:text-sm text-slate-900 placeholder:text-slate-400"
                          />
                        </div>
                      )}
                    </div>
                  </div>

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
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
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