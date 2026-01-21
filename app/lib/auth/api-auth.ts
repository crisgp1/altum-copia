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

/**
 * Verifica si el usuario puede editar contenido
 * @param userRole - Rol del usuario
 * @param userId - ID del usuario actual
 * @param contentAuthorId - ID del autor del contenido
 * @returns true si puede editar, false si no
 */
export function canEditContent(userRole: UserRole, userId: string, contentAuthorId: string): boolean {
  // Si tiene permiso para editar cualquier contenido
  if (hasPermission(userRole, 'edit_content')) {
    return true;
  }
  // Si solo puede editar su propio contenido, verificar que sea el autor
  if (hasPermission(userRole, 'edit_own_content')) {
    return userId === contentAuthorId;
  }
  return false;
}

/**
 * Verifica autenticación para edición de contenido
 * Acepta tanto 'edit_content' como 'edit_own_content' + verificación de autoría
 * @param contentAuthorId - ID del autor del contenido (opcional, requerido para edit_own_content)
 * @returns AuthResult con el resultado de la verificación
 */
export async function verifyContentEditAuth(contentAuthorId?: string): Promise<AuthResult> {
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

    // Verificar si puede editar cualquier contenido
    if (hasPermission(userRole, 'edit_content')) {
      return {
        authorized: true,
        userId,
        userRole
      };
    }

    // Verificar si puede editar su propio contenido
    if (hasPermission(userRole, 'edit_own_content')) {
      // Si no se proporciona el authorId, permitir (se verificará después con el contenido real)
      if (!contentAuthorId) {
        return {
          authorized: true,
          userId,
          userRole
        };
      }
      // Verificar que sea el autor
      if (userId === contentAuthorId) {
        return {
          authorized: true,
          userId,
          userRole
        };
      }
      return {
        authorized: false,
        userId,
        userRole,
        error: NextResponse.json(
          { success: false, error: 'Solo puedes editar tu propio contenido' },
          { status: 403 }
        )
      };
    }

    // No tiene ningún permiso de edición
    return {
      authorized: false,
      userId,
      userRole,
      error: NextResponse.json(
        { success: false, error: 'Permisos insuficientes para editar contenido' },
        { status: 403 }
      )
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
