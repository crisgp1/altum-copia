import { BlogPost, PostStatus } from '@/app/lib/domain/entities/BlogPost';
import { 
  IBlogPostRepository, 
  BlogPostFilter, 
  PaginationOptions, 
  PaginatedResult 
} from '@/app/lib/domain/repositories/IBlogPostRepository';
import { BlogPostModel, IBlogPostDocument } from '../mongodb/models/BlogPostModel';
import dbConnect from '../mongodb/connection';

export class BlogPostRepository implements IBlogPostRepository {
  async findById(id: string): Promise<BlogPost | null> {
    await dbConnect();
    const doc = await BlogPostModel.findById(id);
    return doc ? this.toDomain(doc) : null;
  }

  async findBySlug(slug: string): Promise<BlogPost | null> {
    await dbConnect();
    const doc = await BlogPostModel.findOne({ slug });
    return doc ? this.toDomain(doc) : null;
  }

  async findAll(
    filter?: BlogPostFilter, 
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<BlogPost>> {
    await dbConnect();
    
    const query: any = {};
    if (filter?.status) query.status = filter.status;
    if (filter?.categoryId) query.categoryId = filter.categoryId;
    if (filter?.authorId) query.authorId = filter.authorId;
    if (filter?.tags?.length) query.tags = { $in: filter.tags };
    if (filter?.search) {
      query.$or = [
        { title: new RegExp(filter.search, 'i') },
        { excerpt: new RegExp(filter.search, 'i') }
      ];
    }

    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;
    const sortField = pagination?.orderBy || 'createdAt';
    const sortOrder = pagination?.orderDirection === 'asc' ? 1 : -1;

    const [docs, total] = await Promise.all([
      BlogPostModel.find(query)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit),
      BlogPostModel.countDocuments(query)
    ]);

    return {
      data: docs.map(doc => this.toDomain(doc)),
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findPublished(pagination?: PaginationOptions): Promise<PaginatedResult<BlogPost>> {
    return this.findAll(
      { status: PostStatus.PUBLISHED },
      pagination
    );
  }

  async findByCategory(
    categoryId: string, 
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<BlogPost>> {
    return this.findAll(
      { categoryId, status: PostStatus.PUBLISHED },
      pagination
    );
  }

  async findByAuthor(
    authorId: string, 
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<BlogPost>> {
    return this.findAll(
      { authorId },
      pagination
    );
  }

  async findByTag(
    tag: string, 
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<BlogPost>> {
    return this.findAll(
      { tags: [tag], status: PostStatus.PUBLISHED },
      pagination
    );
  }

  async findRelated(postId: string, limit: number = 5): Promise<BlogPost[]> {
    await dbConnect();
    
    const post = await BlogPostModel.findById(postId);
    if (!post) return [];

    const docs = await BlogPostModel.find({
      _id: { $ne: postId },
      status: PostStatus.PUBLISHED,
      $or: [
        { categoryId: post.categoryId },
        { tags: { $in: post.tags } }
      ]
    })
    .sort({ publishedAt: -1 })
    .limit(limit);

    return docs.map(doc => this.toDomain(doc));
  }

  async save(post: BlogPost): Promise<void> {
    await dbConnect();
    const doc = new BlogPostModel(this.toPersistence(post));
    await doc.save();
  }

  async update(post: BlogPost): Promise<void> {
    await dbConnect();
    await BlogPostModel.findByIdAndUpdate(
      post.id,
      this.toPersistence(post),
      { new: true }
    );
  }

  async delete(id: string): Promise<void> {
    await dbConnect();
    await BlogPostModel.findByIdAndDelete(id);
  }

  async incrementViewCount(id: string): Promise<void> {
    await dbConnect();
    await BlogPostModel.findByIdAndUpdate(
      id,
      { $inc: { viewCount: 1 } }
    );
  }

  private toDomain(doc: IBlogPostDocument): BlogPost {
    return new BlogPost({
      id: doc._id.toString(),
      title: doc.title,
      slug: doc.slug,
      excerpt: doc.excerpt,
      content: doc.content,
      featuredImage: doc.featuredImage,
      authorId: doc.authorId,
      categoryId: doc.categoryId,
      tags: doc.tags,
      status: doc.status as PostStatus,
      publishedAt: doc.publishedAt,
      seoTitle: doc.seoTitle,
      seoDescription: doc.seoDescription,
      viewCount: doc.viewCount,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    });
  }

  private toPersistence(post: BlogPost): Partial<IBlogPostDocument> {
    return {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage,
      authorId: post.authorId,
      categoryId: post.categoryId,
      tags: post.tags,
      status: post.status,
      publishedAt: post.publishedAt,
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      viewCount: post.viewCount
    };
  }
}