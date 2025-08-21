import mongoose, { Schema, Document } from 'mongoose';

// Interface para el documento de Attorney
export interface IAttorneyDocument extends Document {
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
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
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

// Validación pre-guardado
AttorneySchema.pre<IAttorneyDocument>('save', function(next) {
  // Asegurar que el correo tenga formato de ALTUM Legal
  if (this.correo && !this.correo.includes('@altumlegal.mx')) {
    this.correo = this.correo.split('@')[0] + '@altumlegal.mx';
  }
  next();
});

export const AttorneyModel = mongoose.models.Attorney || mongoose.model<IAttorneyDocument>('Attorney', AttorneySchema);