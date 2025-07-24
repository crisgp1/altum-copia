import { BlogPost } from '@/app/lib/domain/entities/BlogPost';
import { IBlogPostRepository, PaginatedResult, PaginationOptions } from '@/app/lib/domain/repositories/IBlogPostRepository';

export class GetPublishedPostsUseCase {
  constructor(private blogPostRepository: IBlogPostRepository) {}

  async execute(options?: PaginationOptions): Promise<PaginatedResult<BlogPost>> {
    const defaultOptions: PaginationOptions = {
      page: 1,
      limit: 10,
      orderBy: 'publishedAt',
      orderDirection: 'desc',
      ...options
    };

    return await this.blogPostRepository.findPublished(defaultOptions);
  }
}