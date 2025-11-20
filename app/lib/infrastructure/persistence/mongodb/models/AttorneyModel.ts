import mongoose, { Schema, Document } from 'mongoose';

// Interface para el documento de Attorney
export interface IAttorneyDocument extends Document {
  slug: string;
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
  logros: string[];
  casosDestacados: string[];
  imagenUrl?: string;
  linkedIn?: string;
  esSocio: boolean;
  descripcionCorta: string;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

// Definición del Schema de Attorney
const AttorneySchema = new Schema<IAttorneyDocument>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true
    },
    nombre: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
      maxlength: [100, 'El nombre no puede exceder 100 caracteres']
    },
    cargo: {
      type: String,
      required: [true, 'El cargo es requerido'],
      trim: true,
      maxlength: [100, 'El cargo no puede exceder 100 caracteres']
    },
    especializaciones: [{
      type: String,
      required: true
    }],
    serviciosQueAtiende: [{
      type: String,
      ref: 'Service'
    }],
    experienciaAnios: {
      type: Number,
      required: [true, 'Los años de experiencia son requeridos'],
      min: [0, 'La experiencia no puede ser negativa'],
      max: [60, 'La experiencia parece poco realista']
    },
    educacion: [{
      type: String,
      required: true
    }],
    idiomas: [{
      type: String,
      required: true
    }],
    correo: {
      type: String,
      required: [true, 'El correo electrónico es requerido'],
      lowercase: true,
      trim: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        'Por favor ingrese un correo electrónico válido'
      ]
    },
    telefono: {
      type: String,
      required: [true, 'El teléfono es requerido'],
      trim: true,
      match: [
        /^\+?[1-9]\d{1,14}$/,
        'Por favor ingrese un número de teléfono válido'
      ]
    },
    biografia: {
      type: String,
      required: [true, 'La biografía es requerida'],
      maxlength: [2000, 'La biografía no puede exceder 2000 caracteres']
    },
    logros: [{
      type: String
    }],
    casosDestacados: [{
      type: String
    }],
    imagenUrl: {
      type: String,
      default: null
    },
    linkedIn: {
      type: String,
      default: null,
      match: [
        /^https?:\/\/(www\.)?linkedin\.com\/.*$/,
        'Por favor ingrese una URL válida de LinkedIn'
      ]
    },
    esSocio: {
      type: Boolean,
      default: false
    },
    descripcionCorta: {
      type: String,
      required: [true, 'La descripción corta es requerida'],
      maxlength: [200, 'La descripción corta no puede exceder 200 caracteres']
    },
    activo: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: {
      createdAt: 'fechaCreacion',
      updatedAt: 'fechaActualizacion'
    }
  }
);

// Índices para optimizar búsquedas
AttorneySchema.index({ nombre: 'text', especializaciones: 'text' });
AttorneySchema.index({ activo: 1, esSocio: -1 });
AttorneySchema.index({ especializaciones: 1 });
AttorneySchema.index({ serviciosQueAtiende: 1 });
AttorneySchema.index({ correo: 1 });

// Método para obtener información pública (oculta datos sensibles)
AttorneySchema.methods.obtenerInfoPublica = function() {
  const obj = this.toObject();
  delete obj.__v;
  delete obj._id;
  return obj;
};

// Utilidad para generar slug desde nombre
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

// Validación pre-guardado
AttorneySchema.pre<IAttorneyDocument>('save', function(next) {
  // Auto-generate slug if not provided or if nombre changed
  if (!this.slug || this.isModified('nombre')) {
    this.slug = generateSlug(this.nombre);
  }

  // Validar que el correo tenga un dominio válido de ALTUM Legal
  const validDomains = ['@altumlegal.mx', '@altum-legal.mx'];
  const hasValidDomain = validDomains.some(domain =>
    this.correo.toLowerCase().includes(domain)
  );

  if (!hasValidDomain) {
    return next(new Error('El correo debe tener un dominio válido de ALTUM Legal (@altumlegal.mx o @altum-legal.mx)'));
  }

  next();
});

export const AttorneyModel = mongoose.models.Attorney || mongoose.model<IAttorneyDocument>('Attorney', AttorneySchema);