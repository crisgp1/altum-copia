import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/app/lib/infrastructure/persistence/mongodb/connection';
import { UserFavoriteModel } from '@/app/lib/infrastructure/persistence/mongodb/models/UserFavoriteModel';
import { AttorneyModel } from '@/app/lib/infrastructure/persistence/mongodb/models/AttorneyModel';

// GET /api/user/favorites - Obtener abogados favoritos del usuario
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

    // Obtener IDs de favoritos
    const favorites = await UserFavoriteModel.find({ clerkUserId: userId })
      .sort({ createdAt: -1 });

    const attorneyIds = favorites.map(f => f.attorneyId);

    // Obtener datos de los abogados
    const attorneys = await AttorneyModel.find({
      _id: { $in: attorneyIds },
      activo: true
    });

    // Mapear con fecha de guardado
    const result = favorites.map(fav => {
      const attorney = attorneys.find(a => a._id.toString() === fav.attorneyId);
      if (!attorney) return null;

      return {
        id: fav._id.toString(),
        savedAt: fav.createdAt,
        attorney: {
          id: attorney._id.toString(),
          slug: attorney.slug,
          nombre: attorney.nombre,
          cargo: attorney.cargo,
          especializaciones: attorney.especializaciones,
          imagenUrl: attorney.imagenUrl,
          descripcionCorta: attorney.descripcionCorta
        }
      };
    }).filter(Boolean);

    return NextResponse.json({
      success: true,
      data: result,
      total: result.length
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener favoritos' },
      { status: 500 }
    );
  }
}

// POST /api/user/favorites - Agregar abogado a favoritos
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
    const { attorneyId } = body;

    if (!attorneyId) {
      return NextResponse.json(
        { success: false, error: 'ID de abogado es requerido' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Verificar que el abogado existe
    const attorney = await AttorneyModel.findById(attorneyId);
    if (!attorney) {
      return NextResponse.json(
        { success: false, error: 'Abogado no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si ya está en favoritos
    const existing = await UserFavoriteModel.findOne({
      clerkUserId: userId,
      attorneyId
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Ya está en favoritos' },
        { status: 409 }
      );
    }

    // Crear favorito
    const favorite = new UserFavoriteModel({
      clerkUserId: userId,
      attorneyId
    });

    await favorite.save();

    return NextResponse.json({
      success: true,
      message: 'Agregado a favoritos',
      data: {
        id: favorite._id.toString(),
        attorneyId,
        savedAt: favorite.createdAt
      }
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error adding favorite:', error);

    // Manejar error de duplicado
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Ya está en favoritos' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Error al agregar favorito' },
      { status: 500 }
    );
  }
}

// DELETE /api/user/favorites - Quitar abogado de favoritos
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
    const attorneyId = searchParams.get('attorneyId');

    if (!attorneyId) {
      return NextResponse.json(
        { success: false, error: 'ID de abogado es requerido' },
        { status: 400 }
      );
    }

    await dbConnect();

    const result = await UserFavoriteModel.findOneAndDelete({
      clerkUserId: userId,
      attorneyId
    });

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'No estaba en favoritos' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Eliminado de favoritos'
    });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar favorito' },
      { status: 500 }
    );
  }
}
