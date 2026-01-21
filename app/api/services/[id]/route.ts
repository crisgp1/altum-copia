import { NextRequest, NextResponse } from 'next/server';
import { ServiceRepository } from '@/app/lib/infrastructure/persistence/repositories/ServiceRepository';
import { verifyApiAuth } from '@/app/lib/auth/api-auth';

const serviceRepository = new ServiceRepository();

// GET /api/services/[id] - Get service by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const service = await serviceRepository.findById(id);
    
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
        imageUrl: service.imageUrl,
        parentId: service.parentId,
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

// PUT /api/services/[id] - Update service by ID - Requiere permiso manage_services
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verificar autenticación y permiso manage_services
  const authResult = await verifyApiAuth('manage_services');
  if (!authResult.authorized) {
    return authResult.error;
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const service = await serviceRepository.findById(id);
    
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
    if (body.imageUrl !== undefined) service.updateImage(body.imageUrl);
    if (body.parentId !== undefined) service.updateParentId(body.parentId);
    if (body.order !== undefined) service.updateOrder(body.order);
    if (body.isActive !== undefined) {
      if (body.isActive) {
        service.activate();
      } else {
        service.deactivate();
      }
    }

    await serviceRepository.update(service);

    return NextResponse.json({
      success: true,
      data: {
        id: service.id,
        name: service.name,
        description: service.description,
        shortDescription: service.shortDescription,
        iconUrl: service.iconUrl,
        imageUrl: service.imageUrl,
        parentId: service.parentId,
        order: service.order,
        isActive: service.isActive,
        updatedAt: service.updatedAt
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

// DELETE /api/services/[id] - Delete service by ID - Requiere permiso manage_services
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verificar autenticación y permiso manage_services
  const authResult = await verifyApiAuth('manage_services');
  if (!authResult.authorized) {
    return authResult.error;
  }

  try {
    const { id } = await params;
    const service = await serviceRepository.findById(id);
    
    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    await serviceRepository.delete(id);

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