'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { BlogPost } from '@/app/lib/domain/entities/BlogPost';
import toast from 'react-hot-toast';

interface CitationComponentProps {
  post: BlogPost;
  author?: {
    id: string;
    name: string;
    position: string;
    bio: string;
    avatar: string;
    expertise: string[];
  };
}

type CitationFormat = 'apa' | 'harvard' | 'mla' | 'chicago';

export default function CitationComponent({ post, author }: CitationComponentProps) {
  const [selectedFormat, setSelectedFormat] = useState<CitationFormat>('apa');
  const [isExpanded, setIsExpanded] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isExpanded && contentRef.current) {
      gsap.fromTo(contentRef.current,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [isExpanded]);

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getCurrentDate = (): string => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date());
  };

  const getCurrentUrl = (): string => {
    return typeof window !== 'undefined' ? window.location.href : '';
  };

  const generateCitation = (format: CitationFormat): string => {
    const authorName = author?.name || 'ALTUM Legal';
    const title = post.title;
    const siteName = 'ALTUM Legal';
    const publishDate = formatDate(post.publishedAt!);
    const accessDate = getCurrentDate();
    const url = getCurrentUrl();
    const year = post.publishedAt?.getFullYear() || new Date().getFullYear();

    switch (format) {
      case 'apa':
        return `${authorName} (${year}). ${title}. *${siteName}*. Recuperado el ${accessDate}, de ${url}`;
      
      case 'harvard':
        return `${authorName} (${year}) '${title}', *${siteName}*, ${publishDate}. Disponible en: ${url} (Consultado: ${accessDate}).`;
      
      case 'mla':
        return `${authorName}. "${title}." *${siteName}*, ${publishDate}, ${url}. Consultado el ${accessDate}.`;
      
      case 'chicago':
        return `${authorName}. "${title}." ${siteName}. ${publishDate}. ${url}.`;
      
      default:
        return '';
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Cita copiada al portapapeles');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        toast.success('Cita copiada al portapapeles');
      } catch (err) {
        toast.error('Error al copiar la cita');
      }
      document.body.removeChild(textArea);
    }
  };

  const formats = [
    { id: 'apa' as CitationFormat, name: 'APA', description: 'American Psychological Association' },
    { id: 'harvard' as CitationFormat, name: 'Harvard', description: 'Harvard Reference System' },
    { id: 'mla' as CitationFormat, name: 'MLA', description: 'Modern Language Association' },
    { id: 'chicago' as CitationFormat, name: 'Chicago', description: 'Chicago Manual of Style' }
  ];

  return (
    <div ref={componentRef} className="bg-gradient-to-br from-slate-50 to-stone-100 rounded-xl border border-stone-200 overflow-hidden mx-2">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/50 transition-colors duration-200"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-slate-900 text-sm sm:text-base">Citar este artículo</h3>
            <p className="text-xs sm:text-sm text-slate-600">Formatos académicos disponibles</p>
          </div>
        </div>
        <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Content */}
      {isExpanded && (
        <div ref={contentRef} className="px-6 pb-6">
          {/* Format Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Formato de citación:
            </label>
            <div className="relative">
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value as CitationFormat)}
                className="w-full px-4 py-3 pr-10 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-slate-900 text-sm font-medium appearance-none cursor-pointer"
              >
                {formats.map((format) => (
                  <option key={format.id} value={format.id}>
                    {format.name} - {format.description}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {/* Format Description */}
            <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="font-medium text-sm text-slate-700">
                  {formats.find(f => f.id === selectedFormat)?.name}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {formats.find(f => f.id === selectedFormat)?.description}
              </p>
            </div>
          </div>

          {/* Generated Citation */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Cita generada:
            </label>
            <div className="relative">
              <div className="p-4 bg-white border border-stone-200 rounded-lg text-sm text-slate-700 leading-relaxed min-h-[80px] font-mono">
                {generateCitation(selectedFormat)}
              </div>
              <button
                onClick={() => copyToClipboard(generateCitation(selectedFormat))}
                className="absolute top-2 right-2 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors duration-200"
                title="Copiar al portapapeles"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => copyToClipboard(generateCitation(selectedFormat))}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-200 text-sm font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copiar Cita
            </button>
            
            <button
              onClick={() => {
                const emailSubject = `Cita: ${post.title}`;
                const emailBody = `Te comparto la cita de este artículo:\n\n${generateCitation(selectedFormat)}\n\nArtículo completo: ${getCurrentUrl()}`;
                window.location.href = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
              }}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200 text-sm font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Enviar por Email
            </button>
          </div>

          {/* Footer Note */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-xs text-blue-800">
                <p className="font-medium mb-1">Nota sobre las citaciones:</p>
                <p>Verifica siempre los requisitos específicos de tu institución o publicación. Las fechas de acceso se generan automáticamente con la fecha actual.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}