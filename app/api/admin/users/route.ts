import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { UserRole } from '@/app/lib/auth/roles';

export async function GET(request: NextRequest) {
  try {
    // Get all users from Clerk
    const users = await clerkClient.users.getUserList({
      limit: 100, // Adjust as needed
      orderBy: '-created_at'
    });

    // Transform Clerk users to our User interface
    const transformedUsers = users.data.map(user => ({
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

// PUT /api/admin/users - Update user role
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, role, department } = body;

    if (!userId || !role) {
      return NextResponse.json(
        { success: false, error: 'ID de usuario y rol son requeridos' },
        { status: 400 }
      );
    }

    // Update user metadata in Clerk
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role,
        department: department || undefined
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Rol actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al actualizar el rol' 
      },
      { status: 500 }
    );
  }
}