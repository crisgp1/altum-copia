/**
 * Servicio de configuración de animaciones
 * Siguiendo los principios de Domain Driven Design
 */
export class AnimationConfigService {
  // Configuración de animaciones para tarjetas
  private static readonly CARD_ANIMATION = {
    duration: 0.3, // Reducido de 0.5s para mayor fluidez
    ease: "power2.out",
    expandPercentage: 25, // Aumentado a 25% para mayor visibilidad
  };

  // Configuración de transiciones CSS
  private static readonly CSS_TRANSITION = {
    width: "width 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)",
    transform: "transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)",
    all: "all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)"
  };

  /**
   * Obtiene la configuración de animación para tarjetas
   */
  static getCardAnimationConfig() {
    return this.CARD_ANIMATION;
  }

  /**
   * Obtiene la transición CSS para un tipo específico
   */
  static getCSSTransition(type: 'width' | 'transform' | 'all' = 'all'): string {
    return this.CSS_TRANSITION[type];
  }

  /**
   * Obtiene el porcentaje de expansión para hover
   */
  static getCardExpandPercentage(): number {
    return this.CARD_ANIMATION.expandPercentage;
  }

  /**
   * Obtiene la duración de la animación en milisegundos
   */
  static getAnimationDurationMs(): number {
    return this.CARD_ANIMATION.duration * 1000;
  }
}