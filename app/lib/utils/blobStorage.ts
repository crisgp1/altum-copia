/**
 * Utility functions for interacting with Vercel Blob storage via API routes
 */

interface UploadImageResponse {
  success: boolean;
  url?: string;
  filename?: string;
  size?: number;
  type?: string;
  error?: string;
}

interface UploadDataResponse {
  success: boolean;
  url?: string;
  filename?: string;
  path?: string;
  size?: number;
  error?: string;
}

interface RetrieveDataResponse {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Upload an image file to Vercel Blob storage
 * @param file - The image file to upload
 * @returns Promise with upload result
 */
export async function uploadImage(file: File): Promise<UploadImageResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/blob/images', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      success: false,
      error: 'Failed to upload image'
    };
  }
}

/**
 * Upload data (JSON object or string) to Vercel Blob storage
 * @param data - The data to upload
 * @param filename - Name for the file (including extension)
 * @param folder - Optional folder name (defaults to 'data')
 * @returns Promise with upload result
 */
export async function uploadData(
  data: any,
  filename: string,
  folder?: string
): Promise<UploadDataResponse> {
  try {
    const response = await fetch('/api/blob/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data,
        filename,
        folder
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error uploading data:', error);
    return {
      success: false,
      error: 'Failed to upload data'
    };
  }
}

/**
 * Retrieve data from a Vercel Blob URL
 * @param url - The blob URL to fetch data from
 * @returns Promise with the retrieved data
 */
export async function retrieveData(url: string): Promise<RetrieveDataResponse> {
  try {
    const response = await fetch(`/api/blob/data?url=${encodeURIComponent(url)}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error retrieving data:', error);
    return {
      success: false,
      error: 'Failed to retrieve data'
    };
  }
}

/**
 * Upload multiple images at once
 * @param files - Array of image files to upload
 * @returns Promise with array of upload results
 */
export async function uploadMultipleImages(files: File[]): Promise<UploadImageResponse[]> {
  const uploadPromises = files.map(file => uploadImage(file));
  return Promise.all(uploadPromises);
}

/**
 * Example usage functions for common scenarios
 */
export const BlobStorageExamples = {
  /**
   * Upload a blog post with images
   */
  async uploadBlogPost(title: string, content: string, images: File[]) {
    // Upload images first
    const imageUploads = await uploadMultipleImages(images);
    const imageUrls = imageUploads
      .filter(result => result.success)
      .map(result => result.url);

    // Upload blog post data
    const blogData = {
      title,
      content,
      images: imageUrls,
      createdAt: new Date().toISOString()
    };

    return uploadData(blogData, `${title.replace(/[^a-zA-Z0-9]/g, '_')}.json`, 'blog');
  },

  /**
   * Upload user profile with avatar
   */
  async uploadUserProfile(userData: any, avatarFile?: File) {
    let avatarUrl = null;
    
    if (avatarFile) {
      const avatarUpload = await uploadImage(avatarFile);
      if (avatarUpload.success) {
        avatarUrl = avatarUpload.url;
      }
    }

    const profileData = {
      ...userData,
      avatar: avatarUrl,
      updatedAt: new Date().toISOString()
    };

    return uploadData(profileData, `user_${userData.id}.json`, 'profiles');
  },

  /**
   * Upload article content
   */
  async uploadArticle(articleData: any) {
    const filename = `article_${Date.now()}.txt`;
    return uploadData(articleData, filename, 'articles');
  }
};