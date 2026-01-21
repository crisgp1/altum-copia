import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { verifyApiAuth } from '@/app/lib/auth/api-auth';

// POST /api/upload - Requiere permiso manage_media
export async function POST(request: NextRequest) {
  // Verificar autenticación y permiso manage_media
  const authResult = await verifyApiAuth('manage_media');
  if (!authResult.authorized) {
    return authResult.error;
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string || 'attorneys'; // Default to attorneys for backward compatibility
    
    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de archivo no válido. Solo se permiten imágenes (JPEG, PNG, WebP, GIF)' },
        { status: 400 }
      );
    }

    // Validar tamaño (max 10MB - increased for better quality)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'El archivo es demasiado grande. Máximo 10MB' },
        { status: 400 }
      );
    }

    // Crear nombre único para el archivo
    const timestamp = Date.now();
    const randomSuffix = Math.round(Math.random() * 1E9);
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${category}-${timestamp}-${randomSuffix}-${originalName}`;
    const blobPath = `uploads/${category}/${fileName}`;

    // Subir a Vercel Blob
    const { url } = await put(blobPath, file, {
      access: 'public',
    });

    return NextResponse.json(
      { 
        url: url,
        fileName: fileName,
        originalName: file.name,
        size: file.size,
        type: file.type,
        category: category,
        message: 'Imagen subida exitosamente' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error uploading file to Vercel Blob:', error);
    return NextResponse.json(
      { error: 'Error al subir el archivo' },
      { status: 500 }
    );
  }
}