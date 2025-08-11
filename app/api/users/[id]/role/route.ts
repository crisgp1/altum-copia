import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// PUT /api/users/[id]/role
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { role, permissions } = body;

    if (!role) {
      return NextResponse.json(
        { error: 'Role is required' },
        { status: 400 }
      );
    }

    const { ClerkUserRepository } = await import('@/app/lib/infrastructure/services/ClerkUserRepository');
    const { UpdateUserRoleUseCase } = await import('@/app/lib/application/use-cases/users/UpdateUserRoleUseCase');
    
    const userRepository = new ClerkUserRepository();
    const useCase = new UpdateUserRoleUseCase(userRepository);

    const updatedUser = await useCase.execute({
      userId: params.id,
      role,
      permissions: permissions || []
    });

    const response = {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      fullName: updatedUser.fullName,
      imageUrl: updatedUser.imageUrl,
      role: updatedUser.role,
      permissions: updatedUser.permissions,
      isActive: updatedUser.isActive,
      createdAt: updatedUser.createdAt.toISOString(),
      updatedAt: updatedUser.updatedAt.toISOString(),
      lastSignInAt: updatedUser.lastSignInAt?.toISOString()
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('Error updating user role:', error);
    
    if (error.name === 'UserNotFoundError') {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Error al actualizar el rol del usuario' },
      { status: 500 }
    );
  }
}