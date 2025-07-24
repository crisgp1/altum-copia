import { NextRequest, NextResponse } from 'next/server';
import { ServiceRepository } from '@/app/lib/infrastructure/persistence/repositories/ServiceRepository';
import { GetAllServicesUseCase } from '@/app/lib/application/useCases/services/GetAllServicesUseCase';

const serviceRepository = new ServiceRepository();
const getAllServicesUseCase = new GetAllServicesUseCase(serviceRepository);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const onlyActive = searchParams.get('active') !== 'false';
    
    const services = await getAllServicesUseCase.execute(onlyActive);
    
    return NextResponse.json({
      success: true,
      data: services.map(service => ({
        id: service.id,
        name: service.name,
        description: service.description,
        shortDescription: service.shortDescription,
        iconUrl: service.iconUrl,
        order: service.order,
        isActive: service.isActive
      }))
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}