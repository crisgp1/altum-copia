/**
 * Servicio para formatear el texto del typewriter de abogados
 * Siguiendo los principios de Domain Driven Design
 */
import { Attorney } from '../entities/Attorney';

export class TypewriterTextFormatterService {
  /**
   * Formatea el texto completo para el efecto typewriter
   * @param attorney - La entidad abogado
   * @returns Texto formateado para typewriter
   */
  static formatAttorneyText(attorney: Attorney): string {
    const parts = [
      attorney.name,
      attorney.position,
      attorney.shortDescription
    ];
    
    return parts.join(' • ');
  }

  /**
   * Formatea el texto con saltos de línea para mejor visualización
   * @param attorney - La entidad abogado
   * @returns Texto formateado con estructura HTML
   */
  static formatAttorneyTextWithBreaks(attorney: Attorney): string {
    return `${attorney.name}\n${attorney.position}\n${attorney.shortDescription}`;
  }

  /**
   * Obtiene solo el texto esencial para el typewriter
   * @param attorney - La entidad abogado
   * @returns Texto esencial formateado
   */
  static getEssentialText(attorney: Attorney): string {
    return `${attorney.name} - ${attorney.position}`;
  }

  /**
   * Calcula la duración óptima basada en la longitud del texto
   * @param text - El texto a analizar
   * @returns Duración recomendada por carácter
   */
  static calculateOptimalCharDuration(text: string): number {
    // MODO DEBUG: Duración fija muy lenta para poder ver la animación
    return 0.4;
  }
}