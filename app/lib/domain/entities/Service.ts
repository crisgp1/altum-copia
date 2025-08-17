export interface ServiceProps {
  id?: string;
  name: string;
  description: string;
  shortDescription: string;
  iconUrl?: string;
  parentId?: string;
  order: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Service {
  private readonly _id: string;
  private _name: string;
  private _description: string;
  private _shortDescription: string;
  private _iconUrl?: string;
  private _parentId?: string;
  private _order: number;
  private _isActive: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: ServiceProps) {
    this._id = props.id || this.generateId();
    this._name = props.name;
    this._description = props.description;
    this._shortDescription = props.shortDescription;
    this._iconUrl = props.iconUrl;
    this._parentId = props.parentId;
    this._order = props.order;
    this._isActive = props.isActive;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  private generateId(): string {
    return `service_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get shortDescription(): string {
    return this._shortDescription;
  }

  get iconUrl(): string | undefined {
    return this._iconUrl;
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

  get parentId(): string | undefined {
    return this._parentId;
  }

  get isParent(): boolean {
    return !this._parentId;
  }

  get isChild(): boolean {
    return !!this._parentId;
  }

  updateName(name: string): void {
    this._name = name;
    this._updatedAt = new Date();
  }

  updateParentId(parentId: string | undefined): void {
    this._parentId = parentId;
    this._updatedAt = new Date();
  }

  updateDescription(description: string): void {
    this._description = description;
    this._updatedAt = new Date();
  }

  updateShortDescription(shortDescription: string): void {
    this._shortDescription = shortDescription;
    this._updatedAt = new Date();
  }

  updateIcon(iconUrl: string): void {
    this._iconUrl = iconUrl;
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