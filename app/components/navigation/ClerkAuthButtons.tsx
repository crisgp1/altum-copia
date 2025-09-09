'use client';

import { 
  SignInButton, 
  SignUpButton, 
  SignedIn, 
  SignedOut, 
  UserButton 
} from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import { LayoutDashboard } from 'lucide-react';
import { useUserRole } from '@/app/lib/hooks/useUserRole';

export function AuthButtons() {
  const router = useRouter();
  const { isAdmin, isContentCreator } = useUserRole();

  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <button className="text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors px-2 py-1">
            Iniciar Sesión
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button 
            className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white rounded-full transition-colors hover:opacity-90"
            style={{ backgroundColor: '#B79F76' }}
          >
            <span className="hidden sm:inline">Registrarse</span>
            <span className="sm:hidden">Registro</span>
          </button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        {(isAdmin() || isContentCreator()) && (
          <button
            onClick={() => router.push('/admin')}
            className="group flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 hover:text-white bg-white/80 hover:bg-amber-600 border border-slate-200 hover:border-amber-600 rounded-full transition-all duration-200"
            title="Panel de administración"
          >
            <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden lg:inline">Dashboard</span>
          </button>
        )}
        <UserButton 
          appearance={{
            elements: {
              avatarBox: "w-7 h-7 sm:w-8 sm:h-8"
            }
          }}
        />
      </SignedIn>
    </>
  );
}

export function MobileAuthButtons() {
  const router = useRouter();
  const { isAdmin, isContentCreator } = useUserRole();

  return (
    <SignedIn>
      {(isAdmin() || isContentCreator()) && (
        <button
          onClick={() => router.push('/admin')}
          className="p-1.5 text-slate-700 hover:text-amber-600 transition-colors"
          title="Dashboard"
        >
          <LayoutDashboard className="w-5 h-5" />
        </button>
      )}
      <UserButton 
        appearance={{
          elements: {
            avatarBox: "w-6 h-6"
          }
        }}
      />
    </SignedIn>
  );
}

export function MobileMenuAuth({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { isAdmin, isContentCreator } = useUserRole();

  return (
    <>
      <SignedOut>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <SignInButton mode="modal">
            <button className="w-full text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors px-4 py-3 border border-slate-300 rounded-lg">
              Iniciar Sesión
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button 
              className="w-full px-4 py-3 text-sm font-medium text-white rounded-lg transition-colors"
              style={{ backgroundColor: '#B79F76' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#152239'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#B79F76'}
            >
              Registrarse
            </button>
          </SignUpButton>
        </div>
      </SignedOut>
      <SignedIn>
        {(isAdmin() || isContentCreator()) && (
          <button
            onClick={() => {
              onClose();
              setTimeout(() => router.push('/admin'), 300);
            }}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Ir al Dashboard</span>
          </button>
        )}
      </SignedIn>
    </>
  );
}