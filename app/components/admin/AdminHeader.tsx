'use client';

import { UserButton } from '@clerk/nextjs';
import { useUserRole } from '@/app/lib/hooks/useUserRole';
import { getRoleDisplayName } from '@/app/lib/auth/roles';

export default function AdminHeader() {
  const { user, role } = useUserRole();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-stone-200 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-slate-800">
            Panel de Administración
          </h1>
          <div className="h-6 w-px bg-stone-300"></div>
          <span 
            className="px-3 py-1 text-xs font-medium rounded-full"
            style={{ 
              backgroundColor: '#B79F76',
              color: '#FFFFFF'
            }}
          >
            {getRoleDisplayName(role)}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm font-medium text-slate-900">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-xs text-slate-500">
              {user?.emailAddresses[0]?.emailAddress}
            </div>
          </div>
          
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