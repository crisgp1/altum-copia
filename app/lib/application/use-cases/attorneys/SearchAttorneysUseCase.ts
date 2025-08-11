import { Attorney } from '@/app/lib/domain/entities/Attorney';
import { IAttorneyRepository } from '@/app/lib/domain/repositories/IAttorneyRepository';

export class SearchAttorneysUseCase {
  constructor(private readonly attorneyRepository: IAttorneyRepository) {}

  async execute(query: string): Promise<Attorney[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }

    return await this.attorneyRepository.search(query);
  }
}