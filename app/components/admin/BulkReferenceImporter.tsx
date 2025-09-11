'use client';

import { useState } from 'react';
import { ArticleReference } from '@/app/lib/domain/entities/Citation';
import toast from 'react-hot-toast';

interface BulkReferenceImporterProps {
  onImport: (references: ArticleReference[]) => void;
  existingReferences: ArticleReference[];
}

export default function BulkReferenceImporter({ onImport, existingReferences }: BulkReferenceImporterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [parsedReferences, setParsedReferences] = useState<ArticleReference[]>([]);

  // Parse references from bulk text input
  const parseBulkReferences = (text: string): ArticleReference[] => {
    const references: ArticleReference[] = [];
    
    // Split by section headers
    const sections = text.split(/^(Fuentes [^:]*|Referencias [^:]*|Bibliografía [^:]*|Sources [^:]*|Organizaciones [^:]*):\s*$/gim);
    
    for (let i = 1; i < sections.length; i += 2) {
      const sectionName = sections[i];
      const content = sections[i + 1];
      
      // Map section names to categories
      let category = 'general';
      const lowerSection = sectionName.toLowerCase();
      
      if (lowerSection.includes('académicas') || lowerSection.includes('academicas')) {
        category = 'academicas';
      } else if (lowerSection.includes('periodísticas') || lowerSection.includes('periodisticas')) {
        category = 'periodisticas';
      } else if (lowerSection.includes('gubernamentales')) {
        category = 'gubernamentales';
      } else if (lowerSection.includes('legales')) {
        category = 'legales';
      } else if (lowerSection.includes('organizaciones') && lowerSection.includes('internacional')) {
        category = 'internacionales';
      } else if (lowerSection.includes('derechos humanos') || lowerSection.includes('derechos-humanos')) {
        category = 'derechos-humanos';
      } else if (lowerSection.includes('enciclopédicas') || lowerSection.includes('enciclopedicas')) {
        category = 'enciclopedicas';
      }
      
      if (content && content.trim()) {
        const referenceLines = content.split('\n').filter(line => line.trim());
        for (const referenceLine of referenceLines) {
          if (referenceLine.trim()) {
            references.push({
              text: referenceLine.trim(),
              category
            });
          }
        }
      }
    }

    return references;
  };

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData('text');
    
    // Check if it looks like bulk reference format
    if (isBulkReferenceFormat(pastedText)) {
      e.preventDefault();
      setTextInput(pastedText);
      
      // Auto-parse
      const parsed = parseBulkReferences(pastedText);
      setParsedReferences(parsed);
      
      if (parsed.length > 0) {
        toast.success(`${parsed.length} referencias detectadas`);
      } else {
        toast.error('No se pudieron detectar referencias. Intenta con el botón "Parsear Referencias".');
      }
    }
  };

  // Check if text looks like bulk reference format
  const isBulkReferenceFormat = (text: string): boolean => {
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length < 1) return false;
    
    // Check for section headers
    const hasReferenceHeaders = /^(Fuentes [^:]*|Referencias [^:]*|Bibliografía [^:]*|Sources [^:]*|Organizaciones [^:]*):\s*$/gim.test(text);
    
    // Check for common reference patterns
    const hasReferencePatterns = lines.some(line => {
      const trimmed = line.trim();
      return trimmed.length > 30 && (
        /https?:\/\//.test(trimmed) ||        // URL
        /\(\d{4}\)/.test(trimmed) ||          // Year
        /\d{4},/.test(trimmed) ||             // Year with comma
        /[A-Z][a-z]+ [A-Z]/.test(trimmed)     // Author name pattern
      );
    });
    
    return hasReferenceHeaders || hasReferencePatterns;
  };

  // Handle manual parsing
  const handleManualParse = () => {
    if (!textInput.trim()) {
      toast.error('Ingresa el texto de las referencias');
      return;
    }

    const parsed = parseBulkReferences(textInput);
    setParsedReferences(parsed);
    
    if (parsed.length > 0) {
      toast.success(`${parsed.length} referencias parseadas exitosamente`);
    } else {
      toast.error('No se pudieron parsear las referencias. Verifica que tengan el formato correcto.');
    }
  };

  // Import parsed references
  const handleImport = () => {
    if (parsedReferences.length === 0) {
      toast.error('No hay referencias para importar');
      return;
    }

    onImport(parsedReferences);
    toast.success(`${parsedReferences.length} referencias importadas exitosamente`);
    
    // Reset state
    setTextInput('');
    setParsedReferences([]);
    setIsOpen(false);
  };

  // Category display names
  const categoryNames: Record<string, string> = {
    'academicas': 'Fuentes Académicas',
    'periodisticas': 'Fuentes Periodísticas', 
    'gubernamentales': 'Fuentes Gubernamentales',
    'legales': 'Fuentes Legales Especializadas',
    'internacionales': 'Organizaciones Internacionales',
    'derechos-humanos': 'Organizaciones de Derechos Humanos',
    'enciclopedicas': 'Referencias Enciclopédicas',
    'general': 'Referencias Generales'
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        Importar Referencias
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Importación de Referencias del Artículo</h2>
            <p className="text-sm text-gray-500 mt-1">
              Pega las fuentes y referencias consultadas para este artículo
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Input Area */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pega las referencias aquí:
            </label>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onPaste={handlePaste}
              placeholder={`Pega tus referencias aquí...

Ejemplo:
Fuentes Académicas:
Baker Institute. (2024). Unpacking the rhetoric behind Mexico's judicial reform. https://www.bakerinstitute.org/research/

Fuentes Periodísticas:
Al Jazeera. (2024, septiembre 15). Mexico's Obrador enacts divisive judicial reforms. https://www.aljazeera.com/news/`}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm font-mono"
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 Tip: Pega directamente tu lista de referencias organizadas por secciones
            </p>
          </div>

          {/* Parse Button */}
          <div className="flex items-center space-x-3 mb-4">
            <button
              onClick={handleManualParse}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium"
            >
              Parsear Referencias
            </button>
            <span className="text-sm text-gray-500">
              {parsedReferences.length > 0 && `${parsedReferences.length} referencias detectadas`}
            </span>
          </div>

          {/* Parsed References Preview */}
          {parsedReferences.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Referencias detectadas:</h3>
              <div className="space-y-4 max-h-60 overflow-y-auto">
                {Object.entries(parsedReferences.reduce((acc: Record<string, ArticleReference[]>, ref) => {
                  if (!acc[ref.category]) {
                    acc[ref.category] = [];
                  }
                  acc[ref.category].push(ref);
                  return acc;
                }, {})).map(([category, refs]) => (
                  <div key={category} className="p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {categoryNames[category]} ({refs.length})
                      </span>
                    </div>
                    <div className="space-y-2">
                      {refs.slice(0, 3).map((ref, index) => (
                        <p key={index} className="text-xs text-gray-600 font-mono leading-relaxed truncate">
                          {ref.text}
                        </p>
                      ))}
                      {refs.length > 3 && (
                        <p className="text-xs text-gray-500 italic">
                          ...y {refs.length - 3} más
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleImport}
              disabled={parsedReferences.length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              Importar {parsedReferences.length} referencias
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}