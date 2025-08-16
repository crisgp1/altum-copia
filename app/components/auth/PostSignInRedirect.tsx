'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { UserRole, UserPublicMetadata } from '@/app/lib/auth/roles';

export default function PostSignInRedirect() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded || !user) return;

    const checkRoleAndRedirect = () => {
      const publicMetadata = user.publicMetadata as any;
      const userRole = publicMetadata?.role;

      // Check if user has admin permissions
      const hasAdminAccess = [
        UserRole.SUPERADMIN,
        UserRole.ADMIN,
        UserRole.DEVELOPER,
        UserRole.CONTENT_CREATOR
      ].includes(userRole as UserRole);

      if (hasAdminAccess) {
        // Small delay to ensure smooth transition
        setTimeout(() => {
          router.push('/admin');
        }, 1000);
      }
    };

    // Only redirect if we're on the home page or a non-admin page
    const currentPath = window.location.pathname;
    const isOnHomePage = currentPath === '/';
    const isOnAdminPage = currentPath.startsWith('/admin');
    const isOnAuthPage = currentPath.includes('/sign-in') || currentPath.includes('/sign-up');

    if ((isOnHomePage || isOnAuthPage) && !isOnAdminPage) {
      checkRoleAndRedirect();
    }
  }, [user, isLoaded, router]);

  return null; // This component doesn't render anything
}