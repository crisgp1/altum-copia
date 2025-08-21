'use client';

import { useState, useEffect } from 'react';
import { useUserRole } from '@/app/lib/hooks/useUserRole';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

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
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
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
    name: 'Abogados',
    href: '/admin/attorneys',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    permission: 'manage_content'
  },
  {
    name: 'Servicios',
    href: '/admin/services',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    permission: 'manage_content'
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
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    permission: 'manage_users'
  }
];

export default function AdminSidebar() {
  const { hasPermission, role } = useUserRole();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Check if we're on desktop
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('admin-sidebar');
      const hamburger = document.getElementById('hamburger-button');
      if (isSidebarOpen && 
          sidebar && 
          !sidebar.contains(event.target as Node) && 
          hamburger && 
          !hamburger.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href;
    }
    // For exact route matching to avoid conflicts like /admin/blog vs /admin/blog/new
    if (pathname === href) {
      return true;
    }
    // Only match if it's a true parent route (followed by /)
    return pathname.startsWith(href + '/');
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
    <>
      {/* Hamburger Menu Button - Mobile/Tablet */}
      <button
        id="hamburger-button"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-20 sm:top-22 md:top-24 left-3 sm:left-4 z-50 p-1.5 sm:p-2 bg-white rounded-md sm:rounded-lg shadow-md border border-stone-200 hover:bg-stone-50 transition-all duration-200"
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? (
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700" />
        ) : (
          <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        id="admin-sidebar"
        style={{
          transform: isDesktop || isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          top: '64px',
          height: 'calc(100vh - 64px)'
        }}
        className="fixed left-0 bg-white border-r border-stone-200 z-40 transition-transform duration-300 ease-in-out w-64 max-w-[85vw] lg:max-w-none"
      >
        <div className="p-3 sm:p-4 md:p-6 h-full overflow-y-auto pb-safe">
          {/* Brand */}
          <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8">
            <div className="text-base sm:text-lg md:text-xl leading-tight">
              <span className="altum-brand text-slate-800 font-bold">ALTUM</span>{' '}
              <span className="legal-brand font-medium" style={{ color: '#B79F76' }}>Admin</span>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1 hover:bg-stone-100 rounded transition-colors duration-200"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-0.5 sm:space-y-1 md:space-y-2">
            {sidebarItems.filter(canAccess).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-md sm:rounded-lg transition-all duration-200 text-sm md:text-base ${
                  isActive(item.href)
                    ? 'bg-amber-50 text-amber-700 border-l-4 border-amber-600'
                    : 'text-slate-600 hover:bg-stone-50 hover:text-slate-900'
                }`}
              >
                <span className={`mr-2 sm:mr-3 flex-shrink-0 ${isActive(item.href) ? 'text-amber-600' : ''}`}>
                  {item.icon}
                </span>
                <span className="font-medium truncate">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Back to Site Link */}
          <div className="mt-6 sm:mt-8 md:mt-12 pt-3 sm:pt-4 md:pt-6 border-t border-stone-200">
            <Link
              href="/"
              className="flex items-center px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-slate-600 hover:bg-stone-50 hover:text-slate-900 rounded-md sm:rounded-lg transition-all duration-200 text-sm md:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium truncate">Volver al Sitio</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}