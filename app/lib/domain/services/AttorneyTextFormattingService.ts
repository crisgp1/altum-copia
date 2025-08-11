/**
 * Servicio de formateo de texto para tarjetas de abogados
 * Maneja el diseño, colores y resaltado siguiendo principios DDD
 */
import { Attorney } from '../entities/Attorney';

export interface FormattedTextSegment {
  text: string;
  isHighlighted: boolean;
  cssClasses: string;
}

export interface AttorneyTextConfig {
  highlightKeywords: string[];
  baseColorClasses: string;
  highlightColorClasses: string;
  containerClasses: string;
}

export class AttorneyTextFormattingService {
  
  /**
   * Configuración por defecto para el formateo de texto
   */
  private static readonly DEFAULT_CONFIG: AttorneyTextConfig = {
    highlightKeywords: [
      // Posiciones importantes
      'Socia', 'Socio', 'Fundadora', 'Fundador', 'Director', 'Directora', 'Senior',
      // Títulos
      'Lic.', 'Dra.', 'Dr.',
      // Especialidades importantes
      'Corporativo', 'Corporativa', 'Penal', 'Fiscal', 'Laboral', 'Internacional',
      'Inmobiliario', 'Inmobiliaria', 'Ambiental', 'Bancario', 'Bancaria',
      // Números de experiencia
      'años', 'experiencia'
    ],
    baseColorClasses: 'text-white drop-shadow-lg',
    highlightColorClasses: 'text-yellow-400 font-semibold drop-shadow-lg',
    containerClasses: 'text-sm font-light leading-relaxed'
  };

  /**
   * Formatea el texto completo del abogado con resaltado inteligente
   */
  static formatAttorneyText(attorney: Attorney, config?: Partial<AttorneyTextConfig>): string {
    const finalConfig = { ...this.DEFAULT_CONFIG, ...config };
    
    const fullText = this.buildFullText(attorney);
    const segments = this.segmentText(fullText, finalConfig.highlightKeywords);
    
    return this.buildFormattedHTML(segments, finalConfig);
  }

  /**
   * Construye el texto completo del abogado
   */
  private static buildFullText(attorney: Attorney): string {
    const parts = [
      attorney.name,
      attorney.position,
      attorney.shortDescription
    ];
    
    return parts.join(' • ');
  }

  /**
   * Segmenta el texto identificando palabras clave para resaltar
   */
  private static segmentText(text: string, keywords: string[]): FormattedTextSegment[] {
    const segments: FormattedTextSegment[] = [];
    
    // Crear patrón regex que capture las palabras clave (case insensitive)
    const keywordPattern = new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi');
    
    let lastIndex = 0;
    let match;
    
    while ((match = keywordPattern.exec(text)) !== null) {
      // Agregar texto antes de la palabra clave
      if (match.index > lastIndex) {
        const beforeText = text.slice(lastIndex, match.index);
        if (beforeText.trim()) {
          segments.push({
            text: beforeText,
            isHighlighted: false,
            cssClasses: this.DEFAULT_CONFIG.baseColorClasses
          });
        }
      }
      
      // Agregar la palabra clave resaltada
      segments.push({
        text: match[0],
        isHighlighted: true,
        cssClasses: this.DEFAULT_CONFIG.highlightColorClasses
      });
      
      lastIndex = match.index + match[0].length;
    }
    
    // Agregar texto restante
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      if (remainingText.trim()) {
        segments.push({
          text: remainingText,
          isHighlighted: false,
          cssClasses: this.DEFAULT_CONFIG.baseColorClasses
        });
      }
    }
    
    // Si no hay coincidencias, devolver todo el texto como no resaltado
    if (segments.length === 0) {
      segments.push({
        text: text,
        isHighlighted: false,
        cssClasses: this.DEFAULT_CONFIG.baseColorClasses
      });
    }
    
    return segments;
  }

  /**
   * Construye HTML formateado con los segmentos
   */
  private static buildFormattedHTML(segments: FormattedTextSegment[], config: AttorneyTextConfig): string {
    return segments.map(segment => 
      `<span class="${segment.cssClasses}">${segment.text}</span>`
    ).join('');
  }

  /**
   * Obtiene las clases CSS del contenedor para el texto formateado
   */
  static getContainerClasses(config?: Partial<AttorneyTextConfig>): string {
    const finalConfig = { ...this.DEFAULT_CONFIG, ...config };
    return finalConfig.containerClasses;
  }

  /**
   * Configuración personalizada para diferentes tipos de abogados
   */
  static getConfigForAttorneyType(attorneyType: 'partner' | 'senior' | 'associate'): Partial<AttorneyTextConfig> {
    switch (attorneyType) {
      case 'partner':
        return {
          highlightColorClasses: 'text-yellow-400 font-bold drop-shadow-lg',
          baseColorClasses: 'text-white font-light drop-shadow-lg'
        };
      case 'senior':
        return {
          highlightColorClasses: 'text-yellow-300 font-semibold drop-shadow-lg',
          baseColorClasses: 'text-gray-100 font-light drop-shadow-lg'
        };
      case 'associate':
        return {
          highlightColorClasses: 'text-yellow-200 font-medium drop-shadow-lg',
          baseColorClasses: 'text-gray-200 font-light drop-shadow-lg'
        };
      default:
        return {};
    }
  }

  /**
   * Determina el tipo de abogado basado en su posición
   */
  static determineAttorneyType(attorney: Attorney): 'partner' | 'senior' | 'associate' {
    const position = attorney.position.toLowerCase();
    
    if (position.includes('socio') || position.includes('socia') || attorney.isPartner) {
      return 'partner';
    } else if (position.includes('senior')) {
      return 'senior';
    } else {
      return 'associate';
    }
  }

  /**
   * Método principal que combina todo el formateo automáticamente
   */
  static getFormattedTextForCard(attorney: Attorney): { 
    formattedHTML: string; 
    containerClasses: string;
  } {
    const attorneyType = this.determineAttorneyType(attorney);
    const config = this.getConfigForAttorneyType(attorneyType);
    
    return {
      formattedHTML: this.formatAttorneyText(attorney, config),
      containerClasses: this.getContainerClasses(config)
    };
  }
}