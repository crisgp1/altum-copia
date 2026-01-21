import { NextRequest, NextResponse } from 'next/server';
import { BlogPostRepository } from '@/app/lib/infrastructure/persistence/repositories/BlogPostRepository';
import { BlogPost, PostStatus } from '@/app/lib/domain/entities/BlogPost';
import dbConnect from '@/app/lib/infrastructure/persistence/mongodb/connection';
import { verifyApiAuth } from '@/app/lib/auth/api-auth';

const blogPostRepository = new BlogPostRepository();

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // Verificar autenticación y permiso manage_blog
  const authResult = await verifyApiAuth('manage_blog');
  if (!authResult.authorized) {
    return authResult.error;
  }

  const params = await context.params;

  try {
    await dbConnect();
    
    const post = await blogPostRepository.findById(params.id);
    if (!post) {
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
        status: post.status.toLowerCase(),
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        formatConfig: post.formatConfig,
        citationConfig: post.citationConfig,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        publishedAt: post.publishedAt,
        viewCount: post.viewCount
      }
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // Verificar autenticación y permiso edit_content
  const authResult = await verifyApiAuth('edit_content');
  if (!authResult.authorized) {
    return authResult.error;
  }

  const params = await context.params;

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
    
    // Check if post exists
    const existingPost = await blogPostRepository.findById(params.id);
    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Update the post
    const updatedPost = new BlogPost({
      id: params.id,
      title: body.title,
      slug: body.slug || existingPost.slug,
      content: body.content,
      excerpt: body.excerpt || '',
      authorId: body.authorId || existingPost.authorId, // Allow updating author
      hasExternalCollaborator: body.hasExternalCollaborator || false,
      externalCollaboratorName: body.externalCollaboratorName || '',
      externalCollaboratorTitle: body.externalCollaboratorTitle || '',
      categoryId: body.categoryId,
      tags: body.tags || [],
      featuredImage: body.featuredImage || '',
      seoTitle: body.seoTitle || body.title,
      seoDescription: body.seoDescription || body.excerpt || '',
      status: body.status?.toUpperCase() as PostStatus || PostStatus.DRAFT,
      formatConfig: body.formatConfig || existingPost.formatConfig || { lineHeight: 1.4, paragraphSpacing: 0.5 },
      citationConfig: body.citationConfig || existingPost.citationConfig || { enabled: false, citations: [], references: [] },
      viewCount: existingPost.viewCount,
      publishedAt: body.status?.toUpperCase() === 'PUBLISHED' && !existingPost.publishedAt
        ? new Date()
        : body.status?.toUpperCase() === 'PUBLISHED' && existingPost.status !== PostStatus.PUBLISHED
        ? new Date()
        : existingPost.publishedAt,
      createdAt: existingPost.createdAt,
      updatedAt: new Date()
    });
    
    await blogPostRepository.update(updatedPost);
    
    return NextResponse.json({
      success: true,
      data: {
        id: updatedPost.id,
        title: updatedPost.title,
        slug: updatedPost.slug,
        excerpt: updatedPost.excerpt,
        content: updatedPost.content,
        featuredImage: updatedPost.featuredImage,
        authorId: updatedPost.authorId,
        hasExternalCollaborator: updatedPost.hasExternalCollaborator,
        externalCollaboratorName: updatedPost.externalCollaboratorName,
        externalCollaboratorTitle: updatedPost.externalCollaboratorTitle,
        categoryId: updatedPost.categoryId,
        tags: updatedPost.tags,
        status: updatedPost.status,
        seoTitle: updatedPost.seoTitle,
        seoDescription: updatedPost.seoDescription,
        formatConfig: updatedPost.formatConfig,
        citationConfig: updatedPost.citationConfig,
        createdAt: updatedPost.createdAt,
        updatedAt: updatedPost.updatedAt,
        publishedAt: updatedPost.publishedAt,
        viewCount: updatedPost.viewCount
      }
    });
  } catch (error: any) {
    console.error('Error updating blog post:', error);
    
    // Handle specific validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message).join(', ');
      return NextResponse.json(
        { success: false, error: `Validation error: ${validationErrors}` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // Verificar autenticación y permiso delete_content
  const authResult = await verifyApiAuth('delete_content');
  if (!authResult.authorized) {
    return authResult.error;
  }

  const params = await context.params;

  try {
    await dbConnect();
    
    // Check if post exists
    const existingPost = await blogPostRepository.findById(params.id);
    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Delete the post
    await blogPostRepository.delete(params.id);
    
    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}