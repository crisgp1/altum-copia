import { 
  AttorneyResponseDTO, 
  CreateAttorneyDTO, 
  UpdateAttorneyDTO,
  PaginatedAttorneysDTO 
} from '@/app/lib/application/dtos/AttorneyDTO';
import { BlobStorageService } from '@/app/lib/services/BlobStorageService';

export interface IAttorneyService {
  getAllAttorneys(filters?: any, pagination?: any): Promise<PaginatedAttorneysDTO>;
  getActiveAttorneys(): Promise<AttorneyResponseDTO[]>;
  getPartners(): Promise<AttorneyResponseDTO[]>;
  getAttorneyById(id: string): Promise<AttorneyResponseDTO>;
  createAttorney(data: CreateAttorneyDTO): Promise<AttorneyResponseDTO>;
  updateAttorney(id: string, data: UpdateAttorneyDTO): Promise<AttorneyResponseDTO>;
  deleteAttorney(id: string): Promise<void>;
  searchAttorneys(query: string): Promise<AttorneyResponseDTO[]>;
  getAttorneysBySpecialization(specialization: string): Promise<AttorneyResponseDTO[]>;
  uploadAttorneyImage(file: File): Promise<string>;
}

export class AttorneyService implements IAttorneyService {
  private baseUrl = '/api/attorneys';

  async getAllAttorneys(filters?: any, pagination?: any): Promise<PaginatedAttorneysDTO> {
    const params = new URLSearchParams();
    if (filters?.activo !== undefined) params.set('activo', filters.activo.toString());
    if (filters?.esSocio !== undefined) params.set('esSocio', filters.esSocio.toString());
    if (filters?.especializacion) params.set('especializacion', filters.especializacion);
    if (filters?.nombre) params.set('nombre', filters.nombre);
    if (pagination?.page) params.set('page', pagination.page.toString());
    if (pagination?.limit) params.set('limit', pagination.limit.toString());
    if (pagination?.sortBy) params.set('sortBy', pagination.sortBy);
    if (pagination?.sortOrder) params.set('sortOrder', pagination.sortOrder);

    const response = await fetch(`${this.baseUrl}?${params}`);
    if (!response.ok) throw new Error('Error al obtener abogados');
    return response.json();
  }

  async getActiveAttorneys(): Promise<AttorneyResponseDTO[]> {
    const response = await fetch(`${this.baseUrl}/active`);
    if (!response.ok) throw new Error('Error al obtener abogados activos');
    return response.json();
  }

  async getPartners(): Promise<AttorneyResponseDTO[]> {
    const response = await fetch(`${this.baseUrl}/partners`);
    if (!response.ok) throw new Error('Error al obtener socios');
    return response.json();
  }

  async getAttorneyById(id: string): Promise<AttorneyResponseDTO> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) throw new Error('Error al obtener abogado');
    return response.json();
  }

  async createAttorney(data: CreateAttorneyDTO): Promise<AttorneyResponseDTO> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al crear abogado');
    }
    return response.json();
  }

  async updateAttorney(id: string, data: UpdateAttorneyDTO): Promise<AttorneyResponseDTO> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al actualizar abogado');
    }
    return response.json();
  }

  async deleteAttorney(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al eliminar abogado');
    }
  }

  async searchAttorneys(query: string): Promise<AttorneyResponseDTO[]> {
    const params = new URLSearchParams({ q: query });
    const response = await fetch(`${this.baseUrl}/search?${params}`);
    if (!response.ok) throw new Error('Error al buscar abogados');
    return response.json();
  }

  async getAttorneysBySpecialization(specialization: string): Promise<AttorneyResponseDTO[]> {
    const response = await fetch(`${this.baseUrl}/specialization/${encodeURIComponent(specialization)}`);
    if (!response.ok) throw new Error('Error al obtener abogados por especialización');
    return response.json();
  }

  async uploadAttorneyImage(file: File): Promise<string> {
    // Validate file before upload
    const validation = BlobStorageService.validateFile(file, {
      maxSize: BlobStorageService.SIZE_PRESETS.MEDIUM,
      allowedTypes: BlobStorageService.FILE_TYPE_PRESETS.IMAGES
    });

    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Upload using the new blob storage service
    const result = await BlobStorageService.uploadAttorneyImage(file);
    
    if (!result.success) {
      throw new Error(result.error || 'Error al subir la imagen');
    }

    return result.url!;
  }
}