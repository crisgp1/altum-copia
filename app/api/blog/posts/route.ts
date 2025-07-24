import { NextRequest, NextResponse } from 'next/server';
import { BlogPostRepository } from '@/app/lib/infrastructure/persistence/repositories/BlogPostRepository';
import { GetPublishedPostsUseCase } from '@/app/lib/application/useCases/blog/GetPublishedPostsUseCase';

const blogPostRepository = new BlogPostRepository();
const getPublishedPostsUseCase = new GetPublishedPostsUseCase(blogPostRepository);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const result = await getPublishedPostsUseCase.execute({
      page,
      limit,
      orderBy: 'publishedAt',
      orderDirection: 'desc'
    });
    
    return NextResponse.json({
      success: true,
      data: result.data.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        featuredImage: post.featuredImage,
        authorId: post.authorId,
        categoryId: post.categoryId,
        tags: post.tags,
        publishedAt: post.publishedAt,
        viewCount: post.viewCount
      })),
      pagination: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}