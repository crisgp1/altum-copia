/**
 * MediaService - Application Service for Media Management
 * Follows Single Responsibility Principle (SRP)
 * Responsible only for media file operations
 */

import { MediaFile, MediaFileProps } from '@/app/lib/domain/entities/MediaFile';
import { BlobStorageService, UploadResult } from '@/app/lib/services/BlobStorageService';

export interface IMediaService {
  getAllMediaFiles(): Promise<MediaFile[]>;
  uploadMediaFile(file: File): Promise<UploadResult>;
  uploadMultipleMediaFiles(files: File[]): Promise<UploadResult[]>;
  deleteMediaFile(fileId: string): Promise<void>;
  deleteMultipleMediaFiles(fileIds: string[]): Promise<void>;
  copyUrlToClipboard(url: string): Promise<void>;
  validateFile(file: File): { valid: boolean; error?: string };
}

export class MediaService implements IMediaService {
  private readonly allowedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'application/pdf'
  ];
  
  private readonly maxFileSize = 10 * 1024 * 1024; // 10MB

  async getAllMediaFiles(): Promise<MediaFile[]> {
    try {
      // For now, return mock data - replace with actual API call
      const mockData: MediaFileProps[] = [
        {
          id: '1',
          name: 'attorney-profile.jpg',
          url: 'https://2zzwsrtnkjplj0sx.public.blob.vercel-storage.com/uploads/attorneys/attorneys-1754933312079-111938380-attorney-profile.jpg',
          type: 'image/jpeg',
          size: 245760,
          uploadedAt: new Date('2024-01-15T10:30:00Z'),
          category: 'attorneys',
          description: 'Foto de perfil de abogado',
          tags: ['attorney', 'profile']
        },
        {
          id: '2',
          name: 'logo-altum.png',
          url: 'https://2zzwsrtnkjplj0sx.public.blob.vercel-storage.com/uploads/media/media-1754933312080-111938381-logo-altum.png',
          type: 'image/png',
          size: 89432,
          uploadedAt: new Date('2024-01-14T14:22:00Z'),
          category: 'branding',
          description: 'Logo oficial de Altum Legal',
          tags: ['logo', 'branding']
        },
        {
          id: '3',
          name: 'presentation.pdf',
          url: 'https://2zzwsrtnkjplj0sx.public.blob.vercel-storage.com/uploads/documents/documents-1754933312081-111938382-presentation.pdf',
          type: 'application/pdf',
          size: 1234567,
          uploadedAt: new Date('2024-01-13T09:15:00Z'),
          category: 'documents',
          description: 'Presentación corporativa',
          tags: ['presentation', 'corporate']
        }
      ];

      return mockData.map(data => MediaFile.fromJSON(data));
    } catch (error) {
      console.error('Error fetching media files:', error);
      throw new Error('Error al cargar archivos multimedia');
    }
  }

  async uploadMediaFile(file: File): Promise<UploadResult> {
    // Validate file first
    const validation = this.validateFile(file);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error
      };
    }

    try {
      const result = await BlobStorageService.uploadMediaFile(file);
      return result;
    } catch (error) {
      console.error('Error uploading media file:', error);
      return {
        success: false,
        error: 'Error al subir el archivo'
      };
    }
  }

  async uploadMultipleMediaFiles(files: File[]): Promise<UploadResult[]> {
    const results: UploadResult[] = [];
    
    for (const file of files) {
      const result = await this.uploadMediaFile(file);
      results.push(result);
    }
    
    return results;
  }

  async deleteMediaFile(fileId: string): Promise<void> {
    try {
      // Mock deletion - replace with actual API call
      console.log(`Deleting media file with ID: ${fileId}`);
      
      // In a real implementation, this would call an API endpoint
      // await fetch(`/api/media/${fileId}`, { method: 'DELETE' });
      
    } catch (error) {
      console.error('Error deleting media file:', error);
      throw new Error('Error al eliminar el archivo');
    }
  }

  async deleteMultipleMediaFiles(fileIds: string[]): Promise<void> {
    try {
      const deletePromises = fileIds.map(id => this.deleteMediaFile(id));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting multiple media files:', error);
      throw new Error('Error al eliminar los archivos');
    }
  }

  async copyUrlToClipboard(url: string): Promise<void> {
    try {
      if (!navigator.clipboard) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return;
      }
      
      await navigator.clipboard.writeText(url);
    } catch (error) {
      console.error('Error copying URL to clipboard:', error);
      throw new Error('Error al copiar URL al portapapeles');
    }
  }

  validateFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    if (!this.allowedTypes.includes(file.type)) {
      const allowedExtensions = this.allowedTypes
        .map(type => {
          if (type.startsWith('image/')) return type.split('/')[1].toUpperCase();
          if (type === 'application/pdf') return 'PDF';
          if (type.startsWith('video/')) return type.split('/')[1].toUpperCase();
          return type;
        })
        .join(', ');
      
      return {
        valid: false,
        error: `Tipo de archivo no soportado. Tipos permitidos: ${allowedExtensions}`
      };
    }

    // Check file size
    if (file.size > this.maxFileSize) {
      const maxSizeMB = this.maxFileSize / (1024 * 1024);
      return {
        valid: false,
        error: `Archivo muy grande. Tamaño máximo: ${maxSizeMB}MB`
      };
    }

    // Check file name
    if (!file.name || file.name.trim().length === 0) {
      return {
        valid: false,
        error: 'El archivo debe tener un nombre válido'
      };
    }

    return { valid: true };
  }

  /**
   * Filter media files based on search criteria
   */
  filterMediaFiles(
    files: MediaFile[], 
    searchTerm: string, 
    filterType: string
  ): MediaFile[] {
    return files.filter(file => {
      const matchesSearch = !searchTerm || file.matchesSearch(searchTerm);
      const matchesType = file.matchesType(filterType);
      return matchesSearch && matchesType;
    });
  }

  /**
   * Get file statistics
   */
  getFileStatistics(files: MediaFile[]): {
    total: number;
    images: number;
    videos: number;
    documents: number;
    totalSize: number;
  } {
    return {
      total: files.length,
      images: files.filter(f => f.isImage()).length,
      videos: files.filter(f => f.isVideo()).length,
      documents: files.filter(f => f.isDocument()).length,
      totalSize: files.reduce((sum, f) => sum + f.size, 0)
    };
  }
}