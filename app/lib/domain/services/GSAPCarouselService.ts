/**
 * Servicio GSAP para carrusel infinito
 * Siguiendo los principios de Domain Driven Design
 */
import { gsap } from 'gsap';

export class GSAPCarouselService {
  private static readonly SLOW_DURATION = 20; // 20 segundos para completar el ciclo
  private static readonly CARD_WIDTH = 300; // Ancho base de cada tarjeta
  private static readonly GAP = 10; // Gap entre tarjetas
  
  private animation: gsap.core.Tween | null = null;
  
  /**
   * Inicia el carrusel infinito usando GSAP con ModifiersPlugin
   * @param selector - Selector CSS de las tarjetas
   * @param containerWidth - Ancho del contenedor
   * @param totalCards - Número total de tarjetas
   */
  startInfiniteCarousel(
    selector: string, 
    containerWidth: number, 
    totalCards: number
  ): void {
    this.stopCarousel();
    
    const cardWidthWithGap = this.CARD_WIDTH + this.GAP;
    const totalWidth = cardWidthWithGap * totalCards;
    
    // Posicionar inicialmente las tarjetas en fila
    gsap.set(selector, {
      x: (i: number) => i * cardWidthWithGap
    });
    
    // Crear animación infinita con ModifiersPlugin
    this.animation = gsap.to(selector, {
      duration: this.SLOW_DURATION,
      ease: "none",
      x: `+=${totalWidth}`, // Mover cada tarjeta el ancho total
      modifiers: {
        x: gsap.utils.unitize((x: string) => {
          const numX = parseFloat(x);
          return numX % totalWidth; // Resetear posición usando módulo
        })
      },
      repeat: -1 // Repetir infinitamente
    });
  }
  
  /**
   * Pausa el carrusel
   */
  pauseCarousel(): void {
    if (this.animation) {
      this.animation.pause();
    }
  }
  
  /**
   * Reanuda el carrusel
   */
  resumeCarousel(): void {
    if (this.animation) {
      this.animation.resume();
    }
  }
  
  /**
   * Detiene completamente el carrusel
   */
  stopCarousel(): void {
    if (this.animation) {
      this.animation.kill();
      this.animation = null;
    }
  }
  
  /**
   * Obtiene la configuración de ancho de tarjeta
   */
  getCardConfiguration() {
    return {
      width: this.CARD_WIDTH,
      gap: this.GAP,
      totalWidth: this.CARD_WIDTH + this.GAP
    };
  }
  
  /**
   * Configura la velocidad del carrusel
   * @param duration - Duración en segundos para completar un ciclo
   */
  setCarouselSpeed(duration: number): void {
    if (this.animation) {
      this.animation.duration(duration);
    }
  }
}