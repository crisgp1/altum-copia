'use client';

import { UserButton } from '@clerk/nextjs';
import { useUserRole } from '@/app/lib/hooks/useUserRole';
import { getRoleDisplayName } from '@/app/lib/auth/roles';

export default function AdminHeader() {
  const { user, role } = useUserRole();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-stone-200 z-50">
      <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 truncate">
            <span className="hidden sm:inline">Panel de Administración</span>
            <span className="sm:hidden">Admin</span>
          </h1>
          <div className="h-4 sm:h-6 w-px bg-stone-300 hidden sm:block"></div>
          <span 
            className="hidden sm:inline-block px-2 sm:px-3 py-1 text-xs font-medium rounded-full"
            style={{ 
              backgroundColor: '#B79F76',
              color: '#FFFFFF'
            }}
          >
            {getRoleDisplayName(role)}
          </span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
          <div className="text-right hidden md:block">
            <div className="text-sm font-medium text-slate-900">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-xs text-slate-500 truncate max-w-[150px]">
              {user?.emailAddresses[0]?.emailAddress}
            </div>
          </div>
          
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10"
              }
            }}
            afterSignOutUrl="/"
          />
        </div>
      </div>
    </header>
  );
}