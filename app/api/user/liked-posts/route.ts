import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/app/lib/infrastructure/persistence/mongodb/connection';
import { UserLikedPostModel } from '@/app/lib/infrastructure/persistence/mongodb/models/UserLikedPostModel';
import { BlogPostModel } from '@/app/lib/infrastructure/persistence/mongodb/models/BlogPostModel';

// GET /api/user/liked-posts - Obtener posts guardados del usuario
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Debes iniciar sesión' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Obtener IDs de posts guardados
    const likedPosts = await UserLikedPostModel.find({ clerkUserId: userId })
      .sort({ createdAt: -1 });

    const postIds = likedPosts.map(lp => lp.postId);

    // Obtener datos de los posts
    const posts = await BlogPostModel.find({
      _id: { $in: postIds },
      status: 'PUBLISHED'
    });

    // Mapear con fecha de guardado
    const result = likedPosts.map(liked => {
      const post = posts.find(p => p._id.toString() === liked.postId);
      if (!post) return null;

      return {
        id: liked._id.toString(),
        savedAt: liked.createdAt,
        post: {
          id: post._id.toString(),
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          featuredImage: post.featuredImage,
          publishedAt: post.publishedAt,
          categoryId: post.categoryId,
          tags: post.tags
        }
      };
    }).filter(Boolean);

    return NextResponse.json({
      success: true,
      data: result,
      total: result.length
    });
  } catch (error) {
    console.error('Error fetching liked posts:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener posts guardados' },
      { status: 500 }
    );
  }
}

// POST /api/user/liked-posts - Guardar un post
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Debes iniciar sesión' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { postId } = body;

    if (!postId) {
      return NextResponse.json(
        { success: false, error: 'ID de post es requerido' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Verificar que el post existe y está publicado
    const post = await BlogPostModel.findOne({
      _id: postId,
      status: 'PUBLISHED'
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si ya está guardado
    const existing = await UserLikedPostModel.findOne({
      clerkUserId: userId,
      postId
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Ya está guardado' },
        { status: 409 }
      );
    }

    // Crear like
    const likedPost = new UserLikedPostModel({
      clerkUserId: userId,
      postId
    });

    await likedPost.save();

    return NextResponse.json({
      success: true,
      message: 'Post guardado',
      data: {
        id: likedPost._id.toString(),
        postId,
        savedAt: likedPost.createdAt
      }
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error saving post:', error);

    // Manejar error de duplicado
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Ya está guardado' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Error al guardar post' },
      { status: 500 }
    );
  }
}

// DELETE /api/user/liked-posts - Quitar post de guardados
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Debes iniciar sesión' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json(
        { success: false, error: 'ID de post es requerido' },
        { status: 400 }
      );
    }

    await dbConnect();

    const result = await UserLikedPostModel.findOneAndDelete({
      clerkUserId: userId,
      postId
    });

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'No estaba guardado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Eliminado de guardados'
    });
  } catch (error) {
    console.error('Error removing liked post:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar de guardados' },
      { status: 500 }
    );
  }
}
