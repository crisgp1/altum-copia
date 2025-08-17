/**
 * Unified Blob Storage Service for Admin System
 * Handles all file uploads and management through Vercel Blob
 */

export interface UploadResult {
  success: boolean;
  url?: string;
  fileName?: string;
  originalName?: string;
  size?: number;
  type?: string;
  category?: string;
  error?: string;
}

export interface UploadProgressCallback {
  (progress: number): void;
}

export interface UploadStateCallback {
  (state: 'uploading' | 'success' | 'error', message?: string): void;
}

export interface BlobFile {
  url: string;
  fileName: string;
  originalName: string;
  size: number;
  type: string;
  category: string;
  uploadedAt: Date;
}

export class BlobStorageService {
  
  /**
   * Upload a file to the specified category
   * @param file - File to upload
   * @param category - Category folder (attorneys, blog, media, etc.)
   * @returns Upload result with blob URL
   */
  static async uploadFile(file: File, category: string = 'general'): Promise<UploadResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.error || 'Error al subir el archivo'
        };
      }

      const result = await response.json();
      return {
        success: true,
        url: result.url,
        fileName: result.fileName,
        originalName: result.originalName,
        size: result.size,
        type: result.type,
        category: result.category
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      return {
        success: false,
        error: 'Error de conexión al subir el archivo'
      };
    }
  }

  /**
   * Upload an attorney profile image
   * @param file - Image file
   * @returns Upload result
   */
  static async uploadAttorneyImage(file: File): Promise<UploadResult> {
    return this.uploadFile(file, 'attorneys');
  }

  /**
   * Upload blog content images
   * @param file - Image file
   * @returns Upload result
   */
  static async uploadBlogImage(file: File): Promise<UploadResult> {
    return this.uploadFile(file, 'blog');
  }

  /**
   * Upload media files
   * @param file - Media file
   * @returns Upload result
   */
  static async uploadMediaFile(file: File): Promise<UploadResult> {
    return this.uploadFile(file, 'media');
  }

  /**
   * Upload multiple files at once
   * @param files - Array of files to upload
   * @param category - Category for all files
   * @returns Array of upload results
   */
  static async uploadMultipleFiles(files: File[], category: string = 'general'): Promise<UploadResult[]> {
    const uploadPromises = files.map(file => this.uploadFile(file, category));
    return Promise.all(uploadPromises);
  }

  /**
   * Upload a file with progress and state callbacks
   * @param file - File to upload
   * @param category - Category folder
   * @param onProgress - Progress callback (0-100)
   * @param onStateChange - State change callback
   * @returns Upload result
   */
  static async uploadFileWithProgress(
    file: File, 
    category: string = 'general',
    onProgress?: UploadProgressCallback,
    onStateChange?: UploadStateCallback
  ): Promise<UploadResult> {
    try {
      onStateChange?.('uploading', 'Subiendo archivo...');
      onProgress?.(0);

      // Simulate progress for better UX since fetch doesn't provide real progress
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        if (currentProgress >= 90) return;
        currentProgress += Math.random() * 20;
        onProgress?.(currentProgress);
      }, 200);

      const result = await this.uploadFile(file, category);
      clearInterval(progressInterval);

      if (result.success) {
        onProgress?.(100);
        setTimeout(() => {
          onStateChange?.('success', '¡Archivo subido exitosamente!');
        }, 300);
      } else {
        onStateChange?.('error', result.error || 'Error al subir archivo');
      }

      return result;
    } catch (error) {
      onStateChange?.('error', 'Error de conexión al subir el archivo');
      return {
        success: false,
        error: 'Error de conexión al subir el archivo'
      };
    }
  }

  /**
   * Validate file before upload
   * @param file - File to validate
   * @param options - Validation options
   * @returns Validation result
   */
  static validateFile(
    file: File, 
    options: {
      maxSize?: number; // in bytes
      allowedTypes?: string[];
      maxDimensions?: { width: number; height: number };
    } = {}
  ): { valid: boolean; error?: string } {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB default
      allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    } = options;

    // Check file size
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `Archivo demasiado grande. Máximo ${Math.round(maxSize / (1024 * 1024))}MB`
      };
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Tipo de archivo no válido. Tipos permitidos: ${allowedTypes.join(', ')}`
      };
    }

    return { valid: true };
  }

  /**
   * Get file info from blob URL
   * @param url - Blob URL
   * @returns File information if available
   */
  static parseFileInfoFromUrl(url: string): Partial<BlobFile> | null {
    try {
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      // Extract info from filename pattern: category-timestamp-random-originalname
      const fileNameParts = fileName.split('-');
      if (fileNameParts.length >= 4) {
        const category = fileNameParts[0];
        const timestamp = parseInt(fileNameParts[1]);
        const originalName = fileNameParts.slice(3).join('-');
        
        return {
          url,
          fileName,
          originalName,
          category,
          uploadedAt: new Date(timestamp)
        };
      }
      
      return { url, fileName };
    } catch (error) {
      console.error('Error parsing file info from URL:', error);
      return null;
    }
  }

  /**
   * Utility method to create a preview URL for images
   * @param file - File to preview
   * @returns Promise with data URL for preview
   */
  static createPreviewUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('El archivo no es una imagen'));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Admin-specific upload categories
   */
  static readonly CATEGORIES = {
    ATTORNEYS: 'attorneys',
    BLOG: 'blog',
    MEDIA: 'media',
    DOCUMENTS: 'documents',
    SERVICES: 'services',
    GENERAL: 'general'
  } as const;

  /**
   * File type presets for different upload scenarios
   */
  static readonly FILE_TYPE_PRESETS = {
    IMAGES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'] as string[],
    DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'] as string[],
    ALL_MEDIA: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'audio/mpeg', 'audio/wav'] as string[]
  };

  /**
   * Size presets for different scenarios
   */
  static readonly SIZE_PRESETS = {
    SMALL: 2 * 1024 * 1024,    // 2MB
    MEDIUM: 5 * 1024 * 1024,   // 5MB
    LARGE: 10 * 1024 * 1024,   // 10MB
    XLARGE: 50 * 1024 * 1024   // 50MB
  } as const;
}