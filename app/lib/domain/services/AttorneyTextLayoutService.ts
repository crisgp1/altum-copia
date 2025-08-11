/**
 * Servicio para el layout y diseño visual del texto en tarjetas de abogados
 * Maneja posicionamiento, espaciado e interlineado siguiendo principios DDD
 */

export interface TextLayoutConfig {
  // Posicionamiento
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  padding: {
    right: string;
    bottom: string;
    left?: string;
    top?: string;
  };
  
  // Espaciado y tipografía
  lineHeight: string;
  letterSpacing: string;
  wordSpacing: string;
  textAlign: 'left' | 'right' | 'center';
  
  // Layout visual
  maxWidth: string;
  minWidth?: string;
  
  // Efectos visuales
  backdrop: boolean;
  shadow: boolean;
}

export interface AttorneyTextSegment {
  text: string;
  type: 'name' | 'position' | 'description' | 'action';
  isHighlighted: boolean;
}

export class AttorneyTextLayoutService {
  
  /**
   * Configuración premium para texto de abogados - RESPONSIVE
   */
  private static readonly PREMIUM_LAYOUT_CONFIG: TextLayoutConfig = {
    position: 'bottom-right',
    padding: {
      right: 'clamp(8px, 2vw, 16px)',   // Padding responsive
      bottom: 'clamp(12px, 3vh, 20px)', // Padding responsive vertical
      left: '0px'
    },
    lineHeight: '1.6',        // Interlineado más compacto para mobile
    letterSpacing: '0.02em',  // Espaciado reducido para mobile
    wordSpacing: '0.05em',    // Espaciado reducido para mobile
    textAlign: 'right',       // Alineado a la derecha
    maxWidth: 'min(280px, 40vw)', // Responsive max-width
    minWidth: 'min(150px, 25vw)', // Responsive min-width
    backdrop: false,
    shadow: true
  };

  /**
   * Configuración para el texto de acción (call-to-action) - RESPONSIVE
   */
  private static readonly ACTION_TEXT_CONFIG: TextLayoutConfig = {
    position: 'bottom-right',
    padding: {
      right: 'clamp(8px, 2vw, 16px)',
      bottom: 'clamp(4px, 1vh, 8px)'
    },
    lineHeight: '1.3',
    letterSpacing: '0.015em',
    wordSpacing: '0.03em',
    textAlign: 'right',
    maxWidth: 'min(200px, 35vw)', // Responsive max-width
    backdrop: false,
    shadow: true
  };

  /**
   * Genera las clases CSS para el contenedor principal
   */
  static getContainerClasses(config: TextLayoutConfig = this.PREMIUM_LAYOUT_CONFIG): string {
    const positionClasses = this.getPositionClasses(config.position);
    const layoutClasses = this.getLayoutClasses(config);
    const visualClasses = this.getVisualEffectClasses(config);
    
    return `${positionClasses} ${layoutClasses} ${visualClasses}`.trim();
  }

  /**
   * Genera las clases de posicionamiento - RESPONSIVE
   */
  private static getPositionClasses(position: string): string {
    switch (position) {
      case 'bottom-right':
        return 'absolute bottom-0 right-0 w-auto';
      case 'bottom-left':
        return 'absolute bottom-0 left-0 w-auto';
      case 'top-right':
        return 'absolute top-0 right-0 w-auto';
      case 'top-left':
        return 'absolute top-0 left-0 w-auto';
      default:
        return 'absolute bottom-0 right-0 w-auto';
    }
  }

  /**
   * Genera las clases de layout y espaciado
   */
  private static getLayoutClasses(config: TextLayoutConfig): string {
    const textAlign = config.textAlign === 'right' ? 'text-right' : 
                     config.textAlign === 'center' ? 'text-center' : 'text-left';
    
    return `${textAlign}`;
  }

  /**
   * Genera las clases para efectos visuales
   */
  private static getVisualEffectClasses(config: TextLayoutConfig): string {
    let classes = '';
    
    // Sin backdrop blur - las letras se ven bien sin fondo borroso
    // Solo mantener sombras para contraste
    
    if (config.shadow) {
      classes += 'drop-shadow-xl ';
    }
    
    return classes.trim();
  }

  /**
   * Genera estilos inline para el contenedor
   */
  static getContainerStyles(config: TextLayoutConfig = this.PREMIUM_LAYOUT_CONFIG): React.CSSProperties {
    return {
      paddingRight: config.padding.right,
      paddingBottom: config.padding.bottom,
      paddingLeft: config.padding.left || '0px',
      paddingTop: config.padding.top || '0px',
      lineHeight: config.lineHeight,
      letterSpacing: config.letterSpacing,
      wordSpacing: config.wordSpacing,
      maxWidth: config.maxWidth,
      minWidth: config.minWidth || 'auto',
    };
  }

  /**
   * Genera estilos inline para el texto principal - RESPONSIVE
   */
  static getTextStyles(): React.CSSProperties {
    return {
      fontSize: 'clamp(11px, 2.5vw, 14px)', // Responsive font size
      fontWeight: '300',
      fontFamily: 'Inter, -apple-system, sans-serif',
      color: 'white',
      textShadow: '0 2px 8px rgba(0, 0, 0, 0.7)',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      wordBreak: 'break-word' as const, // Prevent text overflow on mobile
      overflowWrap: 'break-word' as const
    };
  }

  /**
   * Segmenta el texto del abogado en partes estructuradas
   */
  static segmentAttorneyText(fullText: string): AttorneyTextSegment[] {
    const parts = fullText.split(' • ');
    const segments: AttorneyTextSegment[] = [];
    
    parts.forEach((part, index) => {
      let type: AttorneyTextSegment['type'];
      let isHighlighted = false;
      
      // Determinar el tipo de segmento
      if (index === 0) {
        type = 'name';
        isHighlighted = part.includes('Lic.') || part.includes('Dra.');
      } else if (index === 1) {
        type = 'position';
        isHighlighted = part.includes('Socio') || part.includes('Director') || part.includes('Senior');
      } else {
        type = 'description';
        isHighlighted = part.includes('años') || part.includes('experiencia');
      }
      
      segments.push({
        text: part,
        type,
        isHighlighted
      });
    });
    
    return segments;
  }

  /**
   * Genera HTML estructurado con saltos de línea elegantes
   */
  static formatTextWithBreaks(segments: AttorneyTextSegment[]): string {
    return segments.map((segment, index) => {
      const classes = segment.isHighlighted ? 'text-yellow-400 font-medium' : 'text-white font-light';
      const isLast = index === segments.length - 1;
      
      return `<span class="${classes}">${segment.text}</span>${!isLast ? '<br/>' : ''}`;
    }).join('');
  }

  /**
   * Configuración específica para texto de acción (CTA)
   */
  static getActionTextConfig(): { 
    containerClasses: string;
    containerStyles: React.CSSProperties;
    textStyles: React.CSSProperties;
  } {
    return {
      containerClasses: this.getContainerClasses(this.ACTION_TEXT_CONFIG),
      containerStyles: this.getContainerStyles(this.ACTION_TEXT_CONFIG),
      textStyles: {
        fontSize: 'clamp(9px, 2vw, 11px)', // Responsive font size
        fontWeight: '400',
        color: 'rgba(255, 255, 255, 0.7)',
        textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
        letterSpacing: '0.015em',
        wordBreak: 'break-word' as const,
        overflowWrap: 'break-word' as const
      }
    };
  }

  /**
   * Método principal que combina todo el diseño
   */
  static getCompleteLayout(attorneyText: string): {
    mainText: {
      containerClasses: string;
      containerStyles: React.CSSProperties;
      textStyles: React.CSSProperties;
      formattedHTML: string;
    };
    actionText: {
      containerClasses: string;
      containerStyles: React.CSSProperties;
      textStyles: React.CSSProperties;
    };
  } {
    const segments = this.segmentAttorneyText(attorneyText);
    const formattedHTML = this.formatTextWithBreaks(segments);
    
    return {
      mainText: {
        containerClasses: this.getContainerClasses(),
        containerStyles: this.getContainerStyles(),
        textStyles: this.getTextStyles(),
        formattedHTML
      },
      actionText: this.getActionTextConfig()
    };
  }
}