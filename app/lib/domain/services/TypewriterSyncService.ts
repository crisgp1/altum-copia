/**
 * Servicio para sincronizar el efecto typewriter con las animaciones de las tarjetas
 * Siguiendo los principios de Domain Driven Design
 */
import { gsap } from 'gsap';

export interface TypewriterSyncConfig {
  text: string;
  htmlText?: string; // HTML formateado opcional
  container: HTMLElement;
  cardAnimationDuration: number; // Duración de la animación de la tarjeta
  delayPercentage?: number; // Porcentaje de la animación donde inicia el typewriter (0-1)
  charDuration?: number;
  onComplete?: () => void;
}

export class TypewriterSyncService {
  private static readonly DEFAULT_DELAY_PERCENTAGE = 0.3; // Inicia al 30% de la animación
  private static readonly DEFAULT_CHAR_DURATION = 0.3; // MUCHO más lento para debug
  private static readonly CHAR_STAGGER_MULTIPLIER = 0.6; // Optimizado para mejor ritmo

  /**
   * Crea elementos de caracteres preservando HTML formateado
   */
  private static createCharacterElements(htmlText: string, container: HTMLElement): HTMLElement[] {
    if (!container) return [];
    
    // Limpiar contenedor
    container.innerHTML = '';
    
    // Crear un contenedor temporal para parsear el HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlText;
    
    const chars: HTMLElement[] = [];
    
    // Procesar cada nodo del HTML
    this.processNode(tempDiv, container, chars);
    
    return chars;
  }
  
  /**
   * Procesa recursivamente los nodos HTML preservando el formato
   */
  private static processNode(node: Node, container: HTMLElement, chars: HTMLElement[]): void {
    node.childNodes.forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        // Nodo de texto - crear span para cada caracter
        const text = child.textContent || '';
        for (const char of text) {
          if (char.trim() === '') {
            // Espacios: agregarlos directamente sin animación
            const space = document.createTextNode(char);
            container.appendChild(space);
          } else {
            // Caracteres: crear span animable
            const span = document.createElement('span');
            span.textContent = char;
            span.style.opacity = '0';
            span.style.display = 'inline';
            container.appendChild(span);
            chars.push(span);
          }
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        // Nodo elemento - clonar y procesar contenido
        const element = child as HTMLElement;
        const clonedElement = element.cloneNode(false) as HTMLElement;
        
        // Preservar las clases CSS del elemento original
        if (element.className) {
          clonedElement.className = element.className;
        }
        
        container.appendChild(clonedElement);
        
        // Procesar recursivamente el contenido del elemento
        this.processNode(child, clonedElement, chars);
      }
    });
  }

  /**
   * Calcula el tiempo de stagger basado en la duración total disponible
   */
  private static calculateStaggerTime(
    cardDuration: number,
    delayPercentage: number,
    textLength: number
  ): number {
    // Tiempo disponible para la animación del texto
    const availableTime = cardDuration * (1 - delayPercentage);
    
    // Calcular stagger para que todos los caracteres aparezcan dentro del tiempo disponible
    const calculatedStagger = (availableTime * this.CHAR_STAGGER_MULTIPLIER) / textLength;
    
    // Para textos largos, usar un stagger mínimo más grande - MODO DEBUG
    const minStagger = textLength > 50 ? 0.2 : 0.15; // MUCHO más lento para debug
    const maxStagger = 0.3;
    
    const finalStagger = Math.max(minStagger, Math.min(maxStagger, calculatedStagger));
    
    console.log('🔢 Stagger calculation:', {
      availableTime,
      textLength,
      calculatedStagger,
      finalStagger,
      estimatedTotalTime: finalStagger * textLength
    });
    
    return finalStagger;
  }

  /**
   * Crea una animación typewriter sincronizada con la animación de la tarjeta
   */
  static createSyncedTypewriter({
    text,
    htmlText,
    container,
    cardAnimationDuration,
    delayPercentage = this.DEFAULT_DELAY_PERCENTAGE,
    charDuration = this.DEFAULT_CHAR_DURATION,
    onComplete
  }: TypewriterSyncConfig): gsap.core.Timeline {
    console.log('🔤 Starting typewriter for:', text);
    
    // Validaciones
    if (!container || !text) {
      console.warn('TypewriterSyncService: Container o texto no válido');
      return gsap.timeline();
    }

    // Crear elementos de caracteres (usar HTML si está disponible)
    const textToUse = htmlText || text;
    const chars = this.createCharacterElements(textToUse, container);
    
    console.log('Characters created:', chars.length, 'chars for text:', text);
    
    if (chars.length === 0) {
      console.warn('TypewriterSyncService: No se pudieron crear caracteres');
      return gsap.timeline();
    }

    console.log('Starting DESYNCHRONIZED typewriter - no delays, no GSAP timeline');
    
    // Crear un timeline dummy para mantener compatibilidad
    const timeline = gsap.timeline({ 
      onComplete: () => {
        console.log('🏁 Typewriter completed');
        onComplete?.();
      }
    });
    
    console.log('🎬 Simple Animation Parameters:', {
      chars: chars.length,
      method: 'setTimeout based'
    });
    
    // CALCULADO PARA DURAR EXACTAMENTE 3 SEGUNDOS
    const totalDuration = 3000; // 3 segundos exactos
    const delayPerChar = totalDuration / chars.length; // Distribuir uniformemente en 3 segundos
    
    console.log(`Typewriter config: ${chars.length} chars, ${delayPerChar}ms per char, total: ${chars.length * delayPerChar}ms`);
    
    chars.forEach((char, index) => {
      setTimeout(() => {
        char.style.opacity = '1';
        char.style.display = 'inline';
      }, index * delayPerChar);
    });
    
    // Marcar como completado después de mostrar todos los caracteres
    setTimeout(() => {
      onComplete?.();
    }, chars.length * delayPerChar + 100);
    
    return timeline;
  }

  /**
   * Limpia el contenedor y mata cualquier animación activa
   */
  static cleanup(container: HTMLElement | null, timeline: gsap.core.Timeline | null): void {
    if (timeline) {
      timeline.kill();
    }
    
    if (container) {
      container.innerHTML = '';
    }
  }

  /**
   * Verifica si el contenedor tiene contenido visible
   */
  static hasVisibleContent(container: HTMLElement | null): boolean {
    if (!container) return false;
    
    const spans = container.querySelectorAll('span');
    return spans.length > 0 && Array.from(spans).some(span => 
      (span as HTMLElement).style.opacity === '1'
    );
  }
}