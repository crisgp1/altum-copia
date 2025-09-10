import { BlogPost, PostStatus } from '@/app/lib/domain/entities/BlogPost';
import { IBlogPostRepository } from '@/app/lib/domain/repositories/IBlogPostRepository';
import { Slug } from '@/app/lib/domain/valueObjects/Slug';

export interface CreateBlogPostDTO {
  title: string;
  content: string;
  excerpt: string;
  authorId: string;
  hasExternalCollaborator?: boolean;
  externalCollaboratorName?: string;
  externalCollaboratorTitle?: string;
  categoryId: string;
  tags: string[];
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  status?: PostStatus;
  formatConfig?: {
    lineHeight: number;
    paragraphSpacing: number;
  };
}

export class CreateBlogPostUseCase {
  constructor(private blogPostRepository: IBlogPostRepository) {}

  async execute(dto: CreateBlogPostDTO): Promise<BlogPost> {
    const slug = Slug.fromText(dto.title);
    
    const existingPost = await this.blogPostRepository.findBySlug(slug.value);
    if (existingPost) {
      throw new Error('A post with this slug already exists');
    }

    const blogPost = new BlogPost({
      title: dto.title,
      slug: slug.value,
      content: dto.content,
      excerpt: dto.excerpt,
      authorId: dto.authorId,
      hasExternalCollaborator: dto.hasExternalCollaborator || false,
      externalCollaboratorName: dto.externalCollaboratorName || '',
      externalCollaboratorTitle: dto.externalCollaboratorTitle || '',
      categoryId: dto.categoryId,
      tags: dto.tags,
      featuredImage: dto.featuredImage,
      seoTitle: dto.seoTitle,
      seoDescription: dto.seoDescription,
      status: dto.status || PostStatus.DRAFT,
      publishedAt: dto.status === PostStatus.PUBLISHED ? new Date() : undefined,
      viewCount: 0,
      formatConfig: dto.formatConfig || { lineHeight: 1.4, paragraphSpacing: 0.5 }
    });

    await this.blogPostRepository.save(blogPost);
    return blogPost;
  }
}