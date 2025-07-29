'use client';

import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import { Attorney } from '@/app/lib/types/Attorney';

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

  // Calculate card width based on state - for 4 LARGE cards
  const getCardWidth = () => {
    if (hoveredIndex === null) {
      return `${100 / totalCards}%`; // Equal distribution: 25% each for 4 cards = GRANDES
    } else if (index === hoveredIndex) {
      return '50%'; // Expanded card takes HALF the screen = MUY GRANDE
    } else {
      return `${50 / (totalCards - 1)}%`; // Other 3 cards share remaining 50%: ~16.7% each
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

    // Animate width changes - CONSISTENT SLOW SPEED
    gsap.to(cardRef.current, {
      width: getCardWidth(),
      duration: 1.5, // Consistent slow duration
      ease: "power1.inOut" // Consistent easing throughout
    });

    if (isExpanded) {
      // Expanding animation - smooth and consistent
      const tl = gsap.timeline();
      
      // First fade out vertical text
      tl.to(verticalTextRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power1.out"
      })
      // Then show expanded content
      .set(expandedContentRef.current, { display: 'block' })
      .to(expandedContentRef.current, {
        opacity: 1,
        x: 0,
        duration: 1.0, // Consistent slow speed
        ease: "power1.out"
      }, "-=0.2")
      // Darken background for better text readability
      .to(backgroundOverlayRef.current, {
        opacity: 0.6,
        duration: 0.8,
        ease: "power1.out"
      }, "-=1.0")
      // Show bottom right text
      .set(bottomRightTextRef.current, { display: 'block' })
      .to(bottomRightTextRef.current, {
        opacity: 1,
        duration: 0.6,
        ease: "power1.out"
      }, "-=0.4");
      
    } else {
      // Collapsing animation - smooth and consistent
      const tl = gsap.timeline();
      
      // First hide expanded content
      tl.to(expandedContentRef.current, {
        opacity: 0,
        x: -40,
        duration: 0.8, // Consistent slow speed
        ease: "power1.in"
      })
      .set(expandedContentRef.current, { display: 'none' })
      // Then show vertical text
      .to(verticalTextRef.current, {
        opacity: 1,
        duration: 0.6,
        ease: "power1.in"
      }, "-=0.4")
      // Hide bottom right text
      .to(bottomRightTextRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power1.in"
      })
      .set(bottomRightTextRef.current, { display: 'none' })
      // Lighten background
      .to(backgroundOverlayRef.current, {
        opacity: 0.3,
        duration: 0.6,
        ease: "power1.in"
      }, "-=0.6");
    }
    
  }, [isExpanded, hoveredIndex, index, totalCards]);

  return (
    <div
      ref={cardRef}
      className="relative h-full overflow-hidden cursor-pointer"
      style={{ 
        width: '100%', 
        margin: 0, 
        padding: 0, 
        boxSizing: 'border-box',
        minWidth: 0,
        flexShrink: 0
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
        }, 50);
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
        {/* Vertical Text (collapsed state) - with better contrast */}
        <div
          ref={verticalTextRef}
          className="absolute left-8 top-1/2 -translate-y-1/2 z-10"
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            transform: 'translateY(-50%) rotate(180deg)'
          }}
        >
          <h3 className="text-white text-lg font-light tracking-[0.3em] whitespace-nowrap drop-shadow-lg">
            {attorney.name.toUpperCase()}
          </h3>
        </div>

        {/* Expanded Content - initially hidden */}
        <div
          ref={expandedContentRef}
          className="absolute bottom-0 left-0 right-0 p-8 z-20"
          style={{ display: 'none' }} // Initially hidden
        >
          <h3 className="text-white text-3xl font-light mb-2 drop-shadow-lg">
            {attorney.name}
          </h3>
          <p className="text-amber-400 text-lg opacity-95 mb-3 uppercase tracking-wider font-medium drop-shadow-lg">
            {attorney.position}
          </p>
          <p className="text-white/90 text-sm max-w-sm leading-relaxed drop-shadow-lg">
            {attorney.shortDescription}
          </p>
        </div>
      </div>

      {/* Bottom RIGHT corner indicator (only when expanded) - separate from main content */}
      <div 
        ref={bottomRightTextRef}
        className="absolute bottom-6 right-6 text-white/80 text-sm z-30 opacity-0"
        style={{ display: 'none' }}
      >
        <p className="drop-shadow-lg font-light">Ver más →</p>
      </div>
    </div>
  );
};