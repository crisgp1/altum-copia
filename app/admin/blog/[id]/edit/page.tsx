'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUserRole } from '@/app/lib/hooks/useUserRole';
import { PostStatus } from '@/app/lib/domain/entities/BlogPost';
import SlateEditor from '@/app/components/admin/SlateEditor';
import { BlogImageUpload } from '@/app/components/admin/BlogImageUpload';
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

export default function EditBlogPost() {
  const router = useRouter();
  const params = useParams();
  const postId = params?.id as string;
  const { user, hasPermission } = useUserRole();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(true);
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

  // Load existing post data
  useEffect(() => {
    const loadPost = async () => {
      if (!postId) return;
      
      try {
        setIsLoadingPost(true);
        const response = await fetch(`/api/admin/blog/posts/${postId}`);
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            const post = result.data;
            setFormData({
              title: post.title || '',
              slug: post.slug || '',
              excerpt: post.excerpt || '',
              content: post.content || '',
              featuredImage: post.featuredImage || '',
              categoryId: post.categoryId || '',
              tags: post.tags || [],
              status: post.status?.toUpperCase() as PostStatus || PostStatus.DRAFT,
              seoTitle: post.seoTitle || '',
              seoDescription: post.seoDescription || '',
              publishedAt: post.publishedAt ? new Date(post.publishedAt) : undefined
            });
          } else {
            toast.error('Post no encontrado');
            router.push('/admin/blog');
          }
        } else {
          toast.error('Error al cargar el post');
          router.push('/admin/blog');
        }
      } catch (error) {
        console.error('Error loading post:', error);
        toast.error('Error al cargar el post');
        router.push('/admin/blog');
      } finally {
        setIsLoadingPost(false);
      }
    };

    loadPost();
  }, [postId, router]);

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
      
      // Auto-generate SEO title if empty when title changes
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
    if (!hasPermission('edit_content')) {
      toast.error('No tienes permisos para editar contenido');
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
        publishedAt: status === PostStatus.PUBLISHED && formData.status !== PostStatus.PUBLISHED 
          ? new Date() 
          : formData.publishedAt
      };

      const response = await fetch(`/api/admin/blog/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(`Post ${status === PostStatus.PUBLISHED ? 'publicado' : 'guardado'} exitosamente!`);
        router.push('/admin/blog');
      } else {
        toast.error(result.error || 'Error al actualizar el post');
      }
      
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Error al actualizar el post');
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasPermission('edit_content')) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-4">
          Sin permisos de edición
        </h1>
        <p className="text-slate-600">
          No tienes permisos para editar contenido.
        </p>
      </div>
    );
  }

  if (isLoadingPost) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Editar Post</h1>
          <p className="text-slate-600 mt-1">Modifica el artículo del blog</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => handleSubmit(PostStatus.DRAFT)}
            disabled={isLoading || !formData.title.trim()}
            className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Guardando...' : 'Guardar Borrador'}
          </button>
          <button
            onClick={() => handleSubmit(PostStatus.PUBLISHED)}
            disabled={isLoading || !formData.title.trim() || !formData.content.trim() || !formData.categoryId}
            className="px-6 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#B79F76' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9C8A6B'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#B79F76'}
          >
            {isLoading ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-200">
            <div className="border-b border-stone-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {[
                  { id: 'content', name: 'Contenido', icon: '📝' },
                  { id: 'seo', name: 'SEO', icon: '🔍' },
                  { id: 'settings', name: 'Configuración', icon: '⚙️' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-amber-500 text-amber-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    } transition-colors`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Content Tab */}
              {activeTab === 'content' && (
                <div className="space-y-6">
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
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-lg text-slate-900 placeholder:text-slate-400"
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      URL Slug
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-sm text-slate-500 bg-slate-50 border border-r-0 border-stone-300 rounded-l-lg">
                        /blog/
                      </span>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => handleInputChange('slug', generateSlug(e.target.value))}
                        placeholder="url-del-post"
                        className="flex-1 px-4 py-2 border border-stone-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900 placeholder:text-slate-400"
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
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900 placeholder:text-slate-400"
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
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
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
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-medium text-blue-900 mb-2">Optimización SEO</h3>
                    <p className="text-sm text-blue-800">
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
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900 placeholder:text-slate-400"
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
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900 placeholder:text-slate-400"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      {formData.seoDescription.length}/160 caracteres recomendados
                    </p>
                  </div>

                  {/* SEO Preview */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 mb-3">Vista previa en Google</h4>
                    <div className="bg-white border rounded p-3">
                      <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                        {formData.seoTitle || formData.title || 'Título del post'}
                      </div>
                      <div className="text-green-700 text-sm">
                        altum-legal.com › blog › {formData.slug || 'url-del-post'}
                      </div>
                      <div className="text-slate-600 text-sm mt-1">
                        {formData.seoDescription || formData.excerpt || 'Descripción del post...'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Imagen Destacada
                    </label>
                    <div className="border-2 border-dashed border-stone-300 rounded-lg p-6 text-center hover:border-stone-400 transition-colors">
                      {formData.featuredImage ? (
                        <div className="space-y-3">
                          <img 
                            src={formData.featuredImage} 
                            alt="Preview" 
                            className="max-h-40 mx-auto rounded"
                          />
                          <button
                            onClick={() => handleInputChange('featuredImage', '')}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Eliminar imagen
                          </button>
                        </div>
                      ) : (
                        <div>
                          <svg className="w-12 h-12 text-stone-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-slate-600 mb-2">Subir imagen destacada</p>
                          <input
                            type="url"
                            value={formData.featuredImage}
                            placeholder="https://ejemplo.com/imagen.jpg"
                            onChange={(e) => handleInputChange('featuredImage', e.target.value)}
                            className="w-full max-w-sm px-3 py-2 border border-stone-300 rounded text-sm text-slate-900 placeholder:text-slate-400"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Etiquetas
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-amber-100 text-amber-800"
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
                    <div className="flex">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                        placeholder="Agregar etiqueta..."
                        className="flex-1 px-4 py-2 border border-stone-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900 placeholder:text-slate-400"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-4 py-2 bg-slate-200 text-slate-700 border border-l-0 border-stone-300 rounded-r-lg hover:bg-slate-300 transition-colors"
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
        <div className="space-y-6">
          {/* Post Status */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Estado del Post</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Estado:</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  formData.status === PostStatus.PUBLISHED 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {formData.status === PostStatus.PUBLISHED ? 'Publicado' : 'Borrador'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Autor:</span>
                <span className="text-sm font-medium text-slate-900">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
              {formData.publishedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Publicado:</span>
                  <span className="text-sm text-slate-600">
                    {new Date(formData.publishedAt).toLocaleDateString('es-ES')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <h3 className="font-semibold text-amber-900 mb-4">💡 Consejos</h3>
            <ul className="text-sm text-amber-800 space-y-2">
              <li>• Revisa los cambios antes de publicar</li>
              <li>• Actualiza la fecha si es relevante</li>
              <li>• Verifica que los enlaces funcionen</li>
              <li>• Considera el impacto SEO de los cambios</li>
              <li>• Guarda como borrador si no estás seguro</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}