import { Attorney } from '@/app/lib/domain/entities/Attorney';
import {
  AttorneyResponseDTO,
  AttorneyPublicDTO,
  AttorneyListItemDTO,
  CreateAttorneyDTO,
  UpdateAttorneyDTO,
  PaginatedAttorneysDTO
} from '../dtos/AttorneyDTO';
import { PaginatedResult } from '@/app/lib/domain/repositories/IAttorneyRepository';

export class AttorneyMapper {
  
  static toResponseDTO(attorney: Attorney): AttorneyResponseDTO {
    return {
      id: attorney.id!,
      slug: attorney.slug,
      nombre: attorney.nombre,
      cargo: attorney.cargo,
      especializaciones: attorney.especializaciones,
      serviciosQueAtiende: attorney.serviciosQueAtiende,
      experienciaAnios: attorney.experienciaAnios,
      educacion: attorney.educacion,
      idiomas: attorney.idiomas,
      correo: attorney.correo,
      telefono: attorney.telefono,
      biografia: attorney.biografia,
      logros: attorney.logros,
      casosDestacados: attorney.casosDestacados,
      imagenUrl: attorney.imagenUrl,
      linkedIn: attorney.linkedIn,
      esSocio: attorney.esSocio,
      descripcionCorta: attorney.descripcionCorta,
      activo: attorney.activo
    };
  }

  static toPublicDTO(attorney: Attorney): AttorneyPublicDTO {
    const publicInfo = attorney.getPublicInfo();
    return {
      id: attorney.id!,
      slug: attorney.slug,
      nombre: publicInfo.nombre,
      cargo: publicInfo.cargo,
      especializaciones: publicInfo.especializaciones,
      serviciosQueAtiende: publicInfo.serviciosQueAtiende,
      experienciaAnios: publicInfo.experienciaAnios,
      educacion: publicInfo.educacion,
      idiomas: publicInfo.idiomas,
      correo: publicInfo.correo, // Incluido para contacto por email
      telefono: publicInfo.telefono, // Incluido para contacto por WhatsApp
      biografia: publicInfo.biografia,
      logros: publicInfo.logros,
      casosDestacados: publicInfo.casosDestacados,
      imagenUrl: publicInfo.imagenUrl,
      linkedIn: publicInfo.linkedIn,
      esSocio: publicInfo.esSocio,
      descripcionCorta: publicInfo.descripcionCorta
    };
  }

  static toListItemDTO(attorney: Attorney): AttorneyListItemDTO {
    return {
      id: attorney.id!,
      slug: attorney.slug,
      nombre: attorney.nombre,
      cargo: attorney.cargo,
      especializaciones: attorney.especializaciones,
      serviciosQueAtiende: attorney.serviciosQueAtiende,
      experienciaAnios: attorney.experienciaAnios,
      imagenUrl: attorney.imagenUrl,
      esSocio: attorney.esSocio,
      descripcionCorta: attorney.descripcionCorta
    };
  }

  static toPaginatedDTO(result: PaginatedResult<Attorney>): PaginatedAttorneysDTO {
    return {
      attorneys: result.data.map(attorney => this.toResponseDTO(attorney) as any),
      pagination: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
        hasNext: result.hasNext,
        hasPrev: result.hasPrev
      }
    };
  }

  static fromCreateDTO(dto: CreateAttorneyDTO): Omit<CreateAttorneyDTO, 'id'> {
    return {
      nombre: dto.nombre,
      cargo: dto.cargo,
      especializaciones: dto.especializaciones,
      serviciosQueAtiende: dto.serviciosQueAtiende,
      experienciaAnios: dto.experienciaAnios,
      educacion: dto.educacion,
      idiomas: dto.idiomas,
      correo: dto.correo,
      telefono: dto.telefono,
      biografia: dto.biografia,
      logros: dto.logros || [],
      casosDestacados: dto.casosDestacados || [],
      imagenUrl: dto.imagenUrl,
      linkedIn: dto.linkedIn,
      esSocio: dto.esSocio || false,
      descripcionCorta: dto.descripcionCorta,
      activo: dto.activo ?? true
    };
  }

  static fromUpdateDTO(dto: UpdateAttorneyDTO): UpdateAttorneyDTO {
    const update: any = {};
    
    if (dto.nombre !== undefined) update.nombre = dto.nombre;
    if (dto.cargo !== undefined) update.cargo = dto.cargo;
    if (dto.especializaciones !== undefined) update.especializaciones = dto.especializaciones;
    if (dto.serviciosQueAtiende !== undefined) update.serviciosQueAtiende = dto.serviciosQueAtiende;
    if (dto.experienciaAnios !== undefined) update.experienciaAnios = dto.experienciaAnios;
    if (dto.educacion !== undefined) update.educacion = dto.educacion;
    if (dto.idiomas !== undefined) update.idiomas = dto.idiomas;
    if (dto.correo !== undefined) update.correo = dto.correo;
    if (dto.telefono !== undefined) update.telefono = dto.telefono;
    if (dto.biografia !== undefined) update.biografia = dto.biografia;
    if (dto.logros !== undefined) update.logros = dto.logros;
    if (dto.casosDestacados !== undefined) update.casosDestacados = dto.casosDestacados;
    if (dto.imagenUrl !== undefined) update.imagenUrl = dto.imagenUrl;
    if (dto.linkedIn !== undefined) update.linkedIn = dto.linkedIn;
    if (dto.esSocio !== undefined) update.esSocio = dto.esSocio;
    if (dto.descripcionCorta !== undefined) update.descripcionCorta = dto.descripcionCorta;
    if (dto.activo !== undefined) update.activo = dto.activo;
    
    return update;
  }
}