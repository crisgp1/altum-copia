import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/infrastructure/database/connection';
import { verifyApiAuth } from '@/app/lib/auth/api-auth';

// GET /api/attorneys - Público para el sitio, pero POST requiere auth
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const activo = searchParams.get('activo') === 'true' ? true : searchParams.get('activo') === 'false' ? false : undefined;
    const esSocio = searchParams.get('esSocio') === 'true' ? true : searchParams.get('esSocio') === 'false' ? false : undefined;
    const especializacion = searchParams.get('especializacion') || undefined;
    const nombre = searchParams.get('nombre') || undefined;
    const sortBy = searchParams.get('sortBy') || undefined;
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' || 'asc';

    // Import server-side only modules here
    const { DIContainer } = await import('@/app/lib/infrastructure/container/DIContainer');
    const { AttorneyMapper } = await import('@/app/lib/application/mappers/AttorneyMapper');
    
    const container = DIContainer.getInstance();
    const useCase = container.getGetAllAttorneysUseCase();

    const result = await useCase.execute({
      filters: {
        activo,
        esSocio,
        especializacion,
        nombre
      },
      pagination: {
        page,
        limit,
        sortBy,
        sortOrder
      }
    });

    const response = AttorneyMapper.toPaginatedDTO(result);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching attorneys:', error);
    return NextResponse.json(
      { error: 'Error al obtener los abogados' },
      { status: 500 }
    );
  }
}

// POST /api/attorneys - Requiere permiso manage_attorneys
export async function POST(request: NextRequest) {
  // Verificar autenticación y permiso manage_attorneys
  const authResult = await verifyApiAuth('manage_attorneys');
  if (!authResult.authorized) {
    return authResult.error;
  }

  try {
    await connectToDatabase();

    const body = await request.json();
    
    // Import server-side only modules here
    const { DIContainer } = await import('@/app/lib/infrastructure/container/DIContainer');
    const { AttorneyMapper } = await import('@/app/lib/application/mappers/AttorneyMapper');
    
    const container = DIContainer.getInstance();
    const useCase = container.getCreateAttorneyUseCase();

    const createData = AttorneyMapper.fromCreateDTO(body);
    const attorney = await useCase.execute(createData as any);
    const response = AttorneyMapper.toResponseDTO(attorney);

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error('Error creating attorney:', error);
    
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
      { error: 'Error al crear el abogado' },
      { status: 500 }
    );
  }
}