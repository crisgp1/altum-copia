import { IAttorneyRepository } from '@/app/lib/domain/repositories/IAttorneyRepository';
import { MongoAttorneyRepository } from '@/app/lib/infrastructure/persistence/mongodb/repositories/MongoAttorneyRepository';
import { GetAllAttorneysUseCase } from '@/app/lib/application/use-cases/attorneys/GetAllAttorneysUseCase';
import { GetAttorneyByIdUseCase } from '@/app/lib/application/use-cases/attorneys/GetAttorneyByIdUseCase';
import { CreateAttorneyUseCase } from '@/app/lib/application/use-cases/attorneys/CreateAttorneyUseCase';
import { UpdateAttorneyUseCase } from '@/app/lib/application/use-cases/attorneys/UpdateAttorneyUseCase';
import { DeleteAttorneyUseCase } from '@/app/lib/application/use-cases/attorneys/DeleteAttorneyUseCase';
import { GetActiveAttorneysUseCase } from '@/app/lib/application/use-cases/attorneys/GetActiveAttorneysUseCase';
import { GetPartnersUseCase } from '@/app/lib/application/use-cases/attorneys/GetPartnersUseCase';
import { SearchAttorneysUseCase } from '@/app/lib/application/use-cases/attorneys/SearchAttorneysUseCase';
import { GetAttorneysBySpecializationUseCase } from '@/app/lib/application/use-cases/attorneys/GetAttorneysBySpecializationUseCase';

export class DIContainer {
  private static instance: DIContainer;
  private attorneyRepository: IAttorneyRepository;

  private constructor() {
    this.attorneyRepository = new MongoAttorneyRepository();
  }

  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  // Repositories
  public getAttorneyRepository(): IAttorneyRepository {
    return this.attorneyRepository;
  }

  // Use Cases
  public getGetAllAttorneysUseCase(): GetAllAttorneysUseCase {
    return new GetAllAttorneysUseCase(this.attorneyRepository);
  }

  public getGetAttorneyByIdUseCase(): GetAttorneyByIdUseCase {
    return new GetAttorneyByIdUseCase(this.attorneyRepository);
  }

  public getCreateAttorneyUseCase(): CreateAttorneyUseCase {
    return new CreateAttorneyUseCase(this.attorneyRepository);
  }

  public getUpdateAttorneyUseCase(): UpdateAttorneyUseCase {
    return new UpdateAttorneyUseCase(this.attorneyRepository);
  }

  public getDeleteAttorneyUseCase(): DeleteAttorneyUseCase {
    return new DeleteAttorneyUseCase(this.attorneyRepository);
  }

  public getGetActiveAttorneysUseCase(): GetActiveAttorneysUseCase {
    return new GetActiveAttorneysUseCase(this.attorneyRepository);
  }

  public getGetPartnersUseCase(): GetPartnersUseCase {
    return new GetPartnersUseCase(this.attorneyRepository);
  }

  public getSearchAttorneysUseCase(): SearchAttorneysUseCase {
    return new SearchAttorneysUseCase(this.attorneyRepository);
  }

  public getGetAttorneysBySpecializationUseCase(): GetAttorneysBySpecializationUseCase {
    return new GetAttorneysBySpecializationUseCase(this.attorneyRepository);
  }
}