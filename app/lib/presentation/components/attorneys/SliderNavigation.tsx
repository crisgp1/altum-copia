'use client';

import React from 'react';
import { SliderNavigation as ISliderNavigation } from '@/app/lib/domain/entities/SliderState';

interface SliderNavigationProps {
  navigation: ISliderNavigation;
  onNext: () => void;
  onPrevious: () => void;
  currentIndex: number;
  totalPages: number;
}

export const SliderNavigation: React.FC<SliderNavigationProps> = ({
  navigation,
  onNext,
  onPrevious,
  currentIndex,
  totalPages
}) => {
  return (
    <div className="flex items-center justify-between w-full absolute top-1/2 -translate-y-1/2 z-40 px-4">
      {/* Previous Button */}
      <button
        onClick={onPrevious}
        disabled={!navigation.canGoPrevious}
        className={`
          w-12 h-12 rounded-full backdrop-blur-sm transition-all duration-300 flex items-center justify-center
          ${navigation.canGoPrevious 
            ? 'bg-white/20 hover:bg-white/30 text-white shadow-lg' 
            : 'bg-white/10 text-white/40 cursor-not-allowed'
          }
        `}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Next Button */}
      <button
        onClick={onNext}
        disabled={!navigation.canGoNext}
        className={`
          w-12 h-12 rounded-full backdrop-blur-sm transition-all duration-300 flex items-center justify-center
          ${navigation.canGoNext 
            ? 'bg-white/20 hover:bg-white/30 text-white shadow-lg' 
            : 'bg-white/10 text-white/40 cursor-not-allowed'
          }
        `}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};