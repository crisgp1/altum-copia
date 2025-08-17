import { createClerkClient } from '@clerk/backend';
import { UserRole, UserPublicMetadata, UserPrivateMetadata, ROLE_PERMISSIONS } from './roles';

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export async function updateUserRole(userId: string, role: UserRole, updatedBy: string) {
  const permissions = ROLE_PERMISSIONS[role] || [];
  
  try {
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role,
        department: 'Legal',
        ...{} as any
      },
      privateMetadata: {
        permissions,
        createdBy: updatedBy,
        lastLogin: new Date().toISOString(),
        ...{} as any
      }
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating user role:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getUserRole(userId: string): Promise<UserRole> {
  try {
    const user = await clerkClient.users.getUser(userId);
    const metadata = user.publicMetadata as any;
    return metadata.role || UserRole.USER;
  } catch (error) {
    console.error('Error getting user role:', error);
    return UserRole.USER;
  }
}

export async function getUserPermissions(userId: string): Promise<string[]> {
  try {
    const user = await clerkClient.users.getUser(userId);
    const metadata = user.privateMetadata as any;
    return metadata.permissions || [];
  } catch (error) {
    console.error('Error getting user permissions:', error);
    return [];
  }
}

export async function getAllUsers() {
  try {
    const response = await clerkClient.users.getUserList({
      limit: 100,
      orderBy: '-created_at'
    });
    
    return response.data.map(user => ({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      role: (user.publicMetadata as any)?.role || UserRole.USER,
      createdAt: user.createdAt,
      lastSignInAt: user.lastSignInAt,
      department: (user.publicMetadata as any)?.department
    }));
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
}

export async function deleteUser(userId: string) {
  try {
    await clerkClient.users.deleteUser(userId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}