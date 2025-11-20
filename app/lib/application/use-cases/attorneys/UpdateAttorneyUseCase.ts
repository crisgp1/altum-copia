import { Attorney, AttorneyProps } from '@/app/lib/domain/entities/Attorney';
import { IAttorneyRepository } from '@/app/lib/domain/repositories/IAttorneyRepository';
import { AttorneyNotFoundError } from './GetAttorneyByIdUseCase';

export type UpdateAttorneyRequest = Partial<Omit<AttorneyProps, 'id' | 'fechaCreacion' | 'fechaActualizacion'>>;

export class UpdateAttorneyUseCase {
  constructor(private readonly attorneyRepository: IAttorneyRepository) {}

  async execute(id: string, request: UpdateAttorneyRequest): Promise<Attorney> {
    if (!id || id.trim().length === 0) {
      throw new Error('Attorney ID is required');
    }

    // Obtener el abogado existente
    const existingAttorney = await this.attorneyRepository.findById(id);
    if (!existingAttorney) {
      throw new AttorneyNotFoundError(id);
    }

    // Si se está actualizando el correo, verificar que no esté en uso
    if (request.correo && request.correo !== existingAttorney.correo) {
      const attorneyWithEmail = await this.attorneyRepository.findByEmail(request.correo);
      if (attorneyWithEmail && attorneyWithEmail.id !== id) {
        throw new Error(`El correo ${request.correo} ya está en uso por otro abogado`);
      }

      // Validar que el correo tenga un dominio de ALTUM Legal
      const validDomains = ['@altumlegal.mx', '@altum-legal.mx'];
      const hasValidDomain = validDomains.some(domain => request.correo!.toLowerCase().includes(domain));

      if (!hasValidDomain) {
        throw new Error('El correo debe tener un dominio válido de ALTUM Legal (@altumlegal.mx o @altum-legal.mx)');
      }
    }

    // Actualizar la entidad
    const updatedAttorney = existingAttorney.update(request);

    // Guardar los cambios
    const saved = await this.attorneyRepository.update(id, updatedAttorney);
    if (!saved) {
      throw new Error('Error al actualizar el abogado');
    }

    return saved;
  }
}