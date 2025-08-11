import { User } from '@/app/lib/domain/entities/User';
import { IUserRepository } from '@/app/lib/domain/repositories/IUserRepository';

export interface UpdateUserRoleRequest {
  userId: string;
  role: string;
  permissions: string[];
}

export class UserNotFoundError extends Error {
  constructor(id: string) {
    super(`User with id ${id} not found`);
    this.name = 'UserNotFoundError';
  }
}

export class UpdateUserRoleUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(request: UpdateUserRoleRequest): Promise<User> {
    const { userId, role, permissions } = request;

    if (!userId || userId.trim().length === 0) {
      throw new Error('User ID is required');
    }

    if (!role || role.trim().length === 0) {
      throw new Error('Role is required');
    }

    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new UserNotFoundError(userId);
    }

    const updatedUser = await this.userRepository.updateUser(userId, {
      role,
      permissions
    });

    if (!updatedUser) {
      throw new Error('Failed to update user role');
    }

    return updatedUser;
  }
}