import { Service } from '@/app/lib/domain/entities/Service';
import { IServiceRepository } from '@/app/lib/domain/repositories/IServiceRepository';
import { ServiceModel, IServiceDocument } from '../mongodb/models/ServiceModel';
import dbConnect from '../mongodb/connection';

export class ServiceRepository implements IServiceRepository {
  async findById(id: string): Promise<Service | null> {
    await dbConnect();
    const doc = await ServiceModel.findById(id);
    return doc ? this.toDomain(doc) : null;
  }

  async findBySlug(slug: string): Promise<Service | null> {
    await dbConnect();
    const doc = await ServiceModel.findOne({
      name: new RegExp(`^${slug.replace(/-/g, ' ')}$`, 'i')
    });
    return doc ? this.toDomain(doc) : null;
  }

  async findAll(): Promise<Service[]> {
    await dbConnect();
    const docs = await ServiceModel.find().sort({ order: 1 });
    return docs.map(doc => this.toDomain(doc));
  }

  async findActive(): Promise<Service[]> {
    await dbConnect();
    const docs = await ServiceModel.find({ isActive: true }).sort({ order: 1 });
    return docs.map(doc => this.toDomain(doc));
  }

  async findByParentId(parentId: string | null): Promise<Service[]> {
    await dbConnect();
    let query;
    if (parentId === null || parentId === "" || parentId === undefined) {
      // Find services without parent (parent services)
      query = {
        $or: [
          { parentId: null },
          { parentId: { $exists: false } },
          { parentId: "" }
        ],
        isActive: true
      };
    } else {
      // Find services with specific parent
      query = {
        parentId: parentId,
        isActive: true
      };
    }
    
    const docs = await ServiceModel.find(query).sort({ order: 1 });
    return docs.map(doc => this.toDomain(doc));
  }

  async findParentServices(): Promise<Service[]> {
    await dbConnect();
    const docs = await ServiceModel.find({ 
      $or: [
        { parentId: null },
        { parentId: { $exists: false } },
        { parentId: "" }
      ],
      isActive: true 
    }).sort({ order: 1 });
    return docs.map(doc => this.toDomain(doc));
  }

  async save(service: Service): Promise<void> {
    await dbConnect();
    const doc = new ServiceModel(this.toPersistence(service));
    await doc.save();
  }

  async create(service: Service): Promise<Service> {
    await dbConnect();
    const doc = new ServiceModel(this.toPersistence(service));
    await doc.save();
    return this.toDomain(doc);
  }

  async update(service: Service): Promise<void> {
    await dbConnect();
    await ServiceModel.findByIdAndUpdate(
      service.id,
      this.toPersistence(service),
      { new: true }
    );
  }

  async delete(id: string): Promise<void> {
    await dbConnect();
    await ServiceModel.findByIdAndDelete(id);
  }

  private toDomain(doc: IServiceDocument): Service {
    return new Service({
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      shortDescription: doc.shortDescription,
      iconUrl: doc.iconUrl,
      parentId: doc.parentId,
      order: doc.order,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    });
  }

  private toPersistence(service: Service): Partial<IServiceDocument> {
    return {
      name: service.name,
      description: service.description,
      shortDescription: service.shortDescription,
      iconUrl: service.iconUrl,
      parentId: service.parentId,
      order: service.order,
      isActive: service.isActive
    };
  }
}