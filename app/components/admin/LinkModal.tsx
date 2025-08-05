'use client';

import { useState } from 'react';

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (url: string, text: string) => void;
  selectedText?: string;
}

export default function LinkModal({ isOpen, onClose, onInsert, selectedText = '' }: LinkModalProps) {
  const [url, setUrl] = useState('');
  const [linkText, setLinkText] = useState(selectedText);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) return;

    setIsLoading(true);
    
    // Add https:// if no protocol is specified
    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://') && !finalUrl.startsWith('mailto:')) {
      finalUrl = 'https://' + finalUrl;
    }

    // Use provided text or URL as fallback
    const finalText = linkText.trim() || finalUrl;

    onInsert(finalUrl, finalText);
    
    // Reset form
    setUrl('');
    setLinkText('');
    setIsLoading(false);
    onClose();
  };

  const handleClose = () => {
    setUrl('');
    setLinkText('');
    onClose();
  };

  const commonUrls = [
    { label: 'Página Principal', url: 'https://altum-legal.com' },
    { label: 'Contacto', url: 'https://altum-legal.com/contacto' },
    { label: 'Servicios', url: 'https://altum-legal.com/servicios' },
    { label: 'Blog', url: 'https://altum-legal.com/blog' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              Insertar Enlace
            </h2>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* URL Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                URL *
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://ejemplo.com"
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder:text-slate-400"
                required
                autoFocus
              />
              <p className="text-xs text-slate-500 mt-1">
                Se agregará "https://" automáticamente si no lo incluyes
              </p>
            </div>

            {/* Link Text */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Texto del enlace
              </label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Texto que aparecerá como enlace"
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder:text-slate-400"
              />
              <p className="text-xs text-slate-500 mt-1">
                {selectedText ? 'Texto seleccionado usado por defecto' : 'Dejalo vacío para usar la URL como texto'}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Enlaces rápidos
              </label>
              <div className="grid grid-cols-2 gap-2">
                {commonUrls.map((link, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setUrl(link.url);
                      if (!linkText) setLinkText(link.label);
                    }}
                    className="p-2 text-xs text-slate-600 bg-stone-50 hover:bg-stone-100 rounded border border-stone-200 transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            {url && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900 mb-1">Vista previa:</p>
                <a 
                  href={url.startsWith('http') ? url : `https://${url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline text-sm"
                  onClick={(e) => e.preventDefault()}
                >
                  {linkText || url}
                </a>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!url.trim() || isLoading}
              className="px-6 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              style={{ backgroundColor: '#B79F76' }}
              onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#9C8A6B')}
              onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#B79F76')}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Insertando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Insertar Enlace
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}