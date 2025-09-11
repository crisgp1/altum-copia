'use client';

import { useState } from 'react';
import { CitationConfig, BlogPostCitation, DEFAULT_CITATION_TEMPLATES } from '@/app/lib/domain/entities/Citation';
import toast from 'react-hot-toast';

interface BulkCitationImporterProps {
  onImport: (citations: BlogPostCitation[]) => void;
  existingCitations: BlogPostCitation[];
}

export default function BulkCitationImporter({ onImport, existingCitations }: BulkCitationImporterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [parsedCitations, setParsedCitations] = useState<BlogPostCitation[]>([]);
  const [parseMode, setParseMode] = useState<'auto' | 'format-specific'>('auto');

  // Parse citations from bulk text input
  const parseBulkText = (text: string): BlogPostCitation[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const citations: BlogPostCitation[] = [];

    if (parseMode === 'auto') {
      // Try to auto-detect format and parse accordingly
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        const detectedFormat = detectCitationFormat(trimmedLine);
        if (detectedFormat) {
          citations.push({
            format: detectedFormat,
            citation: trimmedLine,
            isCustom: true
          });
        }
      }
    } else {
      // Parse format-specific citations (support both format names and section headers)
      const sections = text.split(/^(APA|HARVARD|MLA|CHICAGO|Fuentes [^:]*|Referencias [^:]*|Bibliografía [^:]*|Sources [^:]*):\s*$/gim);
      
      for (let i = 1; i < sections.length; i += 2) {
        const sectionName = sections[i];
        const content = sections[i + 1];
        
        // Map section names to citation formats
        let format = sectionName.toLowerCase();
        if (format.includes('fuentes') || format.includes('referencias') || format.includes('bibliografía') || format.includes('sources')) {
          format = 'apa'; // Default section-based citations to APA
        }
        
        if (content && content.trim()) {
          const citationLines = content.split('\n').filter(line => line.trim());
          for (const citationLine of citationLines) {
            if (citationLine.trim()) {
              citations.push({
                format,
                citation: citationLine.trim(),
                isCustom: true
              });
            }
          }
        }
      }
    }

    return citations;
  };

  // Auto-detect citation format based on patterns
  const detectCitationFormat = (citation: string): string | null => {
    // APA pattern: Author (Year). Title. Source. Retrieved... or italics with *
    if (/\(\d{4}\).*(\*.*\*|_.*_).*[Rr]ecuperado|[Rr]etrieved/.test(citation)) {
      return 'apa';
    }
    
    // Harvard pattern: Author (Year) 'Title', Source, Date. Available...
    if (/\(\d{4}\).*[''].*[''].*([Dd]isponible|[Aa]vailable)/.test(citation)) {
      return 'harvard';
    }
    
    // MLA pattern: Author. "Title." Source, Date, URL. Consultado...
    if (/".*".*,.*,.*\..*([Cc]onsultado|[Aa]ccessed)/.test(citation)) {
      return 'mla';
    }
    
    // Chicago pattern: Author. "Title." Source. Date. URL.
    if (/".*".*\..*\d{4}.*\..*https?:\/\//.test(citation)) {
      return 'chicago';
    }
    
    // Fallback patterns - more flexible detection
    if (/\(\d{4}\)/.test(citation)) {
      // Has year in parentheses - likely APA or Harvard
      if (/\*.*\*|_.*_/.test(citation)) {
        return 'apa';
      } else if (/'.*'/.test(citation)) {
        return 'harvard';
      } else {
        return 'apa'; // Default to APA
      }
    }
    
    if (/".*"/.test(citation)) {
      // Has quoted title - likely MLA or Chicago
      if (/,.*,/.test(citation)) {
        return 'mla';
      } else {
        return 'chicago';
      }
    }
    
    // If nothing else matches, default to APA
    if (citation.trim().length > 20) {
      return 'apa';
    }
    
    return null;
  };

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData('text');
    
    // Check if it looks like bulk citation format
    if (isBulkCitationFormat(pastedText)) {
      e.preventDefault();
      setTextInput(pastedText);
      
      // Auto-parse
      const parsed = parseBulkText(pastedText);
      setParsedCitations(parsed);
      
      if (parsed.length > 0) {
        toast.success(`${parsed.length} citas detectadas`);
      } else {
        toast.error('No se pudieron detectar citas. Intenta con el botón "Parsear Citas" o revisa el formato.');
      }
    }
  };

  // Check if text looks like bulk citation format
  const isBulkCitationFormat = (text: string): boolean => {
    const lines = text.split('\n').filter(line => line.trim());
    
    // Must have at least 1 line for single citation or multiple for bulk
    if (lines.length < 1) return false;
    
    // Check for format headers (both citation formats and section headers)
    const hasFormatHeaders = /^(APA|HARVARD|MLA|CHICAGO|Fuentes [^:]*|Referencias [^:]*|Bibliografía [^:]*|Sources [^:]*):\s*$/gim.test(text);
    
    // Check for common citation patterns (more flexible)
    const hasCitationPatterns = lines.some(line => {
      const trimmed = line.trim();
      return trimmed.length > 20 && (
        /\(\d{4}\)/.test(trimmed) ||           // Year in parentheses
        /".*"/.test(trimmed) ||               // Quoted title
        /'.*'/.test(trimmed) ||               // Single quoted title
        /\*.*\*/.test(trimmed) ||             // Italicized text
        /https?:\/\//.test(trimmed) ||        // URL
        /[Rr]ecuperado|[Rr]etrieved|[Dd]isponible|[Aa]vailable|[Cc]onsultado|[Aa]ccessed/.test(trimmed) // Access words
      );
    });
    
    // Check if it looks like a reference list (multiple author-like entries)
    const hasMultipleReferences = lines.length >= 2 && lines.filter(line => {
      const trimmed = line.trim();
      return trimmed.length > 10 && /^[A-Z]/.test(trimmed); // Starts with capital letter
    }).length >= 2;
    
    return hasFormatHeaders || hasCitationPatterns || hasMultipleReferences;
  };

  // Handle manual parsing
  const handleManualParse = () => {
    if (!textInput.trim()) {
      toast.error('Ingresa el texto de las citas');
      return;
    }

    const parsed = parseBulkText(textInput);
    setParsedCitations(parsed);
    
    if (parsed.length > 0) {
      toast.success(`${parsed.length} citas parseadas exitosamente`);
    } else {
      toast.error('No se pudieron parsear las citas. Verifica que tengan el formato correcto o usa el modo de detección automática.');
    }
  };

  // Import parsed citations
  const handleImport = () => {
    if (parsedCitations.length === 0) {
      toast.error('No hay citas para importar');
      return;
    }

    onImport(parsedCitations);
    toast.success(`${parsedCitations.length} citas importadas exitosamente`);
    
    // Reset state
    setTextInput('');
    setParsedCitations([]);
    setIsOpen(false);
  };

  // Generate example format
  const getExampleFormat = () => {
    if (parseMode === 'auto') {
      return `Ejemplo de formato automático (una cita por línea):

ALTUM Legal (2025). La reforma judicial mexicana de 2025. *ALTUM Legal*. Recuperado el 10 de septiembre de 2025, de https://altum-legal.mx/blog/reforma-judicial

ALTUM Legal (2025) 'La reforma judicial mexicana de 2025', *ALTUM Legal*, 10 de septiembre de 2025. Disponible en: https://altum-legal.mx/blog/reforma-judicial (Consultado: 10 de septiembre de 2025).

ALTUM Legal. "La reforma judicial mexicana de 2025." *ALTUM Legal*, 10 de septiembre de 2025, https://altum-legal.mx/blog/reforma-judicial. Consultado el 10 de septiembre de 2025.`;
    } else {
      return `Ejemplo de formato por secciones:

APA:
ALTUM Legal (2025). La reforma judicial mexicana de 2025. *ALTUM Legal*. Recuperado el 10 de septiembre de 2025, de https://altum-legal.mx/blog/reforma-judicial

Fuentes Académicas:
Baker Institute. (2024). Unpacking the rhetoric behind Mexico's judicial reform. Rice University's Baker Institute for Public Policy. https://www.bakerinstitute.org/research/

Fuentes Periodísticas:
Al Jazeera. (2024, septiembre 15). Mexico's Obrador enacts divisive judicial reforms. https://www.aljazeera.com/news/2024/9/15/

Referencias Legales:
Diario Oficial de la Federación. (2024, septiembre 15). Decreto de reforma constitucional. https://www.dof.gob.mx/`;
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center px-4 py-2 text-sm font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
        </svg>
        Importación Masiva
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Importación Masiva de Citas</h2>
            <p className="text-sm text-gray-500 mt-1">
              Pega múltiples citas académicas y serán parseadas automáticamente
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
          {/* Mode Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Modo de detección:
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="auto"
                  checked={parseMode === 'auto'}
                  onChange={(e) => setParseMode(e.target.value as 'auto')}
                  className="mr-2"
                />
                <span className="text-sm">Detección automática</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="format-specific"
                  checked={parseMode === 'format-specific'}
                  onChange={(e) => setParseMode(e.target.value as 'format-specific')}
                  className="mr-2"
                />
                <span className="text-sm">Por formato específico</span>
              </label>
            </div>
          </div>

          {/* Input Area */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pega las citas aquí:
            </label>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onPaste={handlePaste}
              placeholder={`Pega tus citas aquí...\n\n${getExampleFormat()}`}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-sm font-mono"
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 Tip: Pega directamente desde tu documento - se detectará automáticamente el formato
            </p>
          </div>

          {/* Parse Button */}
          <div className="flex items-center space-x-3 mb-4">
            <button
              onClick={handleManualParse}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium"
            >
              Parsear Citas
            </button>
            <span className="text-sm text-gray-500">
              {parsedCitations.length > 0 && `${parsedCitations.length} citas detectadas`}
            </span>
          </div>

          {/* Parsed Citations Preview */}
          {parsedCitations.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Citas detectadas:</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {parsedCitations.map((citation, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-500 uppercase">
                        {citation.format}
                      </span>
                      <span className="text-xs text-blue-600">Personalizada</span>
                    </div>
                    <p className="text-sm text-gray-700 font-mono leading-relaxed">
                      {citation.citation}
                    </p>
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
              disabled={parsedCitations.length === 0}
              className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              Importar {parsedCitations.length} citas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}