'use client';

import { useUser } from '@clerk/nextjs';
import { UserRole, UserPublicMetadata, UserPrivateMetadata, hasPermission } from '../auth/roles';

export function useUserRole() {
  const { user, isLoaded } = useUser();
  
  const publicMetadata = user?.publicMetadata as UserPublicMetadata;
  const privateMetadata = user?.privateMetadata as UserPrivateMetadata;
  
  return {
    user,
    isLoaded,
    role: publicMetadata?.role || UserRole.USER,
    permissions: privateMetadata?.permissions || [],
    department: publicMetadata?.department,
    hasRole: (role: UserRole) => publicMetadata?.role === role,
    hasPermission: (permission: string) => hasPermission(publicMetadata?.role || UserRole.USER, permission),
    isAdmin: () => [UserRole.ADMIN, UserRole.SUPERADMIN].includes(publicMetadata?.role || UserRole.USER),
    isSuperAdmin: () => publicMetadata?.role === UserRole.SUPERADMIN,
    isContentCreator: () => [UserRole.CONTENT_CREATOR, UserRole.ADMIN, UserRole.SUPERADMIN].includes(publicMetadata?.role || UserRole.USER)
  };
}