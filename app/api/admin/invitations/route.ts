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

    // Validate email format - RFC 5322 compliant
    // Allows hyphens, plus signs, dots, and other valid characters
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(emailAddress)) {
      return NextResponse.json(
        { success: false, error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    try {
      // First, check if user already exists
      const existingUsers = await clerkInstance.users.getUserList({
        emailAddress: [emailAddress]
      });

      if (existingUsers.totalCount > 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Este email ya está registrado en el sistema' 
          },
          { status: 400 }
        );
      }

      // Create invitation with simplified structure
      const invitation = await clerkInstance.invitations.createInvitation({
        emailAddress,
        publicMetadata: {
          role,
          invitedBy: userId,
          invitedAt: new Date().toISOString()
        },
        redirectUrl: redirectUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/sign-up`
      });

      return NextResponse.json({
        success: true,
        data: invitation,
        message: 'Invitación enviada exitosamente'
      });
    } catch (inviteError: any) {
      console.error('Invitation creation error details:', inviteError);
      
      // If it's an "already exists" error, provide a clear message
      if (inviteError.message?.includes('already') || inviteError.errors?.[0]?.message?.includes('already')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Ya existe una invitación pendiente para este email' 
          },
          { status: 400 }
        );
      }
      
      throw inviteError; // Re-throw to be caught by outer catch
    }
  } catch (error: any) {
    console.error('Error creating invitation:', error);
    
    // Handle specific Clerk errors
    if (error.clerkError) {
      // Extract detailed error message
      let errorMessage = 'Error al crear la invitación';
      
      if (error.errors && error.errors.length > 0) {
        errorMessage = error.errors[0].message || error.errors[0].longMessage || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Check for common invitation errors
      if (errorMessage.includes('already exists') || errorMessage.includes('already has an account')) {
        errorMessage = 'Este email ya está registrado en el sistema';
      } else if (errorMessage.includes('already been sent')) {
        errorMessage = 'Ya existe una invitación pendiente para este email';
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: errorMessage
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