export interface FormatConfig {
  lineHeight: number;
  paragraphSpacing: number;
}

export interface BlogPostProps {
  id?: string;
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
  status: PostStatus;
  publishedAt?: Date;
  seoTitle?: string;
  seoDescription?: string;
  viewCount: number;
  formatConfig?: FormatConfig;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  SCHEDULED = 'SCHEDULED',
  ARCHIVED = 'ARCHIVED'
}

export class BlogPost {
  private readonly _id: string;
  private _title: string;
  private _slug: string;
  private _excerpt: string;
  private _content: string;
  private _featuredImage?: string;
  private _authorId: string;
  private _hasExternalCollaborator: boolean;
  private _externalCollaboratorName?: string;
  private _externalCollaboratorTitle?: string;
  private _categoryId: string;
  private _tags: string[];
  private _status: PostStatus;
  private _publishedAt?: Date;
  private _seoTitle?: string;
  private _seoDescription?: string;
  private _viewCount: number;
  private _formatConfig?: FormatConfig;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: BlogPostProps) {
    this._id = props.id || this.generateId();
    this._title = props.title;
    this._slug = props.slug;
    this._excerpt = props.excerpt;
    this._content = props.content;
    this._featuredImage = props.featuredImage;
    this._authorId = props.authorId;
    this._hasExternalCollaborator = props.hasExternalCollaborator || false;
    this._externalCollaboratorName = props.externalCollaboratorName;
    this._externalCollaboratorTitle = props.externalCollaboratorTitle;
    this._categoryId = props.categoryId;
    this._tags = props.tags;
    this._status = props.status;
    this._publishedAt = props.publishedAt;
    this._seoTitle = props.seoTitle;
    this._seoDescription = props.seoDescription;
    this._viewCount = props.viewCount || 0;
    this._formatConfig = props.formatConfig || { lineHeight: 1.4, paragraphSpacing: 0.5 };
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  private generateId(): string {
    return `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get slug(): string {
    return this._slug;
  }

  get excerpt(): string {
    return this._excerpt;
  }

  get content(): string {
    return this._content;
  }

  get featuredImage(): string | undefined {
    return this._featuredImage;
  }

  get authorId(): string {
    return this._authorId;
  }

  get hasExternalCollaborator(): boolean {
    return this._hasExternalCollaborator;
  }

  get externalCollaboratorName(): string | undefined {
    return this._externalCollaboratorName;
  }

  get externalCollaboratorTitle(): string | undefined {
    return this._externalCollaboratorTitle;
  }

  get categoryId(): string {
    return this._categoryId;
  }

  get tags(): string[] {
    return [...this._tags];
  }

  get status(): PostStatus {
    return this._status;
  }

  get publishedAt(): Date | undefined {
    return this._publishedAt;
  }

  get seoTitle(): string {
    return this._seoTitle || this._title;
  }

  get seoDescription(): string {
    return this._seoDescription || this._excerpt;
  }

  get viewCount(): number {
    return this._viewCount;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get formatConfig(): FormatConfig {
    return this._formatConfig || { lineHeight: 1.4, paragraphSpacing: 0.5 };
  }

  get isPublished(): boolean {
    return this._status === PostStatus.PUBLISHED;
  }

  updateContent(title: string, content: string, excerpt: string): void {
    this._title = title;
    this._content = content;
    this._excerpt = excerpt;
    this._updatedAt = new Date();
  }

  updateSlug(slug: string): void {
    this._slug = slug;
    this._updatedAt = new Date();
  }

  updateFeaturedImage(imageUrl: string): void {
    this._featuredImage = imageUrl;
    this._updatedAt = new Date();
  }

  updateCategory(categoryId: string): void {
    this._categoryId = categoryId;
    this._updatedAt = new Date();
  }

  updateTags(tags: string[]): void {
    this._tags = tags;
    this._updatedAt = new Date();
  }

  updateSeo(seoTitle: string, seoDescription: string): void {
    this._seoTitle = seoTitle;
    this._seoDescription = seoDescription;
    this._updatedAt = new Date();
  }

  updateFormatConfig(formatConfig: FormatConfig): void {
    this._formatConfig = formatConfig;
    this._updatedAt = new Date();
  }

  publish(): void {
    this._status = PostStatus.PUBLISHED;
    this._publishedAt = new Date();
    this._updatedAt = new Date();
  }

  unpublish(): void {
    this._status = PostStatus.DRAFT;
    this._publishedAt = undefined;
    this._updatedAt = new Date();
  }

  schedule(publishDate: Date): void {
    this._status = PostStatus.SCHEDULED;
    this._publishedAt = publishDate;
    this._updatedAt = new Date();
  }

  archive(): void {
    this._status = PostStatus.ARCHIVED;
    this._updatedAt = new Date();
  }

  incrementViewCount(): void {
    this._viewCount++;
    this._updatedAt = new Date();
  }
}