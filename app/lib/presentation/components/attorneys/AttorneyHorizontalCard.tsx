'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import { Attorney } from '@/app/lib/types/Attorney';
import { useAutoAdjustingVerticalText } from '../../hooks/useAutoAdjustingVerticalText';
import { useTypewriterAnimation } from '../../hooks/useTypewriterAnimation';
import { AnimationConfigService } from '@/app/lib/domain/services/AnimationConfigService';

interface AttorneyHorizontalCardProps {
  attorney: Attorney;
  index: number;
  isExpanded: boolean;
  onHover: (index: number | null) => void;
  onClick: (attorney: Attorney) => void;
  totalCards: number;
  hoveredIndex: number | null;
}

export const AttorneyHorizontalCard: React.FC<AttorneyHorizontalCardProps> = ({
  attorney,
  index,
  isExpanded,
  onHover,
  onClick,
  totalCards,
  hoveredIndex
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const verticalTextRef = useRef<HTMLDivElement>(null);
  const expandedContentRef = useRef<HTMLDivElement>(null);
  const backgroundOverlayRef = useRef<HTMLDivElement>(null);
  const bottomRightTextRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-adjusting vertical text hook
  const { textStyles, displayText, isTextTruncated } = useAutoAdjustingVerticalText({
    text: attorney.name.toUpperCase(),
    containerRef: cardRef,
    leftPosition: 20
  });

  // Typewriter animation hook
  const {
    containerRef: typewriterRef,
    startAnimation: startTypewriter,
    stopAnimation: stopTypewriter
  } = useTypewriterAnimation({
    text: attorney.position,
    delay: 500
  });



  // Calculate card width based on state - using AnimationConfigService
  const getCardWidth = () => {
    // Use percentage-based calculations to avoid hydration issues
    const baseWidth = 100 / totalCards; // 25% each for 4 cards
    const expandPercentage = AnimationConfigService.getCardExpandPercentage();
    
    if (hoveredIndex === null) {
      return `calc(${baseWidth}% - 7.5px)`; // Equal distribution: 25% each for 4 cards
    } else if (index === hoveredIndex) {
      return `calc(${baseWidth + (expandPercentage * baseWidth / 100)}% - 7.5px)`; // Expanded card
    } else {
      // Other 3 cards share remaining space
      const expandedExtraWidth = expandPercentage * baseWidth / 100;
      const remainingWidth = 100 - (baseWidth + expandedExtraWidth);
      return `calc(${remainingWidth / (totalCards - 1)}% - 7.5px)`;
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!cardRef.current) return;

    // Set initial states - HIDE expanded content completely
    gsap.set(expandedContentRef.current, { 
      opacity: 0,
      x: -40,
      display: 'none' // Completely hidden initially
    });
    
    gsap.set(verticalTextRef.current, {
      opacity: 1
    });

    gsap.set(backgroundOverlayRef.current, {
      opacity: 0.3 // Light overlay for text readability
    });

    gsap.set(bottomRightTextRef.current, {
      opacity: 0,
      display: 'none'
    });

    // Animate width changes - Optimized speed
    gsap.to(cardRef.current, {
      width: getCardWidth(),
      duration: AnimationConfigService.getCardAnimationConfig().duration,
      ease: AnimationConfigService.getCardAnimationConfig().ease
    });

    if (isExpanded) {
      // Expanding animation - very slow and elegant like reference
      const tl = gsap.timeline();
      
      // First fade out vertical text
      tl.to(verticalTextRef.current, {
        opacity: 0,
        duration: AnimationConfigService.getCardAnimationConfig().duration,
        ease: AnimationConfigService.getCardAnimationConfig().ease
      })
      // Then show expanded content
      .set(expandedContentRef.current, { display: 'block' })
      .to(expandedContentRef.current, {
        opacity: 1,
        x: 0,
        duration: AnimationConfigService.getCardAnimationConfig().duration,
        ease: AnimationConfigService.getCardAnimationConfig().ease
      }, "-=0.1")
      // Darken background for better text readability
      .to(backgroundOverlayRef.current, {
        opacity: 0.7,
        duration: AnimationConfigService.getCardAnimationConfig().duration,
        ease: AnimationConfigService.getCardAnimationConfig().ease
      }, "-=0.3")
      // Show bottom right text
      .set(bottomRightTextRef.current, { display: 'block' })
      .to(bottomRightTextRef.current, {
        opacity: 1,
        duration: AnimationConfigService.getCardAnimationConfig().duration,
        ease: AnimationConfigService.getCardAnimationConfig().ease
      }, "-=0.1")
      // Start typewriter effect after content is visible
      .call(() => {
        startTypewriter();
      }, [], "-=0.2");
      
    } else {
      // Collapsing animation - very slow and elegant like reference
      const tl = gsap.timeline();
      
      // Stop typewriter effect first
      tl.call(() => {
        stopTypewriter();
      })
      // Then hide expanded content
      .to(expandedContentRef.current, {
        opacity: 0,
        x: -60, // More dramatic slide out
        duration: 1.5, // Much slower
        ease: "power2.in"
      })
      .set(expandedContentRef.current, { display: 'none' })
      // Then show vertical text
      .to(verticalTextRef.current, {
        opacity: 1,
        duration: 1.2, // Much slower
        ease: "power2.in"
      }, "-=0.8")
      // Hide bottom right text
      .to(bottomRightTextRef.current, {
        opacity: 0,
        duration: 0.8, // Slower
        ease: "power2.in"
      })
      .set(bottomRightTextRef.current, { display: 'none' })
      // Lighten background
      .to(backgroundOverlayRef.current, {
        opacity: 0.3,
        duration: AnimationConfigService.getCardAnimationConfig().duration,
        ease: AnimationConfigService.getCardAnimationConfig().ease
      }, "-=0.3");
    }
    
  }, [isExpanded, hoveredIndex, index, totalCards]);

  return (
    <div
      ref={cardRef}
      className="relative h-full overflow-hidden cursor-pointer"
      style={{ 
        width: getCardWidth(), 
        margin: 0, 
        padding: 0, 
        boxSizing: 'border-box',
        minWidth: 0,
        flexShrink: 0,
        border: 'none',
        outline: 'none',
        transition: AnimationConfigService.getCSSTransition('width')
      }}
      onMouseEnter={() => {
        // Clear any pending timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        onHover(index);
      }}
      onMouseLeave={() => {
        // Small delay to prevent flickering
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          onHover(null);
        }, 200); // Longer delay for more stable interactions
      }}
      onClick={() => onClick(attorney)}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={attorney.image}
          alt={attorney.name}
          fill
          className="object-cover"
          priority={index < 3}
        />
      </div>

      {/* Background Overlay for text readability */}
      <div 
        ref={backgroundOverlayRef}
        className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-black/40"
      />

      {/* Content Container */}
      <div className="relative h-full flex items-center">
        {/* Vertical Text (collapsed state) - auto-adjusting centered */}
        <div
          ref={verticalTextRef}
          style={textStyles}
        >
          <h3 className="text-white font-medium drop-shadow-lg">
            {attorney.name.toUpperCase()}
          </h3>
        </div>

        {/* Expanded Content - positioned in bottom RIGHT corner like reference */}
        <div
          ref={expandedContentRef}
          className="absolute bottom-6 right-6 z-20 text-right"
          style={{ display: 'none', maxWidth: '180px' }} // Initially hidden, constrained width
        >
          <h3 className="text-white text-lg font-light mb-1 drop-shadow-lg leading-tight">
            {attorney.name}
          </h3>
          <p className="text-amber-400 text-xs opacity-95 mb-2 uppercase tracking-wider font-medium drop-shadow-lg">
            <span ref={typewriterRef}></span>
          </p>
          <p className="text-white/90 text-xs leading-relaxed drop-shadow-lg">
            {attorney.shortDescription}
          </p>
        </div>
      </div>

      {/* Bottom RIGHT corner indicator (only when expanded) - positioned below main content */}
      <div 
        ref={bottomRightTextRef}
        className="absolute bottom-2 right-6 text-white/60 text-xs z-30 opacity-0"
        style={{ display: 'none' }}
      >
        <p className="drop-shadow-lg font-light">Haz click aquí para ver más</p>
      </div>
    </div>
  );
};