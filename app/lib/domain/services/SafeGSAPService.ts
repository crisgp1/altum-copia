/**
 * Servicio para operaciones seguras con GSAP
 * Previene errores de referencias null siguiendo principios DDD
 */
import { gsap } from 'gsap';

export interface GSAPSafeOperation {
  element: HTMLElement | null;
  properties: gsap.TweenVars;
  fallback?: () => void;
}

export interface GSAPBatchOperation {
  operations: GSAPSafeOperation[];
  onComplete?: () => void;
  onError?: (errors: Error[]) => void;
}

export class SafeGSAPService {
  
  /**
   * Ejecuta gsap.set de forma segura validando la referencia
   */
  static safeSet(
    element: HTMLElement | null | undefined, 
    properties: gsap.TweenVars,
    fallback?: () => void
  ): boolean {
    if (element && element instanceof HTMLElement) {
      try {
        gsap.set(element, properties);
        return true;
      } catch (error) {
        console.warn('[SafeGSAPService] Error in gsap.set:', error);
        fallback?.();
        return false;
      }
    }
    
    // Elemento no válido - ejecutar fallback si existe
    if (fallback) {
      console.warn('[SafeGSAPService] Element is null, executing fallback');
      fallback();
    }
    
    return false;
  }

  /**
   * Ejecuta gsap.to de forma segura validando la referencia
   */
  static safeTo(
    element: HTMLElement | null | undefined,
    properties: gsap.TweenVars,
    fallback?: () => void
  ): gsap.core.Tween | null {
    if (element && element instanceof HTMLElement) {
      try {
        return gsap.to(element, properties);
      } catch (error) {
        console.warn('[SafeGSAPService] Error in gsap.to:', error);
        fallback?.();
        return null;
      }
    }
    
    // Elemento no válido - ejecutar fallback si existe
    if (fallback) {
      console.warn('[SafeGSAPService] Element is null, executing fallback');
      fallback();
    }
    
    return null;
  }

  /**
   * Ejecuta múltiples operaciones GSAP de forma segura
   */
  static safeBatchSet(operations: GSAPSafeOperation[]): {
    successful: number;
    failed: number;
    errors: Error[];
  } {
    let successful = 0;
    let failed = 0;
    const errors: Error[] = [];

    operations.forEach((operation, index) => {
      const success = this.safeSet(
        operation.element,
        operation.properties,
        operation.fallback
      );
      
      if (success) {
        successful++;
      } else {
        failed++;
        errors.push(new Error(`Operation ${index} failed: element is null or invalid`));
      }
    });

    return { successful, failed, errors };
  }

  /**
   * Valida múltiples referencias antes de ejecutar operaciones
   */
  static validateRefs(...refs: (React.RefObject<HTMLElement> | null)[]): boolean {
    return refs.every(ref => ref && ref.current && ref.current instanceof HTMLElement);
  }

  /**
   * Obtiene elemento de forma segura desde un RefObject
   */
  static getElement<T extends HTMLElement>(
    ref: React.RefObject<T> | null
  ): T | null {
    if (ref && ref.current && ref.current instanceof HTMLElement) {
      return ref.current;
    }
    return null;
  }

  /**
   * Ejecuta una función solo si todas las referencias son válidas
   */
  static withValidRefs<T>(
    refs: React.RefObject<HTMLElement>[],
    callback: () => T,
    fallback?: () => T
  ): T | undefined {
    const allValid = this.validateRefs(...refs);
    
    if (allValid) {
      return callback();
    } else if (fallback) {
      console.warn('[SafeGSAPService] Some refs are invalid, executing fallback');
      return fallback();
    }
    
    return undefined;
  }

  /**
   * Crea un proxy seguro para operaciones GSAP en un elemento
   */
  static createSafeProxy(element: HTMLElement | null): {
    set: (properties: gsap.TweenVars) => boolean;
    to: (properties: gsap.TweenVars) => gsap.core.Tween | null;
    isValid: () => boolean;
  } {
    return {
      set: (properties: gsap.TweenVars) => this.safeSet(element, properties),
      to: (properties: gsap.TweenVars) => this.safeTo(element, properties),
      isValid: () => element !== null && element instanceof HTMLElement
    };
  }
}