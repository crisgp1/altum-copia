'use client';

import { useState, useEffect } from 'react';
import { BookMarked, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface LikedPost {
  id: string;
  savedAt: string;
  post: {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    featuredImage?: string;
    publishedAt: string;
    categoryId: string;
    tags: string[];
  };
}

export default function PostsGuardadosPage() {
  const [likedPosts, setLikedPosts] = useState<LikedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLikedPosts();
  }, []);

  const fetchLikedPosts = async () => {
    try {
      const response = await fetch('/api/user/liked-posts');
      const data = await response.json();

      if (data.success) {
        setLikedPosts(data.data);
      }
    } catch (error) {
      console.error('Error fetching liked posts:', error);
      toast.error('Error al cargar posts guardados');
    } finally {
      setLoading(false);
    }
  };

  const removeLikedPost = async (postId: string) => {
    try {
      const response = await fetch(`/api/user/liked-posts?postId=${postId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setLikedPosts(prev => prev.filter(lp => lp.post.id !== postId));
        toast.success('Eliminado de guardados');
      } else {
        toast.error(data.error || 'Error al eliminar');
      }
    } catch (error) {
      console.error('Error removing liked post:', error);
      toast.error('Error al eliminar');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Posts Guardados</h1>
          <p className="text-slate-500 mt-1">
            {likedPosts.length} post{likedPosts.length !== 1 ? 's' : ''} guardado{likedPosts.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {likedPosts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-12 text-center">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookMarked className="w-8 h-8 text-stone-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No tienes posts guardados
          </h3>
          <p className="text-slate-500 mb-6">
            Explora nuestro blog y guarda los artículos que te interesen.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Ver blog
            <ExternalLink className="w-4 h-4 ml-2" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {likedPosts.map((liked) => (
            <div
              key={liked.id}
              className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="flex">
                {liked.post.featuredImage && (
                  <img
                    src={liked.post.featuredImage}
                    alt={liked.post.title}
                    className="w-48 h-32 object-cover flex-shrink-0 hidden sm:block"
                  />
                )}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 pr-4">
                      <h3 className="font-semibold text-slate-900 line-clamp-1">
                        {liked.post.title}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                        {liked.post.excerpt}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {liked.post.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => removeLikedPost(liked.post.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors flex-shrink-0"
                      title="Eliminar de guardados"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100">
                    <span className="text-xs text-slate-500">
                      Guardado el {formatDate(liked.savedAt)}
                    </span>
                    <Link
                      href={`/blog/${liked.post.slug}`}
                      className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                    >
                      Leer artículo
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
