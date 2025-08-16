import { NextRequest, NextResponse } from 'next/server';
import { BlogPostRepository } from '@/app/lib/infrastructure/persistence/repositories/BlogPostRepository';
import dbConnect from '@/app/lib/infrastructure/persistence/mongodb/connection';

const blogPostRepository = new BlogPostRepository();

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  
  try {
    await dbConnect();
    
    // Increment view count
    await blogPostRepository.incrementViewCount(params.id);
    
    return NextResponse.json({
      success: true,
      message: 'View count incremented'
    });
  } catch (error) {
    console.error('Error incrementing view count:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to increment view count' },
      { status: 500 }
    );
  }
}