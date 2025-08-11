import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/infrastructure/database/connection';

// GET /api/attorneys/specialization/[specialization]
export async function GET(
  request: NextRequest,
  { params }: { params: { specialization: string } }
) {
  try {
    await connectToDatabase();
    
    const { DIContainer } = await import('@/app/lib/infrastructure/container/DIContainer');
    const { AttorneyMapper } = await import('@/app/lib/application/mappers/AttorneyMapper');
    
    const container = DIContainer.getInstance();
    const useCase = container.getGetAttorneysBySpecializationUseCase();

    const attorneys = await useCase.execute(decodeURIComponent(params.specialization));
    const response = attorneys.map(attorney => AttorneyMapper.toListItemDTO(attorney));

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching attorneys by specialization:', error);
    
    if (error.message === 'Specialization is required') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error al obtener abogados por especialización' },
      { status: 500 }
    );
  }
}