import { Attorney } from '@/app/lib/domain/entities/Attorney';
import { IAttorneyRepository } from '@/app/lib/domain/repositories/IAttorneyRepository';

export class GetPartnersUseCase {
  constructor(private readonly attorneyRepository: IAttorneyRepository) {}

  async execute(): Promise<Attorney[]> {
    return await this.attorneyRepository.findPartners();
  }
}