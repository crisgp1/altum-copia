import mongoose, { Schema, Document } from 'mongoose';

export interface IBlogPostDocument extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  authorId: string;
  hasExternalCollaborator: boolean;
  externalCollaboratorName?: string;
  externalCollaboratorTitle?: string;
  categoryId: string;
  tags: string[];
  status: string;
  publishedAt?: Date;
  seoTitle?: string;
  seoDescription?: string;
  viewCount: number;
  formatConfig?: {
    lineHeight: number;
    paragraphSpacing: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPostDocument>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    featuredImage: { type: String },
    authorId: { type: String, required: true },
    hasExternalCollaborator: { type: Boolean, default: false },
    externalCollaboratorName: { type: String },
    externalCollaboratorTitle: { type: String },
    categoryId: { type: String, ref: 'Category', required: true },
    tags: [{ type: String }],
    status: { type: String, default: 'DRAFT', enum: ['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED'] },
    publishedAt: { type: Date },
    seoTitle: { type: String },
    seoDescription: { type: String },
    viewCount: { type: Number, default: 0 },
    formatConfig: {
      lineHeight: { type: Number, default: 1.4 },
      paragraphSpacing: { type: Number, default: 0.5 }
    }
  },
  {
    timestamps: true
  }
);

// Remove duplicate slug index since unique: true already creates one
BlogPostSchema.index({ status: 1, publishedAt: -1 });
BlogPostSchema.index({ categoryId: 1 });
BlogPostSchema.index({ authorId: 1 });
BlogPostSchema.index({ tags: 1 });

export const BlogPostModel = mongoose.models.BlogPost || mongoose.model<IBlogPostDocument>('BlogPost', BlogPostSchema);