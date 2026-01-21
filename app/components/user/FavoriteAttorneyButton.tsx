'use client';

import { useState, useEffect } from 'react';
import { useUser, SignInButton } from '@clerk/nextjs';
import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';

interface FavoriteAttorneyButtonProps {
  attorneyId: string;
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function FavoriteAttorneyButton({
  attorneyId,
  className = '',
  showText = false,
  size = 'md'
}: FavoriteAttorneyButtonProps) {
  const { isSignedIn, isLoaded } = useUser();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check if already favorited
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      checkFavoriteStatus();
    } else if (isLoaded) {
      setIsChecking(false);
    }
  }, [isLoaded, isSignedIn, attorneyId]);

  const checkFavoriteStatus = async () => {
    try {
      const response = await fetch('/api/user/favorites');
      const data = await response.json();

      if (data.success) {
        const isFav = data.data.some((fav: any) => fav.attorney.id === attorneyId);
        setIsFavorite(isFav);
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isSignedIn) {
      return;
    }

    setIsLoading(true);

    try {
      if (isFavorite) {
        // Remove from favorites
        const response = await fetch(`/api/user/favorites?attorneyId=${attorneyId}`, {
          method: 'DELETE'
        });
        const data = await response.json();

        if (data.success) {
          setIsFavorite(false);
          toast.success('Eliminado de favoritos');
        } else {
          toast.error(data.error || 'Error al eliminar');
        }
      } else {
        // Add to favorites
        const response = await fetch('/api/user/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ attorneyId })
        });
        const data = await response.json();

        if (data.success) {
          setIsFavorite(true);
          toast.success('Agregado a favoritos');
        } else {
          toast.error(data.error || 'Error al agregar');
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Error al procesar');
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  if (!isLoaded || isChecking) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-white/80 flex items-center justify-center ${className}`}>
        <div className="animate-pulse">
          <Heart className={`${iconSizes[size]} text-slate-300`} />
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <button
          onClick={(e) => e.stopPropagation()}
          className={`${showText ? 'px-4 py-2' : sizeClasses[size]} rounded-full bg-white/90 hover:bg-white shadow-sm border border-slate-200 flex items-center justify-center gap-2 transition-all duration-200 ${className}`}
          title="Inicia sesión para guardar favoritos"
        >
          <Heart className={`${iconSizes[size]} text-slate-400`} />
          {showText && <span className="text-sm text-slate-600">Guardar</span>}
        </button>
      </SignInButton>
    );
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`${showText ? 'px-4 py-2' : sizeClasses[size]} rounded-full shadow-sm border transition-all duration-200 flex items-center justify-center gap-2 ${
        isFavorite
          ? 'bg-red-50 border-red-200 hover:bg-red-100'
          : 'bg-white/90 hover:bg-white border-slate-200 hover:border-red-200'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      title={isFavorite ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
    >
      <Heart
        className={`${iconSizes[size]} transition-colors duration-200 ${
          isFavorite ? 'text-red-500 fill-red-500' : 'text-slate-400 hover:text-red-400'
        }`}
      />
      {showText && (
        <span className={`text-sm ${isFavorite ? 'text-red-600' : 'text-slate-600'}`}>
          {isFavorite ? 'Guardado' : 'Guardar'}
        </span>
      )}
    </button>
  );
}
