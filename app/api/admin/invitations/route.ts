import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { auth } from '@clerk/nextjs/server';
import { UserRole } from '@/app/lib/auth/roles';

// GET /api/admin/invitations - Get all invitations
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const clerkInstance = await clerkClient();
    
    // Get current user to check permissions
    const currentUser = await clerkInstance.users.getUser(userId);
    const userRole = currentUser.publicMetadata?.role as UserRole;
    
    if (!userRole || ![UserRole.SUPERADMIN, UserRole.ADMIN].includes(userRole)) {
      return NextResponse.json(
        { success: false, error: 'Permisos insuficientes' },
        { status: 403 }
      );
    }

    // Get all invitations
    const invitations = await clerkInstance.invitations.getInvitationList();

    return NextResponse.json({
      success: true,
      data: invitations.data
    });
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al cargar invitaciones' 
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/invitations - Create new invitation
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const clerkInstance = await clerkClient();
    
    // Get current user to check permissions
    const currentUser = await clerkInstance.users.getUser(userId);
    const userRole = currentUser.publicMetadata?.role as UserRole;
    
    if (!userRole || ![UserRole.SUPERADMIN, UserRole.ADMIN].includes(userRole)) {
      return NextResponse.json(
        { success: false, error: 'Permisos insuficientes' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { emailAddress, role = UserRole.USER, redirectUrl } = body;

    if (!emailAddress) {
      return NextResponse.json(
        { success: false, error: 'Email es requerido' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress)) {
      return NextResponse.json(
        { success: false, error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    // Create invitation with metadata
    const invitationData: any = {
      emailAddress,
      publicMetadata: {
        role,
        invitedBy: userId,
        invitedAt: new Date().toISOString()
      }
    };

    // Add redirectUrl only if provided
    if (redirectUrl) {
      invitationData.redirectUrl = redirectUrl;
    }

    const invitation = await clerkInstance.invitations.createInvitation(invitationData);

    return NextResponse.json({
      success: true,
      data: invitation,
      message: 'Invitación enviada exitosamente'
    });
  } catch (error: any) {
    console.error('Error creating invitation:', error);
    
    // Handle specific Clerk errors
    if (error.clerkError) {
      return NextResponse.json(
        { 
          success: false, 
          error: error.longMessage || 'Error al crear la invitación' 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al crear la invitación' 
      },
      { status: 500 }
    );
  }
}