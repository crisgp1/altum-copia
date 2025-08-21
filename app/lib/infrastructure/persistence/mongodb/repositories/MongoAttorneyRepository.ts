import { Attorney, AttorneyProps } from '@/app/lib/domain/entities/Attorney';
import { 
  IAttorneyRepository, 
  AttorneyFilters, 
  PaginationOptions, 
  PaginatedResult 
} from '@/app/lib/domain/repositories/IAttorneyRepository';
import { AttorneyModel, IAttorneyDocument } from '../models/AttorneyModel';

export class MongoAttorneyRepository implements IAttorneyRepository {
  
  private toDomain(document: IAttorneyDocument): Attorney {
    return new Attorney({
      id: (document._id as any).toString(),
      nombre: document.nombre,
      cargo: document.cargo,
      especializaciones: document.especializaciones || [],
      serviciosQueAtiende: document.serviciosQueAtiende || [],
      experienciaAnios: document.experienciaAnios,
      educacion: document.educacion || [],
      idiomas: document.idiomas || [],
      correo: document.correo,
      telefono: document.telefono,
      biografia: document.biografia,
      logros: document.logros || [],
      casosDestacados: document.casosDestacados || [],
      imagenUrl: document.imagenUrl,
      linkedIn: document.linkedIn,
      esSocio: document.esSocio,
      descripcionCorta: document.descripcionCorta,
      activo: document.activo,
      fechaCreacion: document.fechaCreacion,
      fechaActualizacion: document.fechaActualizacion
    });
  }

  private toPersistence(attorney: Attorney): Omit<AttorneyProps, 'id'> {
    const data = attorney.toJSON();
    const { id, ...persistenceData } = data;
    return persistenceData;
  }

  async findById(id: string): Promise<Attorney | null> {
    try {
      const document = await AttorneyModel.findById(id);
      return document ? this.toDomain(document) : null;
    } catch (error) {
      console.error('Error finding attorney by id:', error);
      return null;
    }
  }

  async findByEmail(email: string): Promise<Attorney | null> {
    try {
      const document = await AttorneyModel.findOne({ correo: email });
      return document ? this.toDomain(document) : null;
    } catch (error) {
      console.error('Error finding attorney by email:', error);
      return null;
    }
  }

  async findAll(
    filters?: AttorneyFilters, 
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<Attorney>> {
    try {
      const query: any = {};
      
      if (filters) {
        if (filters.activo !== undefined) query.activo = filters.activo;
        if (filters.esSocio !== undefined) query.esSocio = filters.esSocio;
        if (filters.especializacion) {
          query.especializaciones = { $in: [filters.especializacion] };
        }
        if (filters.nombre) {
          query.nombre = { $regex: filters.nombre, $options: 'i' };
        }
      }

      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;
      const skip = (page - 1) * limit;
      
      const sortOptions: any = {};
      if (pagination?.sortBy) {
        sortOptions[pagination.sortBy] = pagination.sortOrder === 'desc' ? -1 : 1;
      } else {
        sortOptions.esSocio = -1;
        sortOptions.nombre = 1;
      }

      const [documents, total] = await Promise.all([
        AttorneyModel.find(query)
          .sort(sortOptions)
          .skip(skip)
          .limit(limit),
        AttorneyModel.countDocuments(query)
      ]);

      const attorneys = documents.map(doc => this.toDomain(doc));
      const totalPages = Math.ceil(total / limit);

      return {
        data: attorneys,
        total,
        page,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      };
    } catch (error) {
      console.error('Error finding all attorneys:', error);
      return {
        data: [],
        total: 0,
        page: 1,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      };
    }
  }

  async findActive(): Promise<Attorney[]> {
    try {
      const documents = await AttorneyModel.find({ activo: true })
        .sort({ esSocio: -1, nombre: 1 });
      return documents.map(doc => this.toDomain(doc));
    } catch (error) {
      console.error('Error finding active attorneys:', error);
      return [];
    }
  }

  async findPartners(): Promise<Attorney[]> {
    try {
      const documents = await AttorneyModel.find({ 
        activo: true, 
        esSocio: true 
      }).sort({ nombre: 1 });
      return documents.map(doc => this.toDomain(doc));
    } catch (error) {
      console.error('Error finding partners:', error);
      return [];
    }
  }

  async findBySpecialization(specialization: string): Promise<Attorney[]> {
    try {
      const documents = await AttorneyModel.find({
        activo: true,
        especializaciones: { $in: [specialization] }
      }).sort({ esSocio: -1, experienciaAnios: -1 });
      return documents.map(doc => this.toDomain(doc));
    } catch (error) {
      console.error('Error finding attorneys by specialization:', error);
      return [];
    }
  }

  async save(attorney: Attorney): Promise<Attorney> {
    try {
      const data = this.toPersistence(attorney);
      const document = new AttorneyModel(data);
      const saved = await document.save();
      return this.toDomain(saved);
    } catch (error) {
      console.error('Error saving attorney:', error);
      throw new Error('Error al guardar el abogado');
    }
  }

  async update(id: string, attorney: Attorney): Promise<Attorney | null> {
    try {
      const data = this.toPersistence(attorney);
      const updated = await AttorneyModel.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      );
      return updated ? this.toDomain(updated) : null;
    } catch (error) {
      console.error('Error updating attorney:', error);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await AttorneyModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting attorney:', error);
      return false;
    }
  }

  async search(query: string): Promise<Attorney[]> {
    try {
      const documents = await AttorneyModel.find({
        $text: { $search: query },
        activo: true
      }).sort({ score: { $meta: 'textScore' }, esSocio: -1 });
      return documents.map(doc => this.toDomain(doc));
    } catch (error) {
      console.error('Error searching attorneys:', error);
      return [];
    }
  }
}