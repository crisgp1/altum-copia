import { Attorney } from '@/app/lib/domain/entities/Attorney';
import { IAttorneyRepository } from '@/app/lib/domain/repositories/IAttorneyRepository';

export class GetAttorneysBySpecializationUseCase {
  constructor(private readonly attorneyRepository: IAttorneyRepository) {}

  async execute(specialization: string): Promise<Attorney[]> {
    if (!specialization || specialization.trim().length === 0) {
      throw new Error('Specialization is required');
    }

    return await this.attorneyRepository.findBySpecialization(specialization);
  }
}