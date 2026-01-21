import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import dbConnect from '@/app/lib/infrastructure/persistence/mongodb/connection';
import { UserFavoriteModel } from '@/app/lib/infrastructure/persistence/mongodb/models/UserFavoriteModel';
import { UserLikedPostModel } from '@/app/lib/infrastructure/persistence/mongodb/models/UserLikedPostModel';

// GET /api/user/profile - Obtener perfil del usuario con estadísticas
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Debes iniciar sesión' },
        { status: 401 }
      );
    }

    // Obtener datos del usuario de Clerk
    const clerkInstance = await clerkClient();
    const user = await clerkInstance.users.getUser(userId);

    await dbConnect();

    // Contar favoritos y posts guardados
    const [favoritesCount, likedPostsCount] = await Promise.all([
      UserFavoriteModel.countDocuments({ clerkUserId: userId }),
      UserLikedPostModel.countDocuments({ clerkUserId: userId })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Usuario',
        imageUrl: user.imageUrl,
        createdAt: user.createdAt,
        lastSignInAt: user.lastSignInAt,
        stats: {
          favorites: favoritesCount,
          likedPosts: likedPostsCount
        }
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener perfil' },
      { status: 500 }
    );
  }
}
