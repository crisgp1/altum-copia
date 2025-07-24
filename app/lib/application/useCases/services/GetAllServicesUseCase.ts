import { Service } from '@/app/lib/domain/entities/Service';
import { IServiceRepository } from '@/app/lib/domain/repositories/IServiceRepository';

export class GetAllServicesUseCase {
  constructor(private serviceRepository: IServiceRepository) {}

  async execute(onlyActive: boolean = true): Promise<Service[]> {
    if (onlyActive) {
      return await this.serviceRepository.findActive();
    }
    return await this.serviceRepository.findAll();
  }
}