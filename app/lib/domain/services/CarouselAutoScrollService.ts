/**
 * Servicio para manejar el auto-scroll del carrusel
 * Siguiendo los principios de Domain Driven Design
 */
export class CarouselAutoScrollService {
  private static readonly DEFAULT_SCROLL_SPEED = 30; // píxeles por segundo
  private static readonly DEFAULT_INTERVAL = 50; // milisegundos entre actualizaciones
  private static readonly PAUSE_ON_HOVER = true;
  
  private scrollInterval: NodeJS.Timeout | null = null;
  private isPaused: boolean = false;
  private currentPosition: number = 0;
  
  /**
   * Inicia el auto-scroll del carrusel
   * @param scrollCallback - Función que actualiza la posición del scroll
   * @param maxWidth - Ancho máximo del contenido scrolleable
   * @param containerWidth - Ancho del contenedor visible
   */
  startAutoScroll(
    scrollCallback: (position: number) => void,
    maxWidth: number,
    containerWidth: number
  ): void {
    this.stopAutoScroll();
    
    this.scrollInterval = setInterval(() => {
      if (!this.isPaused) {
        this.currentPosition += this.DEFAULT_SCROLL_SPEED * (this.DEFAULT_INTERVAL / 1000);
        
        // Reset cuando llega al final
        if (this.currentPosition >= maxWidth - containerWidth) {
          this.currentPosition = 0;
        }
        
        scrollCallback(this.currentPosition);
      }
    }, this.DEFAULT_INTERVAL);
  }
  
  /**
   * Detiene el auto-scroll
   */
  stopAutoScroll(): void {
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
      this.scrollInterval = null;
    }
  }
  
  /**
   * Pausa el auto-scroll temporalmente
   */
  pause(): void {
    this.isPaused = true;
  }
  
  /**
   * Reanuda el auto-scroll
   */
  resume(): void {
    this.isPaused = false;
  }
  
  /**
   * Resetea la posición del carrusel
   */
  reset(): void {
    this.currentPosition = 0;
  }
  
  /**
   * Obtiene la configuración de velocidad de scroll
   */
  getScrollSpeed(): number {
    return this.DEFAULT_SCROLL_SPEED;
  }
  
  /**
   * Verifica si el auto-scroll está pausado
   */
  isPausedState(): boolean {
    return this.isPaused;
  }
}