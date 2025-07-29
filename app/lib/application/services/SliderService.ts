import { SliderState, SliderNavigation } from '@/app/lib/domain/entities/SliderState';

export class SliderService {
  private static readonly VISIBLE_CARDS_DESKTOP = 4; // 4 tarjetas GRANDES por pantalla
  private static readonly VISIBLE_CARDS_MOBILE = 2;

  static getVisibleCardsCount(isMobile: boolean = false): number {
    return isMobile ? this.VISIBLE_CARDS_MOBILE : this.VISIBLE_CARDS_DESKTOP;
  }

  static calculateNavigation(state: SliderState): SliderNavigation {
    const maxIndex = Math.max(0, state.totalCards - state.visibleCardsCount);
    
    return {
      canGoNext: state.currentIndex < maxIndex,
      canGoPrevious: state.currentIndex > 0,
      nextIndex: Math.min(state.currentIndex + 1, maxIndex),
      previousIndex: Math.max(state.currentIndex - 1, 0)
    };
  }

  static getVisibleCards<T>(items: T[], currentIndex: number, visibleCount: number): T[] {
    const startIndex = Math.min(currentIndex, Math.max(0, items.length - visibleCount));
    return items.slice(startIndex, startIndex + visibleCount);
  }

  static isCardVisible(cardIndex: number, currentIndex: number, visibleCount: number): boolean {
    return cardIndex >= currentIndex && cardIndex < currentIndex + visibleCount;
  }
}