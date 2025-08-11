import { IAttorneyRepository } from '@/app/lib/domain/repositories/IAttorneyRepository';
import { AttorneyNotFoundError } from './GetAttorneyByIdUseCase';

export class DeleteAttorneyUseCase {
  constructor(private readonly attorneyRepository: IAttorneyRepository) {}

  async execute(id: string): Promise<void> {
    if (!id || id.trim().length === 0) {
      throw new Error('Attorney ID is required');
    }

    // Verificar que el abogado existe
    const attorney = await this.attorneyRepository.findById(id);
    if (!attorney) {
      throw new AttorneyNotFoundError(id);
    }

    // Eliminar el abogado
    const deleted = await this.attorneyRepository.delete(id);
    if (!deleted) {
      throw new Error('Error al eliminar el abogado');
    }
  }
}