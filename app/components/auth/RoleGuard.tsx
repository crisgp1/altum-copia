'use client';

import { useUserRole } from '@/app/lib/hooks/useUserRole';
import { UserRole } from '@/app/lib/auth/roles';
import { ReactNode } from 'react';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';

interface RoleGuardProps {
  children: ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: string;
  fallback?: ReactNode;
}

export default function RoleGuard({ 
  children, 
  requiredRole, 
  requiredPermission, 
  fallback 
}: RoleGuardProps) {
  const { isLoaded, hasRole, hasPermission } = useUserRole();

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        {!isLoaded ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        ) : (
          <>
            {((requiredRole && hasRole(requiredRole)) || 
              (requiredPermission && hasPermission(requiredPermission)) ||
              (!requiredRole && !requiredPermission)) ? (
              children
            ) : (
              fallback || (
                <div className="min-h-screen flex items-center justify-center bg-stone-50">
                  <div className="text-center max-w-md mx-auto">
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-4">
                      Acceso Denegado
                    </h1>
                    <p className="text-slate-600 mb-8">
                      No tienes permisos para acceder a esta sección.
                      Contacta al administrador si necesitas acceso.
                    </p>
                    <div className="space-y-4">
                      <a
                        href="/"
                        className="inline-block px-6 py-3 bg-amber-600 text-white font-medium hover:bg-amber-700 transition-colors duration-300 rounded-lg"
                      >
                        Ir al Inicio
                      </a>
                    </div>
                  </div>
                </div>
              )
            )}
          </>
        )}
      </SignedIn>
    </>
  );
}