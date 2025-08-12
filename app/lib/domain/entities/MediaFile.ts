/**
 * MediaFile Domain Entity
 * Represents a media file in the system
 */

export interface MediaFileProps {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
  category?: string;
  description?: string;
  tags?: string[];
}

export class MediaFile {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _url: string;
  private readonly _type: string;
  private readonly _size: number;
  private readonly _uploadedAt: Date;
  private readonly _category?: string;
  private _description?: string;
  private _tags: string[];

  constructor(props: MediaFileProps) {
    this._id = props.id;
    this._name = props.name;
    this._url = props.url;
    this._type = props.type;
    this._size = props.size;
    this._uploadedAt = props.uploadedAt;
    this._category = props.category;
    this._description = props.description;
    this._tags = props.tags || [];
  }

  // Getters
  get id(): string { return this._id; }
  get name(): string { return this._name; }
  get url(): string { return this._url; }
  get type(): string { return this._type; }
  get size(): number { return this._size; }
  get uploadedAt(): Date { return this._uploadedAt; }
  get category(): string | undefined { return this._category; }
  get description(): string | undefined { return this._description; }
  get tags(): string[] { return [...this._tags]; }

  // Business logic methods
  isImage(): boolean {
    return this._type.startsWith('image/');
  }

  isVideo(): boolean {
    return this._type.startsWith('video/');
  }

  isDocument(): boolean {
    return this._type === 'application/pdf';
  }

  getFileExtension(): string {
    const parts = this._name.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
  }

  getFormattedSize(): string {
    if (this._size === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(this._size) / Math.log(k));
    return parseFloat((this._size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getFormattedDate(): string {
    return this._uploadedAt.toLocaleDateString('es-ES');
  }

  matchesSearch(searchTerm: string): boolean {
    const term = searchTerm.toLowerCase();
    return this._name.toLowerCase().includes(term) ||
           this._description?.toLowerCase().includes(term) ||
           this._tags.some(tag => tag.toLowerCase().includes(term));
  }

  matchesType(filterType: string): boolean {
    switch (filterType) {
      case 'all':
        return true;
      case 'images':
        return this.isImage();
      case 'videos':
        return this.isVideo();
      case 'documents':
        return this.isDocument();
      default:
        return false;
    }
  }

  // Setters for mutable properties
  updateDescription(description: string): void {
    this._description = description;
  }

  addTag(tag: string): void {
    if (!this._tags.includes(tag)) {
      this._tags.push(tag);
    }
  }

  removeTag(tag: string): void {
    this._tags = this._tags.filter(t => t !== tag);
  }

  setTags(tags: string[]): void {
    this._tags = [...tags];
  }

  // Serialization
  toJSON(): MediaFileProps {
    return {
      id: this._id,
      name: this._name,
      url: this._url,
      type: this._type,
      size: this._size,
      uploadedAt: this._uploadedAt,
      category: this._category,
      description: this._description,
      tags: this._tags
    };
  }

  static fromJSON(json: MediaFileProps): MediaFile {
    return new MediaFile({
      ...json,
      uploadedAt: json.uploadedAt instanceof Date ? json.uploadedAt : new Date(json.uploadedAt)
    });
  }
}