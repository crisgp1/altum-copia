import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/infrastructure/database/connection';

// GET /api/attorneys/search
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';

    if (!query) {
      return NextResponse.json(
        { error: 'Se requiere un término de búsqueda' },
        { status: 400 }
      );
    }

    const { DIContainer } = await import('@/app/lib/infrastructure/container/DIContainer');
    const { AttorneyMapper } = await import('@/app/lib/application/mappers/AttorneyMapper');
    
    const container = DIContainer.getInstance();
    const useCase = container.getSearchAttorneysUseCase();

    const attorneys = await useCase.execute(query);
    const response = attorneys.map(attorney => AttorneyMapper.toListItemDTO(attorney));

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error searching attorneys:', error);
    return NextResponse.json(
      { error: 'Error al buscar abogados' },
      { status: 500 }
    );
  }
}