import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// GET /api/users
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Dynamic import to avoid client-side execution
    const { ClerkUserRepository } = await import('@/app/lib/infrastructure/services/ClerkUserRepository');
    const { GetAllUsersUseCase } = await import('@/app/lib/application/use-cases/users/GetAllUsersUseCase');
    
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const role = searchParams.get('role') || undefined;
    const isActive = searchParams.get('isActive') ? searchParams.get('isActive') === 'true' : undefined;
    const searchTerm = searchParams.get('searchTerm') || undefined;
    const sortBy = searchParams.get('sortBy') || undefined;
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' || 'asc';

    const userRepository = new ClerkUserRepository();
    const useCase = new GetAllUsersUseCase(userRepository);

    const result = await useCase.execute({
      filters: {
        role,
        isActive,
        searchTerm
      },
      pagination: {
        page,
        limit,
        sortBy,
        sortOrder
      }
    });

    // Map to DTO
    const response = {
      users: result.data.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        imageUrl: user.imageUrl,
        role: user.role,
        permissions: user.permissions,
        isActive: user.isActive,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        lastSignInAt: user.lastSignInAt?.toISOString()
      })),
      pagination: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
        hasNext: result.hasNext,
        hasPrev: result.hasPrev
      }
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Error al obtener los usuarios' },
      { status: 500 }
    );
  }
}