import { NextRequest, NextResponse } from 'next/server';
import { BlogPostRepository } from '@/app/lib/infrastructure/persistence/repositories/BlogPostRepository';
import dbConnect from '@/app/lib/infrastructure/persistence/mongodb/connection';

const blogPostRepository = new BlogPostRepository();

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50'); // Higher limit for admin
    const status = searchParams.get('status'); // Filter by status if provided
    
    // Build filter options
    const filter: any = {};
    if (status && status !== 'all') {
      filter.status = status.toUpperCase(); // Convert to enum format
    }
    
    const result = await blogPostRepository.findAll(filter, {
      page,
      limit,
      orderBy: 'createdAt',
      orderDirection: 'desc'
    });
    
    const formattedPosts = result.data.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage,
      authorId: post.authorId,
      categoryId: post.categoryId,
      tags: post.tags,
      status: post.status.toLowerCase(), // Convert to lowercase for frontend
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      publishedAt: post.publishedAt,
      viewCount: post.viewCount
    }));
    
    return NextResponse.json({
      success: true,
      posts: formattedPosts, // Using 'posts' key for backward compatibility
      data: formattedPosts,   // Also using 'data' key for new format
      pagination: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching admin blog posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}