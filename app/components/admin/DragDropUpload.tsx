'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { UploadIndicator, UploadState } from './UploadAnimations';

interface DragDropUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number;
  supportedFormats?: string[];
  uploadState?: UploadState;
  uploadProgress?: number;
  uploadError?: string;
  disabled?: boolean;
  className?: string;
}

export const DragDropUpload = ({
  onFileSelect,
  accept = 'image/*',
  maxSize = 10 * 1024 * 1024, // 10MB default
  supportedFormats = ['JPG', 'PNG', 'WebP'],
  uploadState = 'idle',
  uploadProgress = 0,
  uploadError = '',
  disabled = false,
  className = ''
}: DragDropUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    if (file.size > maxSize) {
      // Handle size error - you could emit an error state here
      return;
    }
    onFileSelect(file);
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
          ${isDragging 
            ? 'border-amber-400 bg-amber-50 scale-105' 
            : 'border-stone-300 bg-stone-50 hover:border-amber-300 hover:bg-amber-25'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${uploadState === 'uploading' ? 'pointer-events-none' : ''}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          disabled={disabled}
          className="hidden"
        />

        {uploadState === 'idle' && (
          <>
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-lg font-medium text-stone-700 mb-2">
              Arrastra y suelta archivos aquí
            </p>
            <p className="text-sm text-stone-500 mb-4">
              O haz clic en "Subir Archivos" para seleccionar
            </p>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Subir Archivos
            </button>
            <p className="text-xs text-stone-400 mt-4">
              Soporta: {supportedFormats.join(', ')} (máx. {formatFileSize(maxSize)})
            </p>
          </>
        )}

        {uploadState !== 'idle' && (
          <div className="py-4">
            <UploadIndicator 
              state={uploadState}
              progress={uploadProgress}
              size="lg"
              errorMessage={uploadError}
              successMessage="¡Archivo subido exitosamente!"
            />
          </div>
        )}
      </div>
    </div>
  );
};

interface MultiFileUploadProps extends Omit<DragDropUploadProps, 'onFileSelect'> {
  onFilesSelect: (files: File[]) => void;
  multiple?: boolean;
  maxFiles?: number;
}

export const MultiFileUpload = ({
  onFilesSelect,
  multiple = true,
  maxFiles = 10,
  accept = 'image/*',
  maxSize = 10 * 1024 * 1024,
  supportedFormats = ['JPG', 'PNG', 'WebP', 'MP4', 'PDF'],
  uploadState = 'idle',
  uploadProgress = 0,
  uploadError = '',
  disabled = false,
  className = ''
}: MultiFileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files).slice(0, maxFiles);
    if (files.length > 0) {
      onFilesSelect(files);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files).slice(0, maxFiles);
      onFilesSelect(fileArray);
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
          ${isDragging 
            ? 'border-amber-400 bg-amber-50 scale-105' 
            : 'border-stone-300 bg-stone-50 hover:border-amber-300 hover:bg-amber-25'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${uploadState === 'uploading' ? 'pointer-events-none' : ''}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          disabled={disabled}
          className="hidden"
        />

        {uploadState === 'idle' && (
          <>
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-lg font-medium text-stone-700 mb-2">
              Arrastra y suelta archivos aquí
            </p>
            <p className="text-sm text-stone-500 mb-4">
              O haz clic en "Subir Archivos" para seleccionar
            </p>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Subir Archivos
            </button>
            <p className="text-xs text-stone-400 mt-4">
              Soporta: {supportedFormats.join(', ')} (máx. {formatFileSize(maxSize)})
              {multiple && ` • Hasta ${maxFiles} archivos`}
            </p>
          </>
        )}

        {uploadState !== 'idle' && (
          <div className="py-4">
            <UploadIndicator 
              state={uploadState}
              progress={uploadProgress}
              size="lg"
              errorMessage={uploadError}
              successMessage="¡Archivos subidos exitosamente!"
            />
          </div>
        )}
      </div>
    </div>
  );
};