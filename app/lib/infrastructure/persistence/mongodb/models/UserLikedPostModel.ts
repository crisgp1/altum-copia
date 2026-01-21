import mongoose, { Document, Schema } from 'mongoose';

export interface IUserLikedPostDocument extends Document {
  clerkUserId: string;
  postId: string;
  createdAt: Date;
}

const UserLikedPostSchema = new Schema<IUserLikedPostDocument>(
  {
    clerkUserId: {
      type: String,
      required: [true, 'ID de usuario es requerido'],
      index: true
    },
    postId: {
      type: String,
      required: [true, 'ID de post es requerido'],
      index: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

// Índice compuesto único para evitar duplicados
UserLikedPostSchema.index({ clerkUserId: 1, postId: 1 }, { unique: true });

// Índice para buscar posts guardados de un usuario
UserLikedPostSchema.index({ clerkUserId: 1, createdAt: -1 });

export const UserLikedPostModel = mongoose.models.UserLikedPost ||
  mongoose.model<IUserLikedPostDocument>('UserLikedPost', UserLikedPostSchema);
