import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClerkClient } from '@clerk/backend';
import { UserRole, ROLE_PERMISSIONS } from '@/app/lib/auth/roles';

export async function POST(request: NextRequest) {
  try {
    // Check if CLERK_SECRET_KEY is available
    if (!process.env.CLERK_SECRET_KEY) {
      console.error('CLERK_SECRET_KEY is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get the secret key from request body
    const body = await request.json();
    const { secretKey } = body;

    // Simple secret key check - in production, use environment variable
    if (secretKey !== 'ALTUM_INIT_ADMIN_2024') {
      return NextResponse.json({ error: 'Invalid secret key' }, { status: 403 });
    }

    // Initialize Clerk client
    const clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    // Check if user already has a role
    const existingUser = await clerkClient.users.getUser(userId);
    const existingRole = (existingUser.publicMetadata as any)?.role;
    
    if (existingRole) {
      return NextResponse.json({ 
        error: `User already has role: ${existingRole}` 
      }, { status: 400 });
    }

    console.log('Updating user metadata for userId:', userId);
    
    // Update user to SuperAdmin
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: UserRole.SUPERADMIN,
        displayName: `${existingUser.firstName} ${existingUser.lastName}`,
        department: 'Administration'
      },
      privateMetadata: {
        permissions: ROLE_PERMISSIONS[UserRole.SUPERADMIN],
        createdBy: 'SYSTEM_INIT',
        lastLogin: new Date().toISOString(),
        notes: 'Initial admin setup'
      }
    });

    console.log('User metadata updated successfully');

    return NextResponse.json({ 
      success: true, 
      message: 'SuperAdmin role assigned successfully',
      user: {
        id: userId,
        email: existingUser.emailAddresses[0]?.emailAddress,
        role: UserRole.SUPERADMIN
      }
    });

  } catch (error) {
    console.error('Error initializing admin:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to initialize admin role',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}