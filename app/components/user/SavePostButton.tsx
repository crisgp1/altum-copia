'use client';

import { useState, useEffect } from 'react';
import { useUser, SignInButton } from '@clerk/nextjs';
import { BookMarked } from 'lucide-react';
import toast from 'react-hot-toast';

interface SavePostButtonProps {
  postId: string;
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'card';
}

export default function SavePostButton({
  postId,
  className = '',
  showText = false,
  size = 'md',
  variant = 'default'
}: SavePostButtonProps) {
  const { isSignedIn, isLoaded } = useUser();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check if already saved
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      checkSavedStatus();
    } else if (isLoaded) {
      setIsChecking(false);
    }
  }, [isLoaded, isSignedIn, postId]);

  const checkSavedStatus = async () => {
    try {
      const response = await fetch('/api/user/liked-posts');
      const data = await response.json();

      if (data.success) {
        const saved = data.data.some((item: any) => item.post.id === postId);
        setIsSaved(saved);
      }
    } catch (error) {
      console.error('Error checking saved status:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const toggleSaved = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isSignedIn) {
      return;
    }

    setIsLoading(true);

    try {
      if (isSaved) {
        // Remove from saved
        const response = await fetch(`/api/user/liked-posts?postId=${postId}`, {
          method: 'DELETE'
        });
        const data = await response.json();

        if (data.success) {
          setIsSaved(false);
          toast.success('Eliminado de guardados');
        } else {
          toast.error(data.error || 'Error al eliminar');
        }
      } else {
        // Add to saved
        const response = await fetch('/api/user/liked-posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ postId })
        });
        const data = await response.json();

        if (data.success) {
          setIsSaved(true);
          toast.success('Guardado en tu lista');
        } else {
          toast.error(data.error || 'Error al guardar');
        }
      }
    } catch (error) {
      console.error('Error toggling saved:', error);
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

  // Variant styles
  const getVariantStyles = () => {
    if (variant === 'minimal') {
      return {
        base: 'bg-transparent hover:bg-slate-100',
        saved: 'text-amber-600',
        unsaved: 'text-slate-400 hover:text-amber-500'
      };
    }
    if (variant === 'card') {
      return {
        base: 'bg-black/50 hover:bg-black/70 backdrop-blur-sm border-0',
        saved: 'text-amber-400',
        unsaved: 'text-white/80 hover:text-amber-400'
      };
    }
    return {
      base: isSaved
        ? 'bg-amber-50 border-amber-200 hover:bg-amber-100'
        : 'bg-white/90 hover:bg-white border-slate-200 hover:border-amber-200',
      saved: 'text-amber-600 fill-amber-600',
      unsaved: 'text-slate-400 hover:text-amber-500'
    };
  };

  const styles = getVariantStyles();

  if (!isLoaded || isChecking) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-white/80 flex items-center justify-center ${className}`}>
        <div className="animate-pulse">
          <BookMarked className={`${iconSizes[size]} text-slate-300`} />
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <button
          onClick={(e) => e.stopPropagation()}
          className={`${showText ? 'px-4 py-2' : sizeClasses[size]} rounded-full shadow-sm border border-slate-200 flex items-center justify-center gap-2 transition-all duration-200 ${styles.base} ${className}`}
          title="Inicia sesión para guardar posts"
        >
          <BookMarked className={`${iconSizes[size]} text-slate-400`} />
          {showText && <span className="text-sm text-slate-600">Guardar</span>}
        </button>
      </SignInButton>
    );
  }

  return (
    <button
      onClick={toggleSaved}
      disabled={isLoading}
      className={`${showText ? 'px-4 py-2' : sizeClasses[size]} rounded-full shadow-sm ${variant !== 'minimal' ? 'border' : ''} transition-all duration-200 flex items-center justify-center gap-2 ${styles.base} ${
        isLoading ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      title={isSaved ? 'Eliminar de guardados' : 'Guardar post'}
    >
      <BookMarked
        className={`${iconSizes[size]} transition-colors duration-200 ${
          isSaved ? styles.saved : styles.unsaved
        } ${isSaved ? 'fill-current' : ''}`}
      />
      {showText && (
        <span className={`text-sm ${isSaved ? 'text-amber-600' : 'text-slate-600'}`}>
          {isSaved ? 'Guardado' : 'Guardar'}
        </span>
      )}
    </button>
  );
}
