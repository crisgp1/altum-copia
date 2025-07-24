import { Service } from '../entities/Service';

export interface IServiceRepository {
  findById(id: string): Promise<Service | null>;
  findBySlug(slug: string): Promise<Service | null>;
  findAll(): Promise<Service[]>;
  findActive(): Promise<Service[]>;
  save(service: Service): Promise<void>;
  update(service: Service): Promise<void>;
  delete(id: string): Promise<void>;
}