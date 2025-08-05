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
                    <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-4">
                      Sin Rol Asignado
                    </h1>
                    <p className="text-slate-600 mb-8">
                      Tu cuenta no tiene un rol administrativo asignado. 
                      Si eres el propietario del sitio, puedes configurar tu acceso inicial.
                    </p>
                    <div className="space-y-4">
                      <a
                        href="/admin-init"
                        className="inline-block px-6 py-3 bg-amber-600 text-white font-medium hover:bg-amber-700 transition-colors duration-300 rounded-lg"
                      >
                        Configurar Acceso Admin
                      </a>
                      <br />
                      <button
                        onClick={() => window.history.back()}
                        className="px-6 py-3 bg-slate-200 text-slate-700 font-medium hover:bg-slate-300 transition-colors duration-300 rounded-lg"
                      >
                        Volver Atrás
                      </button>
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