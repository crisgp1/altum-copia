'use client';

import { useState, useEffect } from 'react';
import { Heart, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface FavoriteAttorney {
  id: string;
  savedAt: string;
  attorney: {
    id: string;
    slug: string;
    nombre: string;
    cargo: string;
    especializaciones: string[];
    imagenUrl?: string;
    descripcionCorta: string;
  };
}

export default function FavoritosPage() {
  const [favorites, setFavorites] = useState<FavoriteAttorney[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/user/favorites');
      const data = await response.json();

      if (data.success) {
        setFavorites(data.data);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Error al cargar favoritos');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (attorneyId: string) => {
    try {
      const response = await fetch(`/api/user/favorites?attorneyId=${attorneyId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setFavorites(prev => prev.filter(f => f.attorney.id !== attorneyId));
        toast.success('Eliminado de favoritos');
      } else {
        toast.error(data.error || 'Error al eliminar');
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
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
          <h1 className="text-2xl font-bold text-slate-900">Abogados Favoritos</h1>
          <p className="text-slate-500 mt-1">
            {favorites.length} abogado{favorites.length !== 1 ? 's' : ''} guardado{favorites.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-12 text-center">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-stone-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No tienes abogados favoritos
          </h3>
          <p className="text-slate-500 mb-6">
            Explora nuestro equipo y guarda a los abogados que te interesen.
          </p>
          <Link
            href="/equipo"
            className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Ver equipo
            <ExternalLink className="w-4 h-4 ml-2" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favorites.map((favorite) => (
            <div
              key={favorite.id}
              className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-4 flex space-x-4">
                <img
                  src={favorite.attorney.imagenUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(favorite.attorney.nombre)}&background=B79F76&color=fff`}
                  alt={favorite.attorney.nombre}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 truncate">
                    {favorite.attorney.nombre}
                  </h3>
                  <p className="text-sm text-amber-600 truncate">
                    {favorite.attorney.cargo}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {favorite.attorney.descripcionCorta}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {favorite.attorney.especializaciones.slice(0, 2).map((esp, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-0.5 bg-stone-100 text-stone-600 rounded"
                      >
                        {esp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Guardado el {formatDate(favorite.savedAt)}
                </span>
                <div className="flex space-x-2">
                  <Link
                    href={`/equipo/${favorite.attorney.slug}`}
                    className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Ver perfil
                  </Link>
                  <button
                    onClick={() => removeFavorite(favorite.attorney.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                    title="Eliminar de favoritos"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
