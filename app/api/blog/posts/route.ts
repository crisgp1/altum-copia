import { NextRequest, NextResponse } from 'next/server';
import { BlogPostRepository } from '@/app/lib/infrastructure/persistence/repositories/BlogPostRepository';
import { GetPublishedPostsUseCase } from '@/app/lib/application/useCases/blog/GetPublishedPostsUseCase';
import { CreateBlogPostUseCase } from '@/app/lib/application/useCases/blog/CreateBlogPostUseCase';
import { BlogPost, PostStatus } from '@/app/lib/domain/entities/BlogPost';
import dbConnect from '@/app/lib/infrastructure/persistence/mongodb/connection';

const blogPostRepository = new BlogPostRepository();
const getPublishedPostsUseCase = new GetPublishedPostsUseCase(blogPostRepository);
const createBlogPostUseCase = new CreateBlogPostUseCase(blogPostRepository);

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
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

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.content) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 }
      );
    }
    
    if (!body.categoryId) {
      return NextResponse.json(
        { success: false, error: 'Category is required' },
        { status: 400 }
      );
    }
    
    // Create DTO for the use case
    const createDTO = {
      title: body.title,
      content: body.content,
      excerpt: body.excerpt || '',
      authorId: body.authorId || 'admin', // Default author if not provided
      hasExternalCollaborator: body.hasExternalCollaborator || false,
      externalCollaboratorName: body.externalCollaboratorName || '',
      externalCollaboratorTitle: body.externalCollaboratorTitle || '',
      categoryId: body.categoryId,
      tags: body.tags || [],
      featuredImage: body.featuredImage || '',
      seoTitle: body.seoTitle || body.title,
      seoDescription: body.seoDescription || body.excerpt || '',
      status: body.status || PostStatus.DRAFT,
      formatConfig: body.formatConfig || { lineHeight: 1.4, paragraphSpacing: 0.5 }
    };
    
    const createdPost = await createBlogPostUseCase.execute(createDTO);
    
    return NextResponse.json({
      success: true,
      data: {
        id: createdPost.id,
        title: createdPost.title,
        slug: createdPost.slug,
        excerpt: createdPost.excerpt,
        content: createdPost.content,
        featuredImage: createdPost.featuredImage,
        authorId: createdPost.authorId,
        hasExternalCollaborator: createdPost.hasExternalCollaborator,
        externalCollaboratorName: createdPost.externalCollaboratorName,
        externalCollaboratorTitle: createdPost.externalCollaboratorTitle,
        categoryId: createdPost.categoryId,
        tags: createdPost.tags,
        status: createdPost.status,
        seoTitle: createdPost.seoTitle,
        seoDescription: createdPost.seoDescription,
        formatConfig: createdPost.formatConfig,
        createdAt: createdPost.createdAt,
        updatedAt: createdPost.updatedAt,
        publishedAt: createdPost.publishedAt,
        viewCount: createdPost.viewCount
      }
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating blog post:', error);
    
    // Handle specific validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message).join(', ');
      return NextResponse.json(
        { success: false, error: `Validation error: ${validationErrors}` },
        { status: 400 }
      );
    }
    
    // Handle duplicate slug error
    if (error.message.includes('slug already exists')) {
      return NextResponse.json(
        { success: false, error: 'A post with this title already exists. Please use a different title.' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}