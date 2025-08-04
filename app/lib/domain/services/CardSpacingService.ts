/**
 * Service para manejar el espaciado entre tarjetas
 * Siguiendo los principios de Domain Driven Design
 */
export class CardSpacingService {
  private static readonly DEFAULT_GAP = 10; // 10px de espacio por defecto
  private static readonly MOBILE_GAP = 6;   // 6px en móvil
  private static readonly DESKTOP_GAP = 12; // 12px en desktop grande

  /**
   * Obtiene el espaciado apropiado según el viewport
   * @param screenWidth - Ancho de la pantalla
   * @returns Gap en píxeles
   */
  static getCardGap(screenWidth: number): number {
    if (screenWidth < 768) {
      return this.MOBILE_GAP;
    } else if (screenWidth >= 1440) {
      return this.DESKTOP_GAP;
    }
    return this.DEFAULT_GAP;
  }

  /**
   * Calcula el ancho ajustado de las tarjetas considerando el espaciado
   * @param containerWidth - Ancho del contenedor
   * @param cardCount - Número de tarjetas
   * @param gap - Espaciado entre tarjetas
   * @returns Ancho calculado para cada tarjeta
   */
  static calculateCardWidth(
    containerWidth: number, 
    cardCount: number, 
    gap: number
  ): number {
    const totalGaps = (cardCount - 1) * gap;
    const availableWidth = containerWidth - totalGaps;
    return availableWidth / cardCount;
  }

  /**
   * Obtiene el espaciado para el carousel de attorneys
   * @returns Espaciado en píxeles
   */
  static getAttorneyCarouselGap(): number {
    return this.DEFAULT_GAP;
  }

  /**
   * Calcula el porcentaje de ancho para tarjetas con espaciado
   * @param totalCards - Número total de tarjetas
   * @param containerWidthPx - Ancho del contenedor en píxeles
   * @returns Porcentaje de ancho para cada tarjeta
   */
  static getCardWidthPercentage(totalCards: number, containerWidthPx: number = 1200): number {
    const gap = this.getAttorneyCarouselGap();
    const totalGaps = (totalCards - 1) * gap;
    const availableWidth = containerWidthPx - totalGaps;
    const cardWidthPx = availableWidth / totalCards;
    const percentage = (cardWidthPx / containerWidthPx) * 100;
    return percentage;
  }
}