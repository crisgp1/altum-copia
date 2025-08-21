import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { auth } from '@clerk/nextjs/server';
import { UserRole } from '@/app/lib/auth/roles';

// POST /api/admin/invitations/[id]/revoke - Revoke invitation
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const invitationId = params.id;

    if (!invitationId) {
      return NextResponse.json(
        { success: false, error: 'ID de invitación requerido' },
        { status: 400 }
      );
    }

    // Revoke the invitation
    await clerkInstance.invitations.revokeInvitation(invitationId);

    return NextResponse.json({
      success: true,
      message: 'Invitación revocada exitosamente'
    });
  } catch (error: any) {
    console.error('Error revoking invitation:', error);
    
    // Handle specific Clerk errors
    if (error.clerkError) {
      return NextResponse.json(
        { 
          success: false, 
          error: error.longMessage || 'Error al revocar la invitación' 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al revocar la invitación' 
      },
      { status: 500 }
    );
  }
}