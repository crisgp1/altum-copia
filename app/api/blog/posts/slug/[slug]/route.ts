import { NextRequest, NextResponse } from 'next/server';
import { BlogPostRepository } from '@/app/lib/infrastructure/persistence/repositories/BlogPostRepository';
import { PostStatus } from '@/app/lib/domain/entities/BlogPost';
import dbConnect from '@/app/lib/infrastructure/persistence/mongodb/connection';

const blogPostRepository = new BlogPostRepository();

// GET /api/blog/posts/slug/[slug] - Public endpoint for fetching a published post by slug
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const params = await context.params;

  try {
    await dbConnect();

    const post = await blogPostRepository.findBySlug(params.slug);

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // Only return published posts to public
    if (post.status !== PostStatus.PUBLISHED) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        featuredImage: post.featuredImage,
        authorId: post.authorId,
        hasExternalCollaborator: post.hasExternalCollaborator,
        externalCollaboratorName: post.externalCollaboratorName,
        externalCollaboratorTitle: post.externalCollaboratorTitle,
        categoryId: post.categoryId,
        tags: post.tags,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        formatConfig: post.formatConfig,
        citationConfig: post.citationConfig,
        publishedAt: post.publishedAt,
        viewCount: post.viewCount
      }
    });
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}
