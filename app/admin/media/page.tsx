'use client';

import { useState, useEffect } from 'react';
import { useUserRole } from '@/app/lib/hooks/useUserRole';
import { toast, Toaster } from 'react-hot-toast';
import { MediaService } from '@/app/lib/application/services/MediaService';
import { MediaFile } from '@/app/lib/domain/entities/MediaFile';
import { MediaUploadZone } from '@/app/components/admin/media/MediaUploadZone';
import { MediaStats } from '@/app/components/admin/media/MediaStats';
import { MediaFilters } from '@/app/components/admin/media/MediaFilters';
import { MediaFileGrid } from '@/app/components/admin/media/MediaFileGrid';
import { UploadState } from '@/app/components/admin/UploadAnimations';

export default function MediaManagementPage() {
  const { hasPermission } = useUserRole();
  
  // State Management
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Upload States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  
  // Service instance
  const mediaService = new MediaService();

  // Effects
  useEffect(() => {
    loadMediaFiles();
  }, []);

  // Event Handlers
  const loadMediaFiles = async () => {
    try {
      const files = await mediaService.getAllMediaFiles();
      setMediaFiles(files);
    } catch (error) {
      toast.error('Error al cargar archivos multimedia');
      console.error(error);
    }
  };

  const handleFilesSelect = async (files: File[]) => {
    if (!hasPermission('manage_media')) {
      toast.error('No tienes permisos para subir archivos');
      return;
    }

    if (files.length === 0) return;

    setIsUploading(true);
    setUploadState('uploading');
    setUploadProgress(0);
    setUploadError('');

    try {
      const results = await mediaService.uploadMultipleMediaFiles(files);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 20;
        });
      }, 200);

      // Wait a bit for better UX
      setTimeout(() => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        const successfulUploads = results.filter(r => r.success);
        const failedUploads = results.filter(r => !r.success);

        if (successfulUploads.length > 0) {
          setUploadState('success');
          toast.success(`${successfulUploads.length} archivo(s) subido(s) exitosamente`);
          
          // Reload media files to show new uploads
          loadMediaFiles();
        }

        if (failedUploads.length > 0) {
          setUploadState('error');
          setUploadError(`${failedUploads.length} archivo(s) fallaron al subir`);
          failedUploads.forEach(result => {
            if (result.error) toast.error(result.error);
          });
        }

        // Reset upload state after showing success/error
        setTimeout(() => {
          setUploadState('idle');
          setUploadProgress(0);
          setUploadError('');
        }, 3000);

      }, 1000);

    } catch (error: any) {
      setUploadState('error');
      setUploadError(error.message || 'Error al subir archivos');
      toast.error(error.message || 'Error al subir archivos');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteFiles = async () => {
    if (selectedFiles.size === 0) return;
    
    if (!confirm(`¿Eliminar ${selectedFiles.size} archivo(s) seleccionado(s)?`)) return;

    try {
      await mediaService.deleteMultipleMediaFiles(Array.from(selectedFiles));
      setMediaFiles(prev => prev.filter(file => !selectedFiles.has(file.id)));
      setSelectedFiles(new Set());
      toast.success(`${selectedFiles.size} archivo(s) eliminado(s)`);
    } catch (error: any) {
      toast.error(error.message || 'Error al eliminar archivos');
    }
  };

  const handleSelectFile = (fileId: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId);
    } else {
      newSelected.add(fileId);
    }
    setSelectedFiles(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedFiles.size === filteredFiles.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(filteredFiles.map(file => file.id)));
    }
  };

  const handleCopyUrl = async (url: string) => {
    try {
      await mediaService.copyUrlToClipboard(url);
      toast.success('URL copiada al portapapeles');
    } catch (error: any) {
      toast.error(error.message || 'Error al copiar URL');
    }
  };

  const handleApplyToAboutHero = async (imageUrl: string) => {
    try {
      const response = await fetch('/api/site-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          setting: 'about-hero-image',
          value: imageUrl
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Imagen aplicada como hero de About exitosamente');
      } else {
        toast.error(data.error || 'Error al aplicar imagen');
      }
    } catch (error: any) {
      toast.error('Error al aplicar imagen como hero');
      console.error(error);
    }
  };

  // Computed values
  const filteredFiles = mediaService.filterMediaFiles(mediaFiles, searchTerm, filterType);
  const stats = mediaService.getFileStatistics(mediaFiles);
  const selectAllLabel = selectedFiles.size === filteredFiles.length && filteredFiles.length > 0 
    ? 'Deseleccionar todo' 
    : 'Seleccionar todo';

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-stone-200 p-4 sm:p-6 lg:p-8">
        <div className="mb-4 sm:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">
              Gestión de Medios
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              Administra imágenes, videos y documentos del sitio web
            </p>
          </div>
        </div>

        {/* Filters */}
        <MediaFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterType={filterType}
          onFilterTypeChange={setFilterType}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          selectedCount={selectedFiles.size}
          onSelectAll={handleSelectAll}
          onDeleteSelected={handleDeleteFiles}
          selectAllLabel={selectAllLabel}
        />
      </div>

      {/* Upload Zone */}
      <MediaUploadZone
        onFilesSelect={handleFilesSelect}
        uploadState={uploadState}
        uploadProgress={uploadProgress}
        uploadError={uploadError}
        isUploading={isUploading}
      />

      {/* Statistics */}
      <MediaStats 
        stats={{
          total: stats.total,
          images: stats.images,
          videos: stats.videos,
          documents: stats.documents
        }}
        selectedCount={selectedFiles.size}
      />

      {/* Files Display */}
      <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-stone-200 p-3 sm:p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Archivos ({filteredFiles.length})
          </h2>
        </div>

        <MediaFileGrid
          files={filteredFiles}
          selectedFiles={selectedFiles}
          onSelectFile={handleSelectFile}
          onCopyUrl={handleCopyUrl}
          onApplyToAboutHero={handleApplyToAboutHero}
        />
      </div>
    </div>
  );
}