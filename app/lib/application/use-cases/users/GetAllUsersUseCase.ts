import { User } from '@/app/lib/domain/entities/User';
import { 
  IUserRepository, 
  UserFilters, 
  PaginationOptions, 
  PaginatedResult 
} from '@/app/lib/domain/repositories/IUserRepository';

export interface GetAllUsersRequest {
  filters?: UserFilters;
  pagination?: PaginationOptions;
}

export class GetAllUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(request?: GetAllUsersRequest): Promise<PaginatedResult<User>> {
    return await this.userRepository.findAll(request?.filters, request?.pagination);
  }
}