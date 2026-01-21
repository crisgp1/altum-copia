import mongoose, { Document, Schema } from 'mongoose';

export interface IUserFavoriteDocument extends Document {
  clerkUserId: string;
  attorneyId: string;
  createdAt: Date;
}

const UserFavoriteSchema = new Schema<IUserFavoriteDocument>(
  {
    clerkUserId: {
      type: String,
      required: [true, 'ID de usuario es requerido'],
      index: true
    },
    attorneyId: {
      type: String,
      required: [true, 'ID de abogado es requerido'],
      index: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

// Índice compuesto único para evitar duplicados
UserFavoriteSchema.index({ clerkUserId: 1, attorneyId: 1 }, { unique: true });

// Índice para buscar favoritos de un usuario
UserFavoriteSchema.index({ clerkUserId: 1, createdAt: -1 });

export const UserFavoriteModel = mongoose.models.UserFavorite ||
  mongoose.model<IUserFavoriteDocument>('UserFavorite', UserFavoriteSchema);
