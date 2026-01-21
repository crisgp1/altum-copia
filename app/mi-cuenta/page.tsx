'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Heart, BookMarked, Calendar, Mail } from 'lucide-react';
import Link from 'next/link';

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  imageUrl: string;
  createdAt: number;
  lastSignInAt: number | null;
  stats: {
    favorites: number;
    likedPosts: number;
  };
}

export default function MiCuentaPage() {
  const { user } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/user/profile');
        const data = await response.json();

        if (data.success) {
          setProfile(data.data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
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
      {/* Perfil Header */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 h-24"></div>
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-5 -mt-12">
            <img
              src={user?.imageUrl}
              alt={profile?.fullName || 'Usuario'}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            />
            <div className="mt-4 sm:mt-0 sm:pb-2">
              <h1 className="text-2xl font-bold text-slate-900">
                {profile?.fullName || 'Usuario'}
              </h1>
              <p className="text-slate-500 flex items-center mt-1">
                <Mail className="w-4 h-4 mr-2" />
                {profile?.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/mi-cuenta/favoritos"
          className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Abogados Favoritos</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {profile?.stats.favorites || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </Link>

        <Link
          href="/mi-cuenta/posts-guardados"
          className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Posts Guardados</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {profile?.stats.likedPosts || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <BookMarked className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </Link>
      </div>

      {/* Info adicional */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Información de la cuenta</h2>
        <div className="space-y-4">
          <div className="flex items-center text-slate-600">
            <Calendar className="w-5 h-5 mr-3 text-slate-400" />
            <span>Miembro desde {profile?.createdAt ? formatDate(profile.createdAt) : '-'}</span>
          </div>
          {profile?.lastSignInAt && (
            <div className="flex items-center text-slate-600">
              <Calendar className="w-5 h-5 mr-3 text-slate-400" />
              <span>Último acceso: {formatDate(profile.lastSignInAt)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
