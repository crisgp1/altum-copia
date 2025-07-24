export interface CategoryProps {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  order: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Category {
  private readonly _id: string;
  private _name: string;
  private _slug: string;
  private _description?: string;
  private _parentId?: string;
  private _order: number;
  private _isActive: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: CategoryProps) {
    this._id = props.id || this.generateId();
    this._name = props.name;
    this._slug = props.slug;
    this._description = props.description;
    this._parentId = props.parentId;
    this._order = props.order;
    this._isActive = props.isActive;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  private generateId(): string {
    return `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get slug(): string {
    return this._slug;
  }

  get description(): string | undefined {
    return this._description;
  }

  get parentId(): string | undefined {
    return this._parentId;
  }

  get order(): number {
    return this._order;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get isSubcategory(): boolean {
    return this._parentId !== undefined;
  }

  updateName(name: string): void {
    this._name = name;
    this._updatedAt = new Date();
  }

  updateSlug(slug: string): void {
    this._slug = slug;
    this._updatedAt = new Date();
  }

  updateDescription(description: string): void {
    this._description = description;
    this._updatedAt = new Date();
  }

  updateParent(parentId: string | undefined): void {
    this._parentId = parentId;
    this._updatedAt = new Date();
  }

  updateOrder(order: number): void {
    this._order = order;
    this._updatedAt = new Date();
  }

  activate(): void {
    this._isActive = true;
    this._updatedAt = new Date();
  }

  deactivate(): void {
    this._isActive = false;
    this._updatedAt = new Date();
  }
}