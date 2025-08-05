'use client';

import { useUserRole } from '@/app/lib/hooks/useUserRole';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  permission?: string;
  roles?: string[];
}

const sidebarItems: SidebarItem[] = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5v4m8-4v4" />
      </svg>
    )
  },
  {
    name: 'Blog Posts',
    href: '/admin/blog',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
    permission: 'manage_content'
  },
  {
    name: 'Nuevo Post',
    href: '/admin/blog/new',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
    permission: 'create_content'
  },
  {
    name: 'Medios',
    href: '/admin/media',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    permission: 'manage_media'
  },
  {
    name: 'Usuarios',
    href: '/admin/users',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
    permission: 'manage_users'
  },
  {
    name: 'Desarrolladores',
    href: '/admin/developers',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    permission: 'manage_users'
  },
  {
    name: 'Configuración',
    href: '/admin/settings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    roles: ['superadmin']
  }
];

export default function AdminSidebar() {
  const { hasPermission, role } = useUserRole();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const canAccess = (item: SidebarItem) => {
    if (item.permission && !hasPermission(item.permission)) {
      return false;
    }
    if (item.roles && !item.roles.includes(role)) {
      return false;
    }
    return true;
  };

  return (
    <aside className="fixed left-0 top-16 h-full w-64 bg-white border-r border-stone-200 z-30">
      <div className="p-6">
        <div className="flex items-center mb-8">
          <div className="text-xl leading-tight">
            <span className="altum-brand text-slate-800">ALTUM</span>{' '}
            <span className="legal-brand" style={{ color: '#B79F76' }}>Admin</span>
          </div>
        </div>

        <nav className="space-y-2">
          {sidebarItems.filter(canAccess).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive(item.href)
                  ? 'bg-amber-50 text-amber-700 border-l-4 border-amber-600'
                  : 'text-slate-600 hover:bg-stone-50 hover:text-slate-900'
              }`}
            >
              <span className={`mr-3 ${isActive(item.href) ? 'text-amber-600' : ''}`}>
                {item.icon}
              </span>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-12 pt-6 border-t border-stone-200">
          <Link
            href="/"
            className="flex items-center px-4 py-3 text-slate-600 hover:bg-stone-50 hover:text-slate-900 rounded-lg transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Volver al Sitio</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}