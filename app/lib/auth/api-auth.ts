import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { UserRole, hasPermission, ROLE_HIERARCHY } from './roles';

export interface AuthResult {
  authorized: boolean;
  userId?: string;
  userRole?: UserRole;
  error?: NextResponse;
}

/**
 * Verifica autenticación y permisos para APIs
 * @param requiredPermission - Permiso requerido para acceder
 * @returns AuthResult con el resultado de la verificación
 */
export async function verifyApiAuth(requiredPermission?: string): Promise<AuthResult> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        authorized: false,
        error: NextResponse.json(
          { success: false, error: 'No autorizado - Debes iniciar sesión' },
          { status: 401 }
        )
      };
    }

    const clerkInstance = await clerkClient();
    const user = await clerkInstance.users.getUser(userId);
    const userRole = (user.publicMetadata?.role as UserRole) || UserRole.USER;

    // Si se requiere un permiso específico, verificarlo
    if (requiredPermission && !hasPermission(userRole, requiredPermission)) {
      return {
        authorized: false,
        userId,
        userRole,
        error: NextResponse.json(
          { success: false, error: 'Permisos insuficientes para esta acción' },
          { status: 403 }
        )
      };
    }

    return {
      authorized: true,
      userId,
      userRole
    };
  } catch (error) {
    console.error('Error en verificación de autenticación:', error);
    return {
      authorized: false,
      error: NextResponse.json(
        { success: false, error: 'Error de autenticación' },
        { status: 500 }
      )
    };
  }
}

/**
 * Verifica si el usuario puede gestionar a otro usuario basado en jerarquía de roles
 * @param managerRole - Rol del usuario que ejecuta la acción
 * @param targetRole - Rol del usuario objetivo
 * @returns true si puede gestionar, false si no
 */
export function canManageRole(managerRole: UserRole, targetRole: UserRole): boolean {
  return ROLE_HIERARCHY[managerRole] > ROLE_HIERARCHY[targetRole];
}

/**
 * Verifica si el usuario puede asignar un rol específico
 * @param managerRole - Rol del usuario que ejecuta la acción
 * @param roleToAssign - Rol que se quiere asignar
 * @returns true si puede asignar, false si no
 */
export function canAssignRole(managerRole: UserRole, roleToAssign: UserRole): boolean {
  // Solo SUPERADMIN puede asignar SUPERADMIN
  if (roleToAssign === UserRole.SUPERADMIN) {
    return managerRole === UserRole.SUPERADMIN;
  }
  // Para otros roles, debe tener jerarquía mayor o igual
  return ROLE_HIERARCHY[managerRole] >= ROLE_HIERARCHY[roleToAssign];
}
