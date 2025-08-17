import { NextRequest, NextResponse } from 'next/server';
import { ServiceRepository } from '@/app/lib/infrastructure/persistence/repositories/ServiceRepository';

const serviceRepository = new ServiceRepository();

// GET /api/services/[id] - Get service by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const service = await serviceRepository.findById(params.id);
    
    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: service.id,
        name: service.name,
        description: service.description,
        shortDescription: service.shortDescription,
        iconUrl: service.iconUrl,
        order: service.order,
        isActive: service.isActive,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt
      }
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch service' },
      { status: 500 }
    );
  }
}

// PUT /api/services/[id] - Update service by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const service = await serviceRepository.findById(params.id);
    
    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    // Update fields if provided
    if (body.name !== undefined) service.updateName(body.name);
    if (body.description !== undefined) service.updateDescription(body.description);
    if (body.shortDescription !== undefined) service.updateShortDescription(body.shortDescription);
    if (body.iconUrl !== undefined) service.updateIcon(body.iconUrl);
    if (body.order !== undefined) service.updateOrder(body.order);
    if (body.isActive !== undefined) {
      if (body.isActive) {
        service.activate();
      } else {
        service.deactivate();
      }
    }

    const updatedService = await serviceRepository.update(service);

    return NextResponse.json({
      success: true,
      data: {
        id: updatedService.id,
        name: updatedService.name,
        description: updatedService.description,
        shortDescription: updatedService.shortDescription,
        iconUrl: updatedService.iconUrl,
        order: updatedService.order,
        isActive: updatedService.isActive,
        updatedAt: updatedService.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update service' },
      { status: 500 }
    );
  }
}

// DELETE /api/services/[id] - Delete service by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const service = await serviceRepository.findById(params.id);
    
    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    await serviceRepository.delete(params.id);

    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete service' },
      { status: 500 }
    );
  }
}