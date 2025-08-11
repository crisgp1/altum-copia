import { Attorney } from '@/app/lib/domain/entities/Attorney';
import { IAttorneyRepository } from '@/app/lib/domain/repositories/IAttorneyRepository';

export class AttorneyNotFoundError extends Error {
  constructor(id: string) {
    super(`Attorney with id ${id} not found`);
    this.name = 'AttorneyNotFoundError';
  }
}

export class GetAttorneyByIdUseCase {
  constructor(private readonly attorneyRepository: IAttorneyRepository) {}

  async execute(id: string): Promise<Attorney> {
    if (!id || id.trim().length === 0) {
      throw new Error('Attorney ID is required');
    }

    const attorney = await this.attorneyRepository.findById(id);
    
    if (!attorney) {
      throw new AttorneyNotFoundError(id);
    }

    return attorney;
  }
}