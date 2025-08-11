import { Attorney, AttorneyProps } from '@/app/lib/domain/entities/Attorney';
import { IAttorneyRepository } from '@/app/lib/domain/repositories/IAttorneyRepository';

export type CreateAttorneyRequest = Omit<AttorneyProps, 'id' | 'fechaCreacion' | 'fechaActualizacion'>;

export class EmailAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`An attorney with email ${email} already exists`);
    this.name = 'EmailAlreadyExistsError';
  }
}

export class CreateAttorneyUseCase {
  constructor(private readonly attorneyRepository: IAttorneyRepository) {}

  async execute(request: CreateAttorneyRequest): Promise<Attorney> {
    // Verificar si ya existe un abogado con el mismo correo
    const existingAttorney = await this.attorneyRepository.findByEmail(request.correo);
    if (existingAttorney) {
      throw new EmailAlreadyExistsError(request.correo);
    }

    // Asegurar que el correo tenga el dominio de ALTUM Legal
    if (!request.correo.includes('@altumlegal.mx')) {
      request.correo = request.correo.split('@')[0] + '@altumlegal.mx';
    }

    // Crear la entidad Attorney
    const attorney = Attorney.create(request);

    // Guardar en el repositorio
    return await this.attorneyRepository.save(attorney);
  }
}