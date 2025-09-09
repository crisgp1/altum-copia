import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/infrastructure/database/connection';

// GET /api/attorneys/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const { id } = params;
    
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
    const useCase = container.getGetAttorneyByIdUseCase();

    const attorney = await useCase.execute(id);
    
    if (!attorney) {
      return NextResponse.json(
        { error: 'Abogado no encontrado' },
        { status: 404 }
      );
    }

    const response = AttorneyMapper.toResponseDTO(attorney);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching attorney by ID:', error);
    return NextResponse.json(
      { error: 'Error al obtener el abogado' },
      { status: 500 }
    );
  }
}

// PUT /api/attorneys/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const { id } = params;
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