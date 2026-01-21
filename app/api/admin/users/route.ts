import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { UserRole, ROLE_HIERARCHY } from '@/app/lib/auth/roles';
import { User } from '@clerk/nextjs/server';
import { verifyApiAuth, canManageRole, canAssignRole } from '@/app/lib/auth/api-auth';

// GET /api/admin/users - Requiere permiso manage_users
export async function GET(request: NextRequest) {
  // Verificar autenticación y permiso manage_users
  const authResult = await verifyApiAuth('manage_users');
  if (!authResult.authorized) {
    return authResult.error;
  }

  try {
    // Get all users from Clerk
    const clerkInstance = await clerkClient();
    const users = await clerkInstance.users.getUserList({
      limit: 100, // Adjust as needed
      orderBy: '-created_at'
    });

    // Transform Clerk users to our User interface
    const transformedUsers = users.data.map((user: User) => ({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      imageUrl: user.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent((user.firstName || '') + ' ' + (user.lastName || ''))}&background=B79F76&color=fff`,
      role: (user.publicMetadata?.role as UserRole) || UserRole.USER,
      createdAt: new Date(user.createdAt),
      lastSignInAt: user.lastSignInAt ? new Date(user.lastSignInAt) : undefined,
      department: user.publicMetadata?.department as string || undefined
    }));

    return NextResponse.json({
      success: true,
      data: transformedUsers
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al cargar usuarios' 
      },
      { status: 500 }
    );
  }
}

// PUT /api/admin/users - Update user role - Requiere permiso manage_users + verificación de jerarquía
export async function PUT(request: NextRequest) {
  // Verificar autenticación y permiso manage_users
  const authResult = await verifyApiAuth('manage_users');
  if (!authResult.authorized) {
    return authResult.error;
  }

  try {
    const body = await request.json();
    const { userId, role, department } = body;

    if (!userId || !role) {
      return NextResponse.json(
        { success: false, error: 'ID de usuario y rol son requeridos' },
        { status: 400 }
      );
    }

    // Validate that role is a valid UserRole
    const validRoles = Object.values(UserRole);
    if (!validRoles.includes(role as UserRole)) {
      return NextResponse.json(
        { success: false, error: `Rol inválido: ${role}. Roles válidos: ${validRoles.join(', ')}` },
        { status: 400 }
      );
    }

    const clerkInstance = await clerkClient();

    // Get target user to check their current role
    const targetUser = await clerkInstance.users.getUser(userId);
    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const targetCurrentRole = (targetUser.publicMetadata?.role as UserRole) || UserRole.USER;
    const managerRole = authResult.userRole!;

    // SECURITY: Verify hierarchy - cannot modify users with equal or higher role
    if (!canManageRole(managerRole, targetCurrentRole)) {
      return NextResponse.json(
        { success: false, error: 'No puedes modificar usuarios con rol igual o superior al tuyo' },
        { status: 403 }
      );
    }

    // SECURITY: Verify hierarchy - cannot assign a role equal or higher than your own
    if (!canAssignRole(managerRole, role as UserRole)) {
      return NextResponse.json(
        { success: false, error: 'No puedes asignar un rol igual o superior al tuyo' },
        { status: 403 }
      );
    }

    // Update user with new metadata
    const updatedUser = await clerkInstance.users.updateUser(userId, {
      publicMetadata: {
        ...targetUser.publicMetadata,
        role,
        department: department || targetUser.publicMetadata?.department || undefined
      }
    });

    // Verify the update was successful
    const newRole = updatedUser.publicMetadata?.role;
    if (newRole !== role) {
      console.error('Role update verification failed:', { expected: role, actual: newRole });
      return NextResponse.json(
        { success: false, error: 'La actualización del rol no se pudo verificar' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Rol actualizado exitosamente',
      data: {
        userId: updatedUser.id,
        role: newRole,
        department: updatedUser.publicMetadata?.department
      }
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error al actualizar el rol'
      },
      { status: 500 }
    );
  }
}