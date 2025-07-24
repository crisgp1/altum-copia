import mongoose, { Schema, Document } from 'mongoose';

export interface IServiceDocument extends Document {
  name: string;
  description: string;
  shortDescription: string;
  iconUrl?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IServiceDocument>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    iconUrl: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  {
    timestamps: true
  }
);

ServiceSchema.index({ order: 1 });
ServiceSchema.index({ isActive: 1 });

export const ServiceModel = mongoose.models.Service || mongoose.model<IServiceDocument>('Service', ServiceSchema);