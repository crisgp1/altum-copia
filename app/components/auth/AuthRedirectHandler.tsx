'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { UserRole, UserPublicMetadata, hasPermission } from '@/app/lib/auth/roles';

export default function AuthRedirectHandler() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (!isLoaded || hasRedirected) return;

    const handlePostSignInRedirect = async () => {
      if (!user) return;

      const publicMetadata = user.publicMetadata as any;
      const userRole = publicMetadata?.role;

      // Check if user has any admin permissions
      const canAccessAdmin = userRole && (
        hasPermission(userRole, 'manage_content') ||
        hasPermission(userRole, 'manage_users') ||
        hasPermission(userRole, 'view_analytics') ||
        hasPermission(userRole, 'system_admin')
      );

      // Get current path and check if this is a post-sign-in redirect
      const currentPath = window.location.pathname;
      const isFromSignIn = searchParams.get('redirected') === 'true' || 
                          document.referrer.includes('/sign-in') ||
                          sessionStorage.getItem('postSignInRedirect') === 'pending';
      
      // Check if user explicitly navigated away from admin
      const hasNavigatedAway = sessionStorage.getItem('navigatedFromAdmin') === 'true';

      // Don't redirect if already on admin pages
      if (currentPath.startsWith('/admin')) {
        sessionStorage.removeItem('postSignInRedirect');
        sessionStorage.removeItem('navigatedFromAdmin');
        return;
      }

      // Don't redirect if user explicitly navigated away from admin
      if (hasNavigatedAway) {
        sessionStorage.removeItem('navigatedFromAdmin');
        return;
      }

      // Only redirect to admin if user has permissions and this is ACTUALLY from sign-in
      if (canAccessAdmin && isFromSignIn && !hasNavigatedAway) {
        setHasRedirected(true);
        sessionStorage.removeItem('postSignInRedirect');
        
        // Add a small delay for better UX
        setTimeout(() => {
          router.push('/admin?welcome=true');
        }, 800);
      }
    };

    handlePostSignInRedirect();
  }, [user, isLoaded, router, searchParams, hasRedirected]);

  // Set up session storage marker when component mounts
  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/sign-in') || currentPath.includes('/sign-up')) {
      sessionStorage.setItem('postSignInRedirect', 'pending');
    }
  }, []);

  return null;
}