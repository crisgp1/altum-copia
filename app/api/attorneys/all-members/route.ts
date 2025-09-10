import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/infrastructure/database/connection';

// GET /api/attorneys/all-members - Returns all active attorneys (partners and collaborators)
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { DIContainer } = await import('@/app/lib/infrastructure/container/DIContainer');
    const { AttorneyMapper } = await import('@/app/lib/application/mappers/AttorneyMapper');
    
    const container = DIContainer.getInstance();
    const useCase = container.getGetActiveAttorneysUseCase();

    const attorneys = await useCase.execute();
    const response = attorneys.map(attorney => {
      const dto = AttorneyMapper.toPublicDTO(attorney);
      return {
        ...dto,
        tipo: attorney.esSocio ? 'Socio' : 'Colaborador'
      };
    });

    // Sort by partners first, then by name
    response.sort((a, b) => {
      if (a.tipo !== b.tipo) {
        return a.tipo === 'Socio' ? -1 : 1;
      }
      return a.nombre.localeCompare(b.nombre);
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching all members:', error);
    return NextResponse.json(
      { error: 'Error al obtener los miembros del equipo' },
      { status: 500 }
    );
  }
}