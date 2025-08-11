import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/infrastructure/database/connection';

// GET /api/attorneys/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const { DIContainer } = await import('@/app/lib/infrastructure/container/DIContainer');
    const { AttorneyMapper } = await import('@/app/lib/application/mappers/AttorneyMapper');
    
    const container = DIContainer.getInstance();
    const useCase = container.getGetAttorneyByIdUseCase();

    const attorney = await useCase.execute(params.id);
    const response = AttorneyMapper.toResponseDTO(attorney);

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching attorney:', error);
    
    if (error.name === 'AttorneyNotFoundError') {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

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
    
    const body = await request.json();
    
    const { DIContainer } = await import('@/app/lib/infrastructure/container/DIContainer');
    const { AttorneyMapper } = await import('@/app/lib/application/mappers/AttorneyMapper');
    
    const container = DIContainer.getInstance();
    const useCase = container.getUpdateAttorneyUseCase();

    const updateData = AttorneyMapper.fromUpdateDTO(body);
    const attorney = await useCase.execute(params.id, updateData);
    const response = AttorneyMapper.toResponseDTO(attorney);

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('Error updating attorney:', error);
    
    if (error.name === 'AttorneyNotFoundError') {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    if (error.message.includes('requerido') || error.message.includes('válido') || error.message.includes('ya está en uso')) {
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

// DELETE /api/attorneys/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const { DIContainer } = await import('@/app/lib/infrastructure/container/DIContainer');
    
    const container = DIContainer.getInstance();
    const useCase = container.getDeleteAttorneyUseCase();

    await useCase.execute(params.id);

    return NextResponse.json(
      { message: 'Abogado eliminado exitosamente' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting attorney:', error);
    
    if (error.name === 'AttorneyNotFoundError') {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Error al eliminar el abogado' },
      { status: 500 }
    );
  }
}