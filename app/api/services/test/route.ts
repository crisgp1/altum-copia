import { NextRequest, NextResponse } from 'next/server';
import { ServiceRepository } from '@/app/lib/infrastructure/persistence/repositories/ServiceRepository';

const serviceRepository = new ServiceRepository();

export async function GET() {
  try {
    console.log('=== DEBUGGING SERVICES ===');
    
    // Get all services
    const allServices = await serviceRepository.findAll();
    console.log('All services:', allServices.map(s => ({
      id: s.id,
      name: s.name,
      parentId: s.parentId,
      isActive: s.isActive
    })));
    
    // Get parent services
    const parentServices = await serviceRepository.findParentServices();
    console.log('Parent services:', parentServices.map(s => ({
      id: s.id,
      name: s.name,
      parentId: s.parentId,
      isActive: s.isActive
    })));
    
    return NextResponse.json({
      success: true,
      data: {
        allServices: allServices.map(s => ({
          id: s.id,
          name: s.name,
          parentId: s.parentId,
          isActive: s.isActive
        })),
        parentServices: parentServices.map(s => ({
          id: s.id,
          name: s.name,
          parentId: s.parentId,
          isActive: s.isActive
        }))
      }
    });
  } catch (error) {
    console.error('Error in test endpoint:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to test services' },
      { status: 500 }
    );
  }
}