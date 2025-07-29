export interface SliderState {
  currentIndex: number;
  visibleCardsCount: number;
  totalCards: number;
  isTransitioning: boolean;
}

export interface SliderNavigation {
  canGoNext: boolean;
  canGoPrevious: boolean;
  nextIndex: number;
  previousIndex: number;
}