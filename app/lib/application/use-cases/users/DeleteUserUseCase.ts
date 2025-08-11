import { IUserRepository } from '@/app/lib/domain/repositories/IUserRepository';
import { UserNotFoundError } from './UpdateUserRoleUseCase';

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<void> {
    if (!userId || userId.trim().length === 0) {
      throw new Error('User ID is required');
    }

    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new UserNotFoundError(userId);
    }

    const deleted = await this.userRepository.deleteUser(userId);
    if (!deleted) {
      throw new Error('Failed to delete user');
    }
  }
}