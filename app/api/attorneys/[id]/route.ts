import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/infrastructure/database/connection';
import { verifyApiAuth } from '@/app/lib/auth/api-auth';

// GET /api/attorneys/[id]
// Handles both MongoDB ID and slug lookups
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID de abogado requerido' },
        { status: 400 }
      );
    }

    // Import server-side only modules here
    const { DIContainer } = await import('@/app/lib/infrastructure/container/DIContainer');
    const { AttorneyMapper } = await import('@/app/lib/application/mappers/AttorneyMapper');

    const container = DIContainer.getInstance();
    const repository = container.getAttorneyRepository();

    let attorney = null;

    // Check if id is a valid MongoDB ObjectId (24 hex characters)
    const isMongoId = /^[a-f\d]{24}$/i.test(id);

    if (isMongoId) {
      // Try to find by MongoDB ID first
      attorney = await repository.findById(id);
    }

    // If not found by ID or not a valid MongoDB ID, try finding by slug
    if (!attorney) {
      attorney = await repository.findBySlug(id);
    }

    if (!attorney) {
      return NextResponse.json(
        { error: 'Abogado no encontrado' },
        { status: 404 }
      );
    }

    const response = AttorneyMapper.toResponseDTO(attorney);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching attorney by ID or slug:', error);
    return NextResponse.json(
      { error: 'Error al obtener el abogado' },
      { status: 500 }
    );
  }
}

// PUT /api/attorneys/[id] - Requiere permiso manage_attorneys
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verificar autenticación y permiso manage_attorneys
  const authResult = await verifyApiAuth('manage_attorneys');
  if (!authResult.authorized) {
    return authResult.error;
  }

  try {
    await connectToDatabase();

    const { id } = await params;
    const body = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID de abogado requerido' },
        { status: 400 }
      );
    }

    // Import server-side only modules here
    const { DIContainer } = await import('@/app/lib/infrastructure/container/DIContainer');
    const { AttorneyMapper } = await import('@/app/lib/application/mappers/AttorneyMapper');
    
    const container = DIContainer.getInstance();
    const useCase = container.getUpdateAttorneyUseCase();

    const updateData = AttorneyMapper.fromUpdateDTO(body);
    const attorney = await useCase.execute(id, updateData);
    
    if (!attorney) {
      return NextResponse.json(
        { error: 'Abogado no encontrado' },
        { status: 404 }
      );
    }

    const response = AttorneyMapper.toResponseDTO(attorney);

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('Error updating attorney:', error);
    
    if (error.name === 'EmailAlreadyExistsError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    if (error.message.includes('requerido') || error.message.includes('válido')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error al actualizar el abogado' },
      { status: 500 }
    );
  }
}