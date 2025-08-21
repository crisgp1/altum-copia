import { NextRequest, NextResponse } from 'next/server';
import { ServiceRepository } from '@/app/lib/infrastructure/persistence/repositories/ServiceRepository';
import { GetAllServicesUseCase } from '@/app/lib/application/useCases/services/GetAllServicesUseCase';
import { Service } from '@/app/lib/domain/entities/Service';

const serviceRepository = new ServiceRepository();
const getAllServicesUseCase = new GetAllServicesUseCase(serviceRepository);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const onlyActive = searchParams.get('active') !== 'false';
    const parentId = searchParams.get('parentId');
    const onlyParents = searchParams.get('onlyParents') === 'true';
    
    let services;
    if (onlyParents) {
      services = await serviceRepository.findParentServices();
    } else if (parentId !== null) {
      services = await serviceRepository.findByParentId(parentId);
    } else {
      services = await getAllServicesUseCase.execute(onlyActive);
    }
    
    return NextResponse.json({
      success: true,
      data: services.map(service => ({
        id: service.id,
        name: service.name,
        description: service.description,
        shortDescription: service.shortDescription,
        iconUrl: service.iconUrl || '',
        imageUrl: service.imageUrl || '',
        parentId: service.parentId,
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

// POST /api/services - Create new service
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('=== CREATING SERVICE ===');
    console.log('Request body:', body);
    console.log('Processed parentId:', body.parentId || null);
    
    const service = new Service({
      name: body.name,
      description: body.description,
      shortDescription: body.shortDescription,
      iconUrl: body.iconUrl,
      imageUrl: body.imageUrl,
      parentId: body.parentId || null, // Ensure empty strings become null
      order: body.order || 0,
      isActive: body.isActive !== undefined ? body.isActive : true
    });

    const createdService = await serviceRepository.create(service);
    
    return NextResponse.json({
      success: true,
      data: {
        id: createdService.id,
        name: createdService.name,
        description: createdService.description,
        shortDescription: createdService.shortDescription,
        iconUrl: createdService.iconUrl,
        imageUrl: createdService.imageUrl,
        parentId: createdService.parentId,
        order: createdService.order,
        isActive: createdService.isActive
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create service' },
      { status: 500 }
    );
  }
}

// PUT /api/services - Update multiple services (for reordering)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { services } = body;

    if (!Array.isArray(services)) {
      return NextResponse.json(
        { success: false, error: 'Services must be an array' },
        { status: 400 }
      );
    }

    // Update each service
    const updatePromises = services.map(async (serviceData: any) => {
      const existingService = await serviceRepository.findById(serviceData.id);
      if (!existingService) {
        throw new Error(`Service not found: ${serviceData.id}`);
      }

      if (serviceData.name !== undefined) existingService.updateName(serviceData.name);
      if (serviceData.description !== undefined) existingService.updateDescription(serviceData.description);
      if (serviceData.shortDescription !== undefined) existingService.updateShortDescription(serviceData.shortDescription);
      if (serviceData.iconUrl !== undefined) existingService.updateIcon(serviceData.iconUrl);
      if (serviceData.imageUrl !== undefined) existingService.updateImage(serviceData.imageUrl);
      if (serviceData.parentId !== undefined) existingService.updateParentId(serviceData.parentId);
      if (serviceData.order !== undefined) existingService.updateOrder(serviceData.order);
      if (serviceData.isActive !== undefined) {
        if (serviceData.isActive) {
          existingService.activate();
        } else {
          existingService.deactivate();
        }
      }

      return await serviceRepository.update(existingService);
    });

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: 'Services updated successfully'
    });
  } catch (error) {
    console.error('Error updating services:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update services' },
      { status: 500 }
    );
  }
}