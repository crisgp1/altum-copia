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
   * Configuración premium para texto de abogados
   */
  private static readonly PREMIUM_LAYOUT_CONFIG: TextLayoutConfig = {
    position: 'bottom-right',
    padding: {
      right: '16px',   // Padding mínimo desde la orilla derecha
      bottom: '20px',  // Padding desde la orilla inferior
      left: '0px'      // Sin padding izquierdo para maximizar espacio
    },
    lineHeight: '1.7',        // Interlineado generoso para elegancia
    letterSpacing: '0.025em', // Espaciado sutil entre letras
    wordSpacing: '0.1em',     // Espaciado entre palabras
    textAlign: 'right',       // Alineado a la derecha
    maxWidth: '280px',        // Ancho máximo controlado
    minWidth: '200px',        // Ancho mínimo para consistencia
    backdrop: false,          // Sin fondo borroso - las sombras son suficientes
    shadow: true              // Sombra para contraste
  };

  /**
   * Configuración para el texto de acción (call-to-action)
   */
  private static readonly ACTION_TEXT_CONFIG: TextLayoutConfig = {
    position: 'bottom-right',
    padding: {
      right: '16px',
      bottom: '8px'     // Más cerca del borde para el CTA
    },
    lineHeight: '1.4',
    letterSpacing: '0.02em',
    wordSpacing: '0.05em',
    textAlign: 'right',
    maxWidth: '200px',
    backdrop: false,    // Sin backdrop para el CTA
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
   * Genera las clases de posicionamiento
   */
  private static getPositionClasses(position: string): string {
    switch (position) {
      case 'bottom-right':
        return 'absolute bottom-0 right-0';
      case 'bottom-left':
        return 'absolute bottom-0 left-0';
      case 'top-right':
        return 'absolute top-0 right-0';
      case 'top-left':
        return 'absolute top-0 left-0';
      default:
        return 'absolute bottom-0 right-0';
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
   * Genera estilos inline para el texto principal
   */
  static getTextStyles(): React.CSSProperties {
    return {
      fontSize: '14px',
      fontWeight: '300',           // Peso ligero para elegancia
      fontFamily: 'Inter, -apple-system, sans-serif',
      color: 'white',
      textShadow: '0 2px 8px rgba(0, 0, 0, 0.7)', // Sombra fuerte para contraste
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale'
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
        fontSize: '11px',
        fontWeight: '400',
        color: 'rgba(255, 255, 255, 0.7)',
        textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
        letterSpacing: '0.02em'
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