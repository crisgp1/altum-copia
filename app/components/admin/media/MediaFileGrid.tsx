'use client';

import Image from 'next/image';
import { MediaFile } from '@/app/lib/domain/entities/MediaFile';

interface MediaFileGridProps {
  files: MediaFile[];
  selectedFiles: Set<string>;
  onSelectFile: (fileId: string) => void;
  onCopyUrl: (url: string) => void;
}

export const MediaFileGrid = ({
  files,
  selectedFiles,
  onSelectFile,
  onCopyUrl
}: MediaFileGridProps) => {
  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 text-stone-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-lg font-medium text-stone-900 mb-2">No se encontraron archivos</h3>
        <p className="text-stone-500">
          Sube tu primer archivo para comenzar
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {files.map((file) => (
        <div
          key={file.id}
          className={`relative group bg-stone-50 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
            selectedFiles.has(file.id) 
              ? 'border-amber-500 bg-amber-50' 
              : 'border-transparent hover:border-stone-300'
          }`}
          onClick={() => onSelectFile(file.id)}
        >
          <div className="aspect-square relative">
            {file.isImage() ? (
              <Image
                src={file.url}
                alt={file.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 16vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-400">
                {file.isVideo() ? (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                ) : (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
              </div>
            )}
          </div>
          
          <div className="p-3">
            <p className="text-sm font-medium text-slate-900 truncate" title={file.name}>
              {file.name}
            </p>
            <p className="text-xs text-slate-500">{file.getFormattedSize()}</p>
          </div>

          {/* Copy URL button */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCopyUrl(file.url);
              }}
              className="p-1 bg-black bg-opacity-50 text-white rounded hover:bg-opacity-70 transition-colors"
              title="Copiar URL"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>

          {/* Selection indicator */}
          {selectedFiles.has(file.id) && (
            <div className="absolute top-2 left-2">
              <div className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};