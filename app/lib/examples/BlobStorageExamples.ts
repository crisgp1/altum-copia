/**
 * Examples of how to use the new Blob Storage system in the admin interface
 */

import { BlobStorageService } from '../services/BlobStorageService';

export class BlobStorageExamples {
  /**
   * Example: Upload attorney profile image with validation
   */
  static async uploadAttorneyProfileExample(file: File) {
    try {
      // Validate file first
      const validation = BlobStorageService.validateFile(file, {
        maxSize: BlobStorageService.SIZE_PRESETS.MEDIUM, // 5MB
        allowedTypes: BlobStorageService.FILE_TYPE_PRESETS.IMAGES
      });

      if (!validation.valid) {
        console.error('Validation failed:', validation.error);
        return;
      }

      // Upload attorney image
      const result = await BlobStorageService.uploadAttorneyImage(file);
      
      if (result.success) {
        console.log('Attorney image uploaded successfully:', {
          url: result.url,
          fileName: result.fileName,
          size: result.size
        });
        return result.url;
      } else {
        console.error('Upload failed:', result.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  }

  /**
   * Example: Upload blog images for rich content
   */
  static async uploadBlogImagesExample(files: File[]) {
    try {
      // Upload multiple images for blog content
      const results = await BlobStorageService.uploadMultipleFiles(
        files, 
        BlobStorageService.CATEGORIES.BLOG
      );

      const successfulUploads = results.filter(r => r.success);
      const failedUploads = results.filter(r => !r.success);

      console.log(`Uploaded ${successfulUploads.length}/${results.length} images`);
      
      if (failedUploads.length > 0) {
        console.error('Failed uploads:', failedUploads.map(f => f.error));
      }

      return successfulUploads.map(r => ({
        url: r.url!,
        alt: r.originalName!
      }));
    } catch (error) {
      console.error('Blog images upload error:', error);
    }
  }

  /**
   * Example: Upload general media files
   */
  static async uploadMediaFileExample(file: File) {
    try {
      // Upload to media category with larger size limit
      const validation = BlobStorageService.validateFile(file, {
        maxSize: BlobStorageService.SIZE_PRESETS.LARGE, // 10MB
        allowedTypes: BlobStorageService.FILE_TYPE_PRESETS.ALL_MEDIA
      });

      if (!validation.valid) {
        throw new Error(validation.error);
      }

      const result = await BlobStorageService.uploadMediaFile(file);
      
      if (result.success) {
        // Parse additional file info
        const fileInfo = BlobStorageService.parseFileInfoFromUrl(result.url!);
        
        console.log('Media file uploaded:', {
          url: result.url,
          category: result.category,
          uploadedAt: fileInfo?.uploadedAt
        });

        return {
          url: result.url!,
          type: result.type!,
          size: result.size!,
          category: result.category!
        };
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Media upload error:', error);
      throw error;
    }
  }

  /**
   * Example: Create image preview before upload
   */
  static async createImagePreviewExample(file: File) {
    try {
      const previewUrl = await BlobStorageService.createPreviewUrl(file);
      
      // You can now use this previewUrl in an img tag
      console.log('Preview URL created:', previewUrl.substring(0, 50) + '...');
      
      return previewUrl;
    } catch (error) {
      console.error('Preview creation failed:', error);
    }
  }

  /**
   * Example: Comprehensive upload flow for admin form
   */
  static async adminUploadFlowExample(file: File, category: string) {
    try {
      // Step 1: Create preview
      let previewUrl = null;
      if (file.type.startsWith('image/')) {
        previewUrl = await BlobStorageService.createPreviewUrl(file);
      }

      // Step 2: Validate file
      const validation = BlobStorageService.validateFile(file);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error,
          preview: previewUrl
        };
      }

      // Step 3: Upload file
      const uploadResult = await BlobStorageService.uploadFile(file, category);

      // Step 4: Parse file info
      const fileInfo = uploadResult.success 
        ? BlobStorageService.parseFileInfoFromUrl(uploadResult.url!)
        : null;

      return {
        success: uploadResult.success,
        url: uploadResult.url,
        fileName: uploadResult.fileName,
        originalName: uploadResult.originalName,
        size: uploadResult.size,
        type: uploadResult.type,
        category: uploadResult.category,
        preview: previewUrl,
        fileInfo,
        error: uploadResult.error
      };
    } catch (error) {
      console.error('Admin upload flow error:', error);
      return {
        success: false,
        error: 'Error en el proceso de subida'
      };
    }
  }
}