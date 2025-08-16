'use client';

import { UserButton } from '@clerk/nextjs';
import { useUserRole } from '@/app/lib/hooks/useUserRole';
import { getRoleDisplayName } from '@/app/lib/auth/roles';

interface AdminHeaderProps {
  onMobileMenuToggle?: () => void;
}

export default function AdminHeader({ onMobileMenuToggle }: AdminHeaderProps) {
  const { user, role } = useUserRole();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-stone-200 z-40">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Botón hamburguesa para móvil */}
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-stone-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Abrir menú de navegación"
          >
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 truncate">
            <span className="hidden sm:inline">Panel de Administración</span>
            <span className="sm:hidden">Admin</span>
          </h1>
          
          <div className="hidden sm:block h-6 w-px bg-stone-300"></div>
          
          <span 
            className="hidden sm:inline-flex px-2 sm:px-3 py-1 text-xs font-medium rounded-full"
            style={{ 
              backgroundColor: '#B79F76',
              color: '#FFFFFF'
            }}
          >
            {getRoleDisplayName(role)}
          </span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Información del usuario - oculta en móvil muy pequeño */}
          <div className="hidden md:block text-right">
            <div className="text-sm font-medium text-slate-900">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-xs text-slate-500">
              {user?.emailAddresses[0]?.emailAddress}
            </div>
          </div>
          
          {/* Badge de rol visible solo en móvil */}
          <span 
            className="sm:hidden inline-flex px-2 py-1 text-xs font-medium rounded-full"
            style={{ 
              backgroundColor: '#B79F76',
              color: '#FFFFFF'
            }}
          >
            {getRoleDisplayName(role)}
          </span>
          
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-10 h-10"
              }
            }}
            afterSignOutUrl="/"
          />
        </div>
      </div>
    </header>
  );
}