'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { BlogPost } from '@/app/lib/domain/entities/BlogPost';

interface ArticleReference {
  text: string;
  category: string;
}

interface ArticleReferencesProps {
  post: BlogPost;
}

export default function ArticleReferences({ post }: ArticleReferencesProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Check if references are enabled and exist
  const referencesEnabled = post.citationConfig?.enabled || false;
  const references = post.citationConfig?.references || [];


  // Show a placeholder if no references are configured
  const showPlaceholder = !referencesEnabled || references.length === 0;

  useEffect(() => {
    if (isExpanded && contentRef.current) {
      gsap.fromTo(contentRef.current,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [isExpanded]);

  // Group references by category
  const groupedReferences = references.reduce((acc: Record<string, ArticleReference[]>, ref) => {
    if (!acc[ref.category]) {
      acc[ref.category] = [];
    }
    acc[ref.category].push(ref);
    return acc;
  }, {});

  const categoryNames: Record<string, string> = {
    'academicas': 'Fuentes Académicas',
    'periodisticas': 'Fuentes Periodísticas', 
    'gubernamentales': 'Fuentes Gubernamentales',
    'legales': 'Fuentes Legales Especializadas',
    'internacionales': 'Organizaciones Internacionales',
    'derechos-humanos': 'Organizaciones de Derechos Humanos',
    'enciclopedicas': 'Referencias Enciclopédicas'
  };

  return (
    <div className="mt-16 bg-gradient-to-br from-slate-50 to-stone-100 rounded-xl border border-stone-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/50 transition-colors duration-200"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-slate-900 text-sm sm:text-base">Referencias y Fuentes</h3>
            <p className="text-xs sm:text-sm text-slate-600">Fuentes consultadas para este artículo</p>
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
          <div className="bg-white rounded-lg border border-stone-200 p-4">
            {showPlaceholder ? (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="text-sm text-slate-600 font-medium">Referencias no disponibles</p>
                <p className="text-xs text-slate-500 mt-1">
                  Las referencias y fuentes consultadas para este artículo no han sido configuradas por el autor.
                </p>
              </div>
            ) : (
              Object.entries(groupedReferences).map(([category, refs]) => (
                <div key={category} className="mb-6 last:mb-0">
                  <h4 className="font-semibold text-slate-800 mb-3 text-sm border-b border-slate-200 pb-2">
                    {categoryNames[category] || category}
                  </h4>
                  <div className="space-y-3">
                    {refs.map((ref, index) => (
                      <div key={index} className="text-xs text-slate-700 leading-relaxed font-mono bg-slate-50 p-3 rounded border">
                        {ref.text}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Note */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-xs text-blue-800">
                <p className="font-medium mb-1">Sobre estas fuentes:</p>
                <p>
                  Estas referencias han sido seleccionadas y verificadas por el equipo editorial de ALTUM Legal 
                  para garantizar la precisión y confiabilidad de la información presentada en este artículo.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}