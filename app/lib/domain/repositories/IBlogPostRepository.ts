import { BlogPost, PostStatus } from '../entities/BlogPost';

export interface BlogPostFilter {
  status?: PostStatus;
  categoryId?: string;
  authorId?: string;
  tags?: string[];
  search?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  orderBy?: 'createdAt' | 'publishedAt' | 'viewCount';
  orderDirection?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface IBlogPostRepository {
  findById(id: string): Promise<BlogPost | null>;
  findBySlug(slug: string): Promise<BlogPost | null>;
  findAll(filter?: BlogPostFilter, pagination?: PaginationOptions): Promise<PaginatedResult<BlogPost>>;
  findPublished(pagination?: PaginationOptions): Promise<PaginatedResult<BlogPost>>;
  findByCategory(categoryId: string, pagination?: PaginationOptions): Promise<PaginatedResult<BlogPost>>;
  findByAuthor(authorId: string, pagination?: PaginationOptions): Promise<PaginatedResult<BlogPost>>;
  findByTag(tag: string, pagination?: PaginationOptions): Promise<PaginatedResult<BlogPost>>;
  findRelated(postId: string, limit?: number): Promise<BlogPost[]>;
  save(post: BlogPost): Promise<void>;
  update(post: BlogPost): Promise<void>;
  delete(id: string): Promise<void>;
  incrementViewCount(id: string): Promise<void>;
}