import { Category } from '../entities/Category';

export interface ICategoryRepository {
  findById(id: string): Promise<Category | null>;
  findBySlug(slug: string): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  findActive(): Promise<Category[]>;
  findByParent(parentId: string): Promise<Category[]>;
  findRootCategories(): Promise<Category[]>;
  save(category: Category): Promise<void>;
  update(category: Category): Promise<void>;
  delete(id: string): Promise<void>;
  hasChildren(id: string): Promise<boolean>;
  countPostsByCategory(id: string): Promise<number>;
}