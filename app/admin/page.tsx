'use client';

import { useUserRole } from '@/app/lib/hooks/useUserRole';
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  FileText,
  CheckCircle,
  Edit,
  Eye,
  Plus,
  Users,
  UserCheck,
  FileEdit,
  X,
  Clock,
  Image,
  Settings
} from 'lucide-react';
import { hasPermission, UserRole } from '@/app/lib/auth/roles';

interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalUsers: number;
  totalViews: number;
}

interface ActivityItem {
  action: string;
  item: string;
  time: string;
  type: 'post' | 'user' | 'edit';
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
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  // Check if user has specific permissions based on role
  const userRole = (role as UserRole) || UserRole.USER;
  const canManageUsers = hasPermission(userRole, 'manage_users');
  const canManageAttorneys = hasPermission(userRole, 'manage_attorneys');
  const canManageServices = hasPermission(userRole, 'manage_services');
  const canViewAnalytics = hasPermission(userRole, 'view_analytics');
  const canCreateContent = hasPermission(userRole, 'create_content');
  const canManageBlog = hasPermission(userRole, 'manage_blog');

  useEffect(() => {
    // Fetch real dashboard stats and recent activity
    const fetchDashboardData = async () => {
      try {
        // Only fetch users data if user has permission
        const fetchPromises: Promise<Response>[] = [fetch('/api/admin/blog/posts')];
        if (canManageUsers) {
          fetchPromises.push(fetch('/api/admin/users'));
        }

        const responses = await Promise.all(fetchPromises);
        const postsResponse = responses[0];
        const usersResponse = canManageUsers ? responses[1] : null;

        let totalPosts = 0;
        let publishedPosts = 0;
        let draftPosts = 0;
        let totalViews = 0;
        let activity: ActivityItem[] = [];

        if (postsResponse.ok) {
          const postsData = await postsResponse.json();
          if (postsData.success && postsData.data) {
            totalPosts = postsData.data.length || 0;
            publishedPosts = postsData.data.filter((post: any) => post.status === 'published').length || 0;
            draftPosts = postsData.data.filter((post: any) => post.status === 'draft').length || 0;
            totalViews = postsData.data.reduce((sum: number, post: any) => sum + (post.viewCount || 0), 0) || 0;

            // Get recent posts for activity
            const recentPosts = postsData.data
              .sort((a: any, b: any) => new Date(b.createdAt || b.updatedAt).getTime() - new Date(a.createdAt || a.updatedAt).getTime())
              .slice(0, 3);
            
            recentPosts.forEach((post: any) => {
              const postDate = new Date(post.createdAt || post.updatedAt);
              const timeAgo = getTimeAgo(postDate);
              
              activity.push({
                action: post.status === 'published' ? 'Post publicado' : 'Post creado',
                item: post.title || 'Sin título',
                time: timeAgo,
                type: 'post'
              });
            });
          }
        }

        let totalUsers = 0;
        if (usersResponse && usersResponse.ok) {
          const usersData = await usersResponse.json();
          if (usersData.success && usersData.data) {
            totalUsers = usersData.data.length || 0;

            // Get recent users for activity (only if user can manage users)
            if (canManageUsers) {
              const recentUsers = usersData.data
                .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 2);

              recentUsers.forEach((user: any) => {
                const userDate = new Date(user.createdAt);
                const timeAgo = getTimeAgo(userDate);

                activity.push({
                  action: 'Usuario registrado',
                  item: user.email || user.firstName + ' ' + user.lastName,
                  time: timeAgo,
                  type: 'user'
                });
              });
            }
          }
        }

        // Sort activity by most recent
        activity.sort((a, b) => {
          // Simple sorting by time string (this is approximate)
          return a.time.localeCompare(b.time);
        });

        setStats({
          totalPosts,
          publishedPosts,
          draftPosts,
          totalUsers,
          totalViews
        });

        setRecentActivity(activity.slice(0, 4)); // Show only 4 most recent activities

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback to default values on error
        setStats({
          totalPosts: 0,
          publishedPosts: 0,
          draftPosts: 0,
          totalUsers: 0,
          totalViews: 0
        });
        setRecentActivity([]);
      }
    };

    // Helper function to calculate time ago
    const getTimeAgo = (date: Date) => {
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInMinutes = Math.floor(diffInMs / 60000);
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInDays > 0) {
        return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
      } else if (diffInHours > 0) {
        return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
      } else if (diffInMinutes > 0) {
        return `Hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
      } else {
        return 'Hace un momento';
      }
    };

    fetchDashboardData();

    // Check for welcome parameter
    const welcome = searchParams.get('welcome');
    if (welcome === 'true') {
      setShowWelcome(true);
      // Auto-hide welcome message after 5 seconds
      setTimeout(() => setShowWelcome(false), 5000);
    }
  }, [searchParams, canManageUsers]);

  // Filter quick actions based on user permissions
  const quickActions = useMemo(() => {
    const allActions = [
      {
        title: 'Crear Nuevo Post',
        description: 'Escribir un nuevo artículo para el blog',
        href: '/admin/blog/new',
        icon: <Plus className="w-8 h-8" />,
        color: 'bg-green-500',
        permission: 'create_content'
      },
      {
        title: 'Gestionar Posts',
        description: 'Ver y editar posts existentes',
        href: '/admin/blog',
        icon: <FileText className="w-8 h-8" />,
        color: 'bg-blue-500',
        permission: 'manage_blog'
      },
      {
        title: 'Gestionar Medios',
        description: 'Administrar imágenes y archivos',
        href: '/admin/media',
        icon: <Image className="w-8 h-8" />,
        color: 'bg-purple-500',
        permission: 'manage_media'
      },
      {
        title: 'Gestionar Abogados',
        description: 'Administrar perfiles de abogados',
        href: '/admin/attorneys',
        icon: <Users className="w-8 h-8" />,
        color: 'bg-amber-500',
        permission: 'manage_attorneys'
      },
      {
        title: 'Gestionar Servicios',
        description: 'Administrar servicios legales',
        href: '/admin/services',
        icon: <Settings className="w-8 h-8" />,
        color: 'bg-teal-500',
        permission: 'manage_services'
      },
      {
        title: 'Gestionar Usuarios',
        description: 'Administrar usuarios y roles',
        href: '/admin/users',
        icon: <UserCheck className="w-8 h-8" />,
        color: 'bg-orange-500',
        permission: 'manage_users'
      }
    ];

    // Filter actions based on user permissions
    return allActions.filter(action => hasPermission(userRole, action.permission));
  }, [userRole]);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6 lg:space-y-8">
      {/* Welcome Banner - Auto Redirect */}
      {showWelcome && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg lg:rounded-xl p-4 sm:p-5 lg:p-6 relative">
          <button
            onClick={() => setShowWelcome(false)}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-green-600 hover:text-green-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <h3 className="text-base sm:text-lg font-semibold text-green-900">
                ¡Bienvenido al Panel de Administración!
              </h3>
              <p className="text-sm sm:text-base text-green-800 mt-1">
                {canManageUsers
                  ? 'Has sido redirigido automáticamente porque tienes permisos de administrador. Desde aquí puedes gestionar contenido, usuarios y configuraciones.'
                  : 'Has sido redirigido automáticamente. Desde aquí puedes gestionar el contenido del blog.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Section - Responsive */}
      <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-stone-200 p-4 sm:p-5 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
              Bienvenido, {user?.firstName}!
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              {canManageUsers
                ? 'Gestiona el contenido y los usuarios de ALTUM Legal desde este panel.'
                : 'Gestiona el contenido del blog de ALTUM Legal desde este panel.'}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-xs sm:text-sm text-slate-500">Último acceso</div>
            <div className="text-base sm:text-lg font-medium text-slate-900">
              {new Date().toLocaleDateString('es-ES')}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${canManageUsers ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-4 sm:gap-5 lg:gap-6`}>
        <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-stone-200 p-4 sm:p-5 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-600">Total Posts</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900">{stats.totalPosts}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-stone-200 p-4 sm:p-5 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-600">Publicados</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.publishedPosts}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-stone-200 p-4 sm:p-5 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-600">Borradores</p>
              <p className="text-2xl sm:text-3xl font-bold text-orange-600">{stats.draftPosts}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Edit className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-stone-200 p-4 sm:p-5 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-600">Total Vistas</p>
              <p className="text-2xl sm:text-3xl font-bold text-purple-600">{stats.totalViews.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Only show users count to those with manage_users permission */}
        {canManageUsers && (
          <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-stone-200 p-4 sm:p-5 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-slate-600">Total Usuarios</p>
                <p className="text-2xl sm:text-3xl font-bold text-indigo-600">{stats.totalUsers}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-5 lg:mb-6">Acciones Rápidas</h2>
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${quickActions.length > 4 ? 'lg:grid-cols-3 xl:grid-cols-6' : quickActions.length > 3 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4 sm:gap-5 lg:gap-6`}>
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-stone-200 p-4 sm:p-5 lg:p-6 hover:shadow-md transition-shadow duration-200 group"
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 ${action.color} rounded-lg flex items-center justify-center mb-3 sm:mb-4 text-white group-hover:scale-110 transition-transform duration-200`}>
                {action.icon}
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1 sm:mb-2">{action.title}</h3>
              <p className="text-slate-600 text-xs sm:text-sm">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-stone-200 p-4 sm:p-6 lg:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-5 lg:mb-6">Actividad Reciente</h2>
        <div className="space-y-4">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-stone-100 last:border-b-0 gap-2 sm:gap-0">
                <div className="flex items-start sm:items-center space-x-2 sm:space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 sm:mt-0 flex-shrink-0 ${
                    activity.type === 'post' ? 'bg-blue-500' :
                    activity.type === 'user' ? 'bg-green-500' : 'bg-amber-500'
                  }`}></div>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <span className="text-sm sm:text-base font-medium text-slate-900">{activity.action}:</span>
                    <span className="text-sm sm:text-base text-slate-600 sm:ml-1">{activity.item}</span>
                  </div>
                </div>
                <span className="text-xs sm:text-sm text-slate-500 ml-5 sm:ml-0">{activity.time}</span>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-sm sm:text-base">No hay actividad reciente</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}