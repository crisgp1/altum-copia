import { User } from '@/app/lib/domain/entities/User';
import { 
  IUserRepository, 
  UserFilters, 
  PaginationOptions, 
  PaginatedResult 
} from '@/app/lib/domain/repositories/IUserRepository';
import { clerkClient } from '@clerk/nextjs/server';

export class ClerkUserRepository implements IUserRepository {
  
  private mapClerkUserToDomain(clerkUser: any): User {
    // Get metadata for role and permissions
    const metadata = clerkUser.publicMetadata || {};
    const role = metadata.role || 'user';
    const permissions = metadata.permissions || [];
    
    return User.create({
      id: clerkUser.id,
      email: clerkUser.emailAddresses?.[0]?.emailAddress || '',
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
      role,
      permissions,
      isActive: !clerkUser.banned,
      lastSignInAt: clerkUser.lastSignInAt ? new Date(clerkUser.lastSignInAt) : undefined
    });
  }

  async findById(id: string): Promise<User | null> {
    try {
      const clerkUser = await clerkClient.users.getUser(id);
      return this.mapClerkUserToDomain(clerkUser);
    } catch (error) {
      console.error('Error finding user by id:', error);
      return null;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const response = await clerkClient.users.getUserList({
        emailAddress: [email],
        limit: 1
      });
      
      if (response.data.length === 0) return null;
      
      return this.mapClerkUserToDomain(response.data[0]);
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  async findAll(
    filters?: UserFilters, 
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<User>> {
    try {
      const limit = pagination?.limit || 10;
      const offset = ((pagination?.page || 1) - 1) * limit;
      
      // Build query parameters
      const query: any = {
        limit,
        offset,
        orderBy: pagination?.sortOrder === 'desc' ? '-created_at' : '+created_at'
      };

      // Add search query if provided
      if (filters?.searchTerm) {
        query.query = filters.searchTerm;
      }

      const response = await clerkClient.users.getUserList(query);
      
      // Filter users based on additional criteria
      let filteredUsers = response.data.map(user => this.mapClerkUserToDomain(user));
      
      if (filters?.role) {
        filteredUsers = filteredUsers.filter(user => user.role === filters.role);
      }
      
      if (filters?.isActive !== undefined) {
        filteredUsers = filteredUsers.filter(user => user.isActive === filters.isActive);
      }

      const total = response.totalCount || filteredUsers.length;
      const totalPages = Math.ceil(total / limit);
      const currentPage = pagination?.page || 1;

      return {
        data: filteredUsers,
        total,
        page: currentPage,
        totalPages,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1
      };
    } catch (error) {
      console.error('Error finding all users:', error);
      return {
        data: [],
        total: 0,
        page: 1,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      };
    }
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    try {
      const updateData: any = {};
      
      // Update basic profile information
      if (updates.firstName !== undefined) updateData.firstName = updates.firstName;
      if (updates.lastName !== undefined) updateData.lastName = updates.lastName;
      
      // Update metadata for role and permissions
      if (updates.role !== undefined || updates.permissions !== undefined) {
        const currentUser = await this.findById(id);
        if (currentUser) {
          updateData.publicMetadata = {
            role: updates.role || currentUser.role,
            permissions: updates.permissions || currentUser.permissions
          };
        }
      }

      const updatedClerkUser = await clerkClient.users.updateUser(id, updateData);
      return this.mapClerkUserToDomain(updatedClerkUser);
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      await clerkClient.users.deleteUser(id);
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  async getUsersByRole(role: string): Promise<User[]> {
    try {
      const response = await clerkClient.users.getUserList({
        limit: 100 // Get a large number to filter by role
      });
      
      const users = response.data.map(user => this.mapClerkUserToDomain(user));
      return users.filter(user => user.role === role);
    } catch (error) {
      console.error('Error getting users by role:', error);
      return [];
    }
  }

  async searchUsers(query: string): Promise<User[]> {
    try {
      const response = await clerkClient.users.getUserList({
        query,
        limit: 50
      });
      
      return response.data.map(user => this.mapClerkUserToDomain(user));
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }

  async banUser(id: string): Promise<boolean> {
    try {
      await clerkClient.users.banUser(id);
      return true;
    } catch (error) {
      console.error('Error banning user:', error);
      return false;
    }
  }

  async unbanUser(id: string): Promise<boolean> {
    try {
      await clerkClient.users.unbanUser(id);
      return true;
    } catch (error) {
      console.error('Error unbanning user:', error);
      return false;
    }
  }
}