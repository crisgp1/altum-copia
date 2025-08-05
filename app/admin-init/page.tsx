'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function AdminInitPage() {
  const [secretKey, setSecretKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { user } = useUser();
  const router = useRouter();

  const handleInit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/admin/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ secretKey }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('¡Rol de SuperAdmin asignado exitosamente! Redirigiendo...');
        setTimeout(() => {
          router.push('/admin');
        }, 2000);
      } else {
        setError(data.error || 'Error al asignar rol');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <SignedOut>
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-4">
              Inicialización de Admin
            </h1>
            <p className="text-slate-600 mb-6">
              Debes iniciar sesión para configurar tu rol de administrador
            </p>
            <SignInButton mode="modal">
              <button className="w-full px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors">
                Iniciar Sesión
              </button>
            </SignInButton>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                Configuración Inicial de Admin
              </h1>
              <p className="text-slate-600">
                Hola {user?.firstName}! Configura tu acceso de administrador
              </p>
            </div>

            <form onSubmit={handleInit} className="space-y-6">
              <div>
                <label htmlFor="secretKey" className="block text-sm font-medium text-slate-700 mb-2">
                  Clave Secreta de Inicialización
                </label>
                <input
                  type="password"
                  id="secretKey"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="Ingresa la clave secreta"
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  required
                />
                <p className="text-xs text-slate-500 mt-2">
                  Usa: <code className="bg-stone-100 px-2 py-1 rounded">ALTUM_INIT_ADMIN_2024</code>
                </p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex">
                    <svg className="w-5 h-5 text-red-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              )}

              {message && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex">
                    <svg className="w-5 h-5 text-green-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-green-800">{message}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !secretKey.trim()}
                className="w-full px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Configurando...
                  </>
                ) : (
                  'Asignar Rol de SuperAdmin'
                )}
              </button>
            </form>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">¿Qué hace esto?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Te asigna el rol de SuperAdmin</li>
                <li>• Te da acceso completo al panel de administración</li>
                <li>• Podrás gestionar usuarios y asignar roles</li>
                <li>• Solo funciona una vez por usuario</li>
              </ul>
            </div>

            <div className="mt-6 text-center">
              <a
                href="/"
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                ← Volver al sitio principal
              </a>
            </div>
          </div>
        </SignedIn>
      </div>
    </div>
  );
}