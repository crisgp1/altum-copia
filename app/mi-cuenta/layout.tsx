'use client';

import { useUser, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, BookMarked, User, LogOut } from 'lucide-react';

const menuItems = [
  {
    name: 'Mi Perfil',
    href: '/mi-cuenta',
    icon: User
  },
  {
    name: 'Abogados Favoritos',
    href: '/mi-cuenta/favoritos',
    icon: Heart
  },
  {
    name: 'Posts Guardados',
    href: '/mi-cuenta/posts-guardados',
    icon: BookMarked
  }
];

export default function MiCuentaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/mi-cuenta') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen bg-stone-50">
          {/* Header */}
          <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-4">
                  <Link href="/" className="flex items-center">
                    <span className="text-xl font-bold text-slate-800">ALTUM</span>
                    <span className="text-xl font-medium ml-1" style={{ color: '#B79F76' }}>Legal</span>
                  </Link>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-600 font-medium">Mi Cuenta</span>
                </div>

                <div className="flex items-center space-x-4">
                  {isLoaded && user && (
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.imageUrl}
                        alt={user.firstName || 'Usuario'}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm text-slate-700 hidden sm:block">
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                  )}
                  <Link
                    href="/"
                    className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    Volver al sitio
                  </Link>
                </div>
              </div>
            </div>
          </header>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar */}
              <aside className="lg:w-64 flex-shrink-0">
                <nav className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                  <div className="p-4 border-b border-stone-100">
                    <h2 className="font-semibold text-slate-800">Mi Cuenta</h2>
                  </div>
                  <div className="p-2">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                            isActive(item.href)
                              ? 'bg-amber-50 text-amber-700'
                              : 'text-slate-600 hover:bg-stone-50 hover:text-slate-900'
                          }`}
                        >
                          <Icon className={`w-5 h-5 ${isActive(item.href) ? 'text-amber-600' : ''}`} />
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </nav>
              </aside>

              {/* Main Content */}
              <main className="flex-1 min-w-0">
                {children}
              </main>
            </div>
          </div>
        </div>
      </SignedIn>
    </>
  );
}
