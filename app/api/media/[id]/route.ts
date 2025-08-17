import { NextRequest, NextResponse } from 'next/server';
import { list } from '@vercel/blob';

// GET /api/media/[id] - Get specific media file
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const fileId = decodeURIComponent(params.id);
    
    // Get all blobs and find the specific one
    const { blobs } = await list();
    const blob = blobs.find(b => b.pathname === fileId);
    
    if (!blob) {
      return NextResponse.json(
        { success: false, error: 'Archivo no encontrado' },
        { status: 404 }
      );
    }

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
    
    const mediaFile = {
      id: blob.pathname,
      name: blob.pathname.split('/').pop() || 'unnamed',
      url: blob.url,
      type: contentType,
      size: blob.size,
      uploadedAt: blob.uploadedAt,
      category,
      description: '',
      tags: []
    };

    return NextResponse.json({
      success: true,
      data: mediaFile
    });
  } catch (error) {
    console.error('Error fetching media file:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al cargar archivo multimedia' 
      },
      { status: 500 }
    );
  }
}

// DELETE /api/media/[id] - Delete specific media file
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const fileId = decodeURIComponent(params.id);
    
    // Import del method dynamically to avoid edge runtime issues
    const { del } = await import('@vercel/blob');
    
    await del(fileId);

    return NextResponse.json({
      success: true,
      message: 'Archivo eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error deleting media file:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al eliminar archivo' 
      },
      { status: 500 }
    );
  }
}