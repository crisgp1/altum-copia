import { Attorney } from '../entities/Attorney';

export interface AttorneyFilters {
  activo?: boolean;
  esSocio?: boolean;
  especializacion?: string;
  nombre?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface IAttorneyRepository {
  findById(id: string): Promise<Attorney | null>;
  findByEmail(email: string): Promise<Attorney | null>;
  findAll(filters?: AttorneyFilters, pagination?: PaginationOptions): Promise<PaginatedResult<Attorney>>;
  findActive(): Promise<Attorney[]>;
  findPartners(): Promise<Attorney[]>;
  findBySpecialization(specialization: string): Promise<Attorney[]>;
  save(attorney: Attorney): Promise<Attorney>;
  update(id: string, attorney: Attorney): Promise<Attorney | null>;
  delete(id: string): Promise<boolean>;
  search(query: string): Promise<Attorney[]>;
}