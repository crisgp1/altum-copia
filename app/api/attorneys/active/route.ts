import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/infrastructure/database/connection';

// GET /api/attorneys/active
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { DIContainer } = await import('@/app/lib/infrastructure/container/DIContainer');
    const { AttorneyMapper } = await import('@/app/lib/application/mappers/AttorneyMapper');
    
    const container = DIContainer.getInstance();
    const useCase = container.getGetActiveAttorneysUseCase();

    const attorneys = await useCase.execute();
    const response = attorneys.map(attorney => AttorneyMapper.toPublicDTO(attorney));

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching active attorneys:', error);
    return NextResponse.json(
      { error: 'Error al obtener los abogados activos' },
      { status: 500 }
    );
  }
}