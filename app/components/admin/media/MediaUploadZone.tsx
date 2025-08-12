'use client';

import { useRef } from 'react';
import { MultiFileUpload } from '../DragDropUpload';
import { UploadState } from '../UploadAnimations';

interface MediaUploadZoneProps {
  onFilesSelect: (files: File[]) => void;
  uploadState: UploadState;
  uploadProgress: number;
  uploadError: string;
  isUploading: boolean;
}

export const MediaUploadZone = ({
  onFilesSelect,
  uploadState,
  uploadProgress,
  uploadError,
  isUploading
}: MediaUploadZoneProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFilesSelect(Array.from(files));
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Button */}
      <div className="flex justify-end">
        <button
          onClick={handleButtonClick}
          className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
          disabled={isUploading}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {isUploading ? 'Subiendo...' : 'Subir Archivos'}
        </button>
      </div>

      {/* Drag & Drop Upload Zone */}
      <MultiFileUpload
        onFilesSelect={onFilesSelect}
        accept="image/*,video/*,.pdf"
        maxSize={10 * 1024 * 1024} // 10MB
        maxFiles={10}
        supportedFormats={['JPG', 'PNG', 'WebP', 'MP4', 'PDF']}
        uploadState={uploadState}
        uploadProgress={uploadProgress}
        uploadError={uploadError}
        disabled={isUploading}
      />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,.pdf"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
};