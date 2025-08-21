export interface AttorneyResponseDTO {
  id: string;
  nombre: string;
  cargo: string;
  especializaciones: string[];
  serviciosQueAtiende: string[];
  experienciaAnios: number;
  educacion: string[];
  idiomas: string[];
  correo?: string;
  telefono?: string;
  biografia: string;
  logros: string[];
  casosDestacados: string[];
  imagenUrl?: string;
  linkedIn?: string;
  esSocio: boolean;
  descripcionCorta: string;
}

export interface AttorneyPublicDTO {
  id: string;
  nombre: string;
  cargo: string;
  especializaciones: string[];
  serviciosQueAtiende: string[];
  experienciaAnios: number;
  educacion: string[];
  idiomas: string[];
  biografia: string;
  logros: string[];
  casosDestacados: string[];
  imagenUrl?: string;
  linkedIn?: string;
  esSocio: boolean;
  descripcionCorta: string;
}

export interface AttorneyListItemDTO {
  id: string;
  nombre: string;
  cargo: string;
  especializaciones: string[];
  serviciosQueAtiende: string[];
  experienciaAnios: number;
  imagenUrl?: string;
  esSocio: boolean;
  descripcionCorta: string;
}

export interface CreateAttorneyDTO {
  nombre: string;
  cargo: string;
  especializaciones: string[];
  serviciosQueAtiende: string[];
  experienciaAnios: number;
  educacion: string[];
  idiomas: string[];
  correo: string;
  telefono: string;
  biografia: string;
  logros?: string[];
  casosDestacados?: string[];
  imagenUrl?: string;
  linkedIn?: string;
  esSocio?: boolean;
  descripcionCorta: string;
  activo?: boolean;
}

export interface UpdateAttorneyDTO {
  nombre?: string;
  cargo?: string;
  especializaciones?: string[];
  serviciosQueAtiende?: string[];
  experienciaAnios?: number;
  educacion?: string[];
  idiomas?: string[];
  correo?: string;
  telefono?: string;
  biografia?: string;
  logros?: string[];
  casosDestacados?: string[];
  imagenUrl?: string;
  linkedIn?: string;
  esSocio?: boolean;
  descripcionCorta?: string;
  activo?: boolean;
}

export interface PaginatedAttorneysDTO {
  attorneys: AttorneyListItemDTO[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}