'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlogPost, PostStatus } from '@/app/lib/domain/entities/BlogPost';
import toast from 'react-hot-toast';

interface BlogPostAPI {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: string;
  categoryId: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function BlogManagement() {
  const [posts, setPosts] = useState<BlogPostAPI[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPostAPI[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/blog/posts');
      if (response.ok) {
        const data = await response.json();
        // Handle both new API format and old format
        const posts = data.success ? data.data || [] : data.posts || [];
        setPosts(posts);
        setFilteredPosts(posts);
      } else {
        toast.error('Error al cargar los posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Error al cargar los posts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = posts;

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(post => post.status === selectedStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  }, [posts, selectedStatus, searchTerm]);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'published': 'bg-green-100 text-green-800',
      'draft': 'bg-yellow-100 text-yellow-800',
      'scheduled': 'bg-blue-100 text-blue-800',
      'archived': 'bg-gray-100 text-gray-800'
    };

    const labels: Record<string, string> = {
      'published': 'Publicado',
      'draft': 'Borrador',
      'scheduled': 'Programado',
      'archived': 'Archivado'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status] || status}
      </span>
    );
  };

  const handleDelete = async (postId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este post?')) {
      try {
        const response = await fetch(`/api/admin/blog/posts/${postId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          toast.success('Post eliminado exitosamente');
          fetchPosts(); // Reload posts
        } else {
          toast.error('Error al eliminar el post');
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        toast.error('Error al eliminar el post');
      }
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">Gestión de Blog</h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">Administra todos los posts del blog</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 text-white font-medium rounded-lg transition-colors duration-200 text-sm sm:text-base text-center flex-shrink-0"
          style={{ backgroundColor: '#B79F76' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9C8A6B'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#B79F76'}
        >
          <span className="hidden sm:inline">Nuevo Post</span>
          <span className="sm:hidden">+ Post</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-stone-200 p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          <div className="min-w-[140px] sm:min-w-[160px]">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="all">Todos los estados</option>
              <option value="published">Publicados</option>
              <option value="draft">Borradores</option>
              <option value="scheduled">Programados</option>
              <option value="archived">Archivados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="text-left py-3 sm:py-4 px-3 sm:px-4 lg:px-6 font-medium text-slate-900 text-sm sm:text-base">Título</th>
                <th className="text-left py-3 sm:py-4 px-3 sm:px-4 lg:px-6 font-medium text-slate-900 text-sm sm:text-base">Estado</th>
                <th className="text-left py-3 sm:py-4 px-3 sm:px-4 lg:px-6 font-medium text-slate-900 text-sm sm:text-base hidden md:table-cell">Categoría</th>
                <th className="text-left py-3 sm:py-4 px-3 sm:px-4 lg:px-6 font-medium text-slate-900 text-sm sm:text-base hidden lg:table-cell">Vistas</th>
                <th className="text-left py-3 sm:py-4 px-3 sm:px-4 lg:px-6 font-medium text-slate-900 text-sm sm:text-base hidden sm:table-cell">Fecha</th>
                <th className="text-left py-3 sm:py-4 px-3 sm:px-4 lg:px-6 font-medium text-slate-900 text-sm sm:text-base">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-stone-50">
                  <td className="py-3 sm:py-4 px-3 sm:px-4 lg:px-6">
                    <div>
                      <h3 className="font-medium text-slate-900 text-sm sm:text-base truncate max-w-[150px] sm:max-w-[200px] lg:max-w-xs">
                        {post.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 truncate max-w-[150px] sm:max-w-[200px] lg:max-w-xs mt-1">
                        {post.excerpt}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-4 lg:px-6">
                    {getStatusBadge(post.status)}
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-4 lg:px-6 text-slate-600 text-sm sm:text-base hidden md:table-cell">
                    {post.categoryId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-4 lg:px-6 text-slate-600 text-sm sm:text-base hidden lg:table-cell">
                    {post.viewCount.toLocaleString()}
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-4 lg:px-6 text-slate-600 text-sm sm:text-base hidden sm:table-cell">
                    {new Date(post.createdAt).toLocaleDateString('es-ES')}
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-4 lg:px-6">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <Link
                        href={`/admin/blog/${post.id}/edit`}
                        className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-md sm:rounded-lg transition-colors duration-200"
                        title="Editar"
                      >
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-1.5 sm:p-2 text-green-600 hover:bg-green-50 rounded-md sm:rounded-lg transition-colors duration-200"
                        title="Ver"
                      >
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-md sm:rounded-lg transition-colors duration-200"
                        title="Eliminar"
                      >
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredPosts.length === 0 && !isLoading && (
            <div className="text-center py-8 sm:py-10 lg:py-12 px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">
                No se encontraron posts
              </h3>
              <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6">
                {searchTerm || selectedStatus !== 'all' 
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Crea tu primer post para comenzar'
                }
              </p>
              {!searchTerm && selectedStatus === 'all' && (
                <Link
                  href="/admin/blog/new"
                  className="px-4 sm:px-6 py-2.5 sm:py-3 text-white font-medium rounded-lg transition-colors duration-200 text-sm sm:text-base"
                  style={{ backgroundColor: '#B79F76' }}
                >
                  Crear Primer Post
                </Link>
              )}
            </div>
          )}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-3 sm:p-4">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">
            {posts.filter(p => p.status === 'published').length}
          </div>
          <div className="text-xs sm:text-sm text-slate-600">Publicados</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-3 sm:p-4">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">
            {posts.filter(p => p.status === 'draft').length}
          </div>
          <div className="text-xs sm:text-sm text-slate-600">Borradores</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-3 sm:p-4">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">
            {posts.reduce((total, post) => total + post.viewCount, 0).toLocaleString()}
          </div>
          <div className="text-xs sm:text-sm text-slate-600">Total Vistas</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-3 sm:p-4">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">{posts.length}</div>
          <div className="text-xs sm:text-sm text-slate-600">Total Posts</div>
        </div>
      </div>
    </div>
  );
}