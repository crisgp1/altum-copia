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

    // Validar que el correo tenga un dominio de ALTUM Legal
    const validDomains = ['@altumlegal.mx', '@altum-legal.mx'];
    const hasValidDomain = validDomains.some(domain => request.correo.toLowerCase().includes(domain));

    if (!hasValidDomain) {
      throw new Error('El correo debe tener un dominio válido de ALTUM Legal (@altumlegal.mx o @altum-legal.mx)');
    }

    // Crear la entidad Attorney
    const attorney = Attorney.create(request);

    // Guardar en el repositorio
    return await this.attorneyRepository.save(attorney);
  }
}