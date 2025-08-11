import { Attorney } from '@/app/lib/domain/entities/Attorney';
import { 
  IAttorneyRepository, 
  AttorneyFilters, 
  PaginationOptions, 
  PaginatedResult 
} from '@/app/lib/domain/repositories/IAttorneyRepository';

export interface GetAllAttorneysRequest {
  filters?: AttorneyFilters;
  pagination?: PaginationOptions;
}

export class GetAllAttorneysUseCase {
  constructor(private readonly attorneyRepository: IAttorneyRepository) {}

  async execute(request?: GetAllAttorneysRequest): Promise<PaginatedResult<Attorney>> {
    return await this.attorneyRepository.findAll(request?.filters, request?.pagination);
  }
}