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
      const response = await fetch('/api/media');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Error al cargar archivos');
      }
      
      return data.data.map((fileData: any) => MediaFile.fromJSON(fileData));
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
      const response = await fetch('/api/media', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileIds: [fileId] })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Error al eliminar archivo');
      }
      
      if (data.failed > 0) {
        throw new Error('Error al eliminar el archivo');
      }
      
    } catch (error) {
      console.error('Error deleting media file:', error);
      throw new Error('Error al eliminar el archivo');
    }
  }

  async deleteMultipleMediaFiles(fileIds: string[]): Promise<void> {
    try {
      const response = await fetch('/api/media', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileIds })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Error al eliminar archivos');
      }
      
      if (data.failed > 0) {
        throw new Error(`Error al eliminar ${data.failed} archivo(s)`);
      }
      
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