'use client';

import { useState, useEffect, useRef, RefObject } from 'react';
import { TextOrientationService } from '../../domain/services/TextOrientationService';

interface UseAutoAdjustingVerticalTextProps {
  text: string;
  containerRef: RefObject<HTMLElement>;
  leftPosition: number;
}

interface UseAutoAdjustingVerticalTextReturn {
  textStyles: React.CSSProperties;
  displayText: string;
  isTextTruncated: boolean;
  containerHeight: number;
}

export function useAutoAdjustingVerticalText({
  text,
  containerRef,
  leftPosition
}: UseAutoAdjustingVerticalTextProps): UseAutoAdjustingVerticalTextReturn {
  const [containerHeight, setContainerHeight] = useState<number>(300); // Default height
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Update container height when container size changes
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateHeight = () => {
      const height = container.getBoundingClientRect().height;
      setContainerHeight(height);
    };

    // Initial measurement
    updateHeight();

    // Set up ResizeObserver for dynamic updates
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserverRef.current = new ResizeObserver(() => {
        updateHeight();
      });
      resizeObserverRef.current.observe(container);
    }

    // Fallback to window resize listener
    const handleResize = () => updateHeight();
    window.addEventListener('resize', handleResize);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [containerRef]);

  // Generate styles based on current text and container height
  const textStyles = TextOrientationService.getAutoAdjustingVerticalStyles(
    text,
    containerHeight,
    leftPosition
  );

  return {
    textStyles,
    displayText: text,
    isTextTruncated: false,
    containerHeight
  };
}