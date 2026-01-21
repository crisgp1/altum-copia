import { NextRequest, NextResponse } from 'next/server';
import { list } from '@vercel/blob';
import { verifyApiAuth } from '@/app/lib/auth/api-auth';

// GET /api/media - Get all uploaded media files - Requiere permiso manage_media
export async function GET(request: NextRequest) {
  // Verificar autenticación y permiso manage_media
  const authResult = await verifyApiAuth('manage_media');
  if (!authResult.authorized) {
    return authResult.error;
  }

  try {
    // Get all blobs from Vercel Blob Storage
    const { blobs } = await list();
    
    // Transform blob data to MediaFile format
    const mediaFiles = blobs.map((blob, index) => {
      // Extract category from pathname if available
      const pathParts = blob.pathname.split('/');
      const category = pathParts.length > 1 ? pathParts[1] : 'general';
      
      // Get file extension from url
      const urlParts = blob.url.split('.');
      const extension = urlParts[urlParts.length - 1].toLowerCase();
      
      // Determine MIME type based on extension
      let contentType = 'application/octet-stream';
      if (['jpg', 'jpeg'].includes(extension)) contentType = 'image/jpeg';
      else if (extension === 'png') contentType = 'image/png';
      else if (extension === 'gif') contentType = 'image/gif';
      else if (extension === 'webp') contentType = 'image/webp';
      else if (extension === 'pdf') contentType = 'application/pdf';
      else if (extension === 'mp4') contentType = 'video/mp4';
      else if (extension === 'webm') contentType = 'video/webm';
      
      return {
        id: blob.pathname, // Use pathname as unique ID
        name: blob.pathname.split('/').pop() || 'unnamed', // Get filename from path
        url: blob.url,
        type: contentType,
        size: blob.size,
        uploadedAt: blob.uploadedAt,
        category,
        description: '',
        tags: []
      };
    });

    // Sort by upload date, newest first
    mediaFiles.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    return NextResponse.json({
      success: true,
      data: mediaFiles
    });
  } catch (error) {
    console.error('Error fetching media files:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al cargar archivos multimedia' 
      },
      { status: 500 }
    );
  }
}

// DELETE /api/media - Delete multiple media files - Requiere permiso manage_media
export async function DELETE(request: NextRequest) {
  // Verificar autenticación y permiso manage_media
  const authResult = await verifyApiAuth('manage_media');
  if (!authResult.authorized) {
    return authResult.error;
  }

  try {
    const body = await request.json();
    const { fileIds } = body;

    if (!Array.isArray(fileIds) || fileIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'IDs de archivos requeridos' },
        { status: 400 }
      );
    }

    // Import del method dynamically to avoid edge runtime issues
    const { del } = await import('@vercel/blob');

    // Delete each file
    const deletePromises = fileIds.map(async (fileId: string) => {
      try {
        await del(fileId); // fileId is the pathname in Vercel Blob
        return { fileId, success: true };
      } catch (error) {
        console.error(`Error deleting file ${fileId}:`, error);
        return { fileId, success: false, error: 'Error al eliminar archivo' };
      }
    });

    const results = await Promise.all(deletePromises);
    const successfulDeletes = results.filter(r => r.success);
    const failedDeletes = results.filter(r => !r.success);

    return NextResponse.json({
      success: true,
      deleted: successfulDeletes.length,
      failed: failedDeletes.length,
      results
    });
  } catch (error) {
    console.error('Error deleting media files:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al eliminar archivos' 
      },
      { status: 500 }
    );
  }
}