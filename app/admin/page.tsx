'use client';

import { useUserRole } from '@/app/lib/hooks/useUserRole';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalUsers: number;
  totalViews: number;
}

export default function AdminDashboard() {
  const { user, role } = useUserRole();
  const searchParams = useSearchParams();
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalUsers: 0,
    totalViews: 0
  });
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Mock data - replace with real API calls
    setStats({
      totalPosts: 24,
      publishedPosts: 18,
      draftPosts: 6,
      totalUsers: 12,
      totalViews: 8420
    });

    // Check for welcome parameter
    const welcome = searchParams.get('welcome');
    if (welcome === 'true') {
      setShowWelcome(true);
      // Auto-hide welcome message after 5 seconds
      setTimeout(() => setShowWelcome(false), 5000);
    }
  }, [searchParams]);

  const quickActions = [
    {
      title: 'Crear Nuevo Post',
      description: 'Escribir un nuevo artículo para el blog',
      href: '/admin/blog/new',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      color: 'bg-green-500'
    },
    {
      title: 'Gestionar Posts',
      description: 'Ver y editar posts existentes',
      href: '/admin/blog',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      color: 'bg-blue-500'
    },
    {
      title: 'Subir Medios',
      description: 'Gestionar imágenes y archivos',
      href: '/admin/media',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-purple-500'
    },
    {
      title: 'Gestionar Usuarios',
      description: 'Administrar usuarios y roles',
      href: '/admin/users',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner - Auto Redirect */}
      {showWelcome && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 relative">
          <button
            onClick={() => setShowWelcome(false)}
            className="absolute top-4 right-4 text-green-600 hover:text-green-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-green-900">
                ¡Bienvenido al Panel de Administración!
              </h3>
              <p className="text-green-800 mt-1">
                Has sido redirigido automáticamente porque tienes permisos de administrador. 
                Desde aquí puedes gestionar contenido, usuarios y configuraciones.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Bienvenido, {user?.firstName}!
            </h1>
            <p className="text-slate-600">
              Gestiona el contenido y los usuarios de ALTUM Legal desde este panel.
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-500">Último acceso</div>
            <div className="text-lg font-medium text-slate-900">
              {new Date().toLocaleDateString('es-ES')}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Posts</p>
              <p className="text-3xl font-bold text-slate-900">{stats.totalPosts}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Publicados</p>
              <p className="text-3xl font-bold text-green-600">{stats.publishedPosts}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Borradores</p>
              <p className="text-3xl font-bold text-orange-600">{stats.draftPosts}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Vistas</p>
              <p className="text-3xl font-bold text-purple-600">{stats.totalViews.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 hover:shadow-md transition-shadow duration-200 group"
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform duration-200`}>
                {action.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{action.title}</h3>
              <p className="text-slate-600 text-sm">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Actividad Reciente</h2>
        <div className="space-y-4">
          {[
            { action: 'Nuevo post publicado', item: 'Tendencias en Derecho Digital 2024', time: 'Hace 2 horas' },
            { action: 'Post editado', item: 'Compliance Corporativo', time: 'Hace 5 horas' },
            { action: 'Usuario registrado', item: 'ana.martinez@example.com', time: 'Hace 1 día' },
            { action: 'Post programado', item: 'Nuevas Regulaciones Fiscales', time: 'Hace 2 días' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-stone-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <div>
                  <span className="font-medium text-slate-900">{activity.action}:</span>
                  <span className="text-slate-600 ml-1">{activity.item}</span>
                </div>
              </div>
              <span className="text-sm text-slate-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}