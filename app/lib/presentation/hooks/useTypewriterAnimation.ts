'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { TypewriterAnimationService } from '@/app/lib/domain/services/TypewriterAnimationService';

interface UseTypewriterAnimationProps {
  text: string;
  delay?: number;
  charDuration?: number;
  staggerDelay?: number;
}

export const useTypewriterAnimation = ({
  text,
  delay = 300,
  charDuration = 0.05,
  staggerDelay = 0.08
}: UseTypewriterAnimationProps) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const startAnimation = useCallback(() => {
    if (!containerRef.current || isAnimating) return;

    setIsAnimating(true);

    // Kill any existing timeline
    if (timelineRef.current) {
      TypewriterAnimationService.killAnimation(timelineRef.current);
    }

    timelineRef.current = TypewriterAnimationService.createTypewriterAnimation({
      text,
      container: containerRef.current,
      delay,
      charDuration,
      staggerDelay,
      onComplete: () => setIsAnimating(false)
    });
  }, [text, delay, charDuration, staggerDelay, isAnimating]);

  const stopAnimation = useCallback(() => {
    TypewriterAnimationService.killAnimation(timelineRef.current);
    if (containerRef.current) {
      TypewriterAnimationService.clearContainer(containerRef.current);
    }
    timelineRef.current = null;
    setIsAnimating(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        TypewriterAnimationService.killAnimation(timelineRef.current);
      }
    };
  }, []);

  return {
    containerRef,
    startAnimation,
    stopAnimation,
    isAnimating
  };
};