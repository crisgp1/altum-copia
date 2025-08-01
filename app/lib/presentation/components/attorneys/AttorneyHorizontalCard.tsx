'use client';

import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import { Attorney } from '@/app/lib/types/Attorney';
import { useAutoAdjustingVerticalText } from '../../hooks/useAutoAdjustingVerticalText';

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
  const typewriterTextRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typewriterTimelineRef = useRef<gsap.core.Timeline | null>(null);
  
  // State for typewriter effect
  const [splitTextElements, setSplitTextElements] = useState<HTMLSpanElement[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Auto-adjusting vertical text hook
  const { textStyles, displayText, isTextTruncated } = useAutoAdjustingVerticalText({
    text: attorney.name.toUpperCase(),
    containerRef: cardRef,
    leftPosition: 20
  });



  // Calculate card width based on state - minimal 10% expansion for content visibility
  const getCardWidth = () => {
    const baseWidth = 100 / totalCards; // 25% each for 4 cards
    
    if (hoveredIndex === null) {
      return `${baseWidth}%`; // Equal distribution: 25% each for 4 cards
    } else if (index === hoveredIndex) {
      return `${baseWidth + 10}%`; // Expanded card: 25% + 10% = 35% (minimal expansion)
    } else {
      // Other 3 cards share remaining space: (100 - 35) / 3 = ~21.7% each (minimal compression)
      const remainingWidth = 100 - (baseWidth + 10);
      return `${remainingWidth / (totalCards - 1)}%`;
    }
  };

  // Create split text elements (simulating SplitText)
  const createSplitText = (text: string, container: HTMLElement) => {
    if (!container) return [];
    
    // Clear container
    container.innerHTML = '';
    
    // Create span for each character
    const chars = text.split('').map((char, index) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.opacity = '0';
      span.style.display = 'inline-block';
      span.setAttribute('aria-hidden', 'true');
      container.appendChild(span);
      return span;
    });
    
    // Add aria-label to container for accessibility
    container.setAttribute('aria-label', text);
    
    return chars;
  };

  // GSAP Typewriter effect with stagger
  const startTypewriterEffect = (text: string, delay: number = 0) => {
    console.log('Starting GSAP typewriter effect for:', text);
    
    if (isTyping || !typewriterTextRef.current) return;
    
    setIsTyping(true);
    
    // Create character elements
    const chars = createSplitText(text, typewriterTextRef.current);
    setSplitTextElements(chars);
    
    // Kill any existing timeline
    if (typewriterTimelineRef.current) {
      typewriterTimelineRef.current.kill();
    }
    
    // Create GSAP timeline for typewriter effect
    const tl = gsap.timeline({ 
      delay: delay / 1000,
      onComplete: () => setIsTyping(false)
    });
    
    typewriterTimelineRef.current = tl;
    
    // Animate characters appearing one by one with stagger
    tl.to(chars, {
      opacity: 1,
      duration: 0.05,
      stagger: 0.08, // 80ms between each character
      ease: "none"
    });
    
    return tl;
  };

  // Stop typewriter effect
  const stopTypewriterEffect = () => {
    if (typewriterTimelineRef.current) {
      typewriterTimelineRef.current.kill();
    }
    if (typewriterTextRef.current) {
      typewriterTextRef.current.innerHTML = '';
    }
    setSplitTextElements([]);
    setIsTyping(false);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (typewriterTimelineRef.current) {
        typewriterTimelineRef.current.kill();
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

    // Animate width changes - VERY SLOW AND ELEGANT
    gsap.to(cardRef.current, {
      width: getCardWidth(),
      duration: 2.5, // Much slower, more elegant
      ease: "power2.inOut" // More sophisticated easing
    });

    if (isExpanded) {
      // Expanding animation - very slow and elegant like reference
      const tl = gsap.timeline();
      
      // First fade out vertical text
      tl.to(verticalTextRef.current, {
        opacity: 0,
        duration: 1.2, // Much slower
        ease: "power2.out" // Smoother easing
      })
      // Then show expanded content
      .set(expandedContentRef.current, { display: 'block' })
      .to(expandedContentRef.current, {
        opacity: 1,
        x: 0,
        duration: 1.8, // Much slower
        ease: "power2.out"
      }, "-=0.6")
      // Darken background for better text readability
      .to(backgroundOverlayRef.current, {
        opacity: 0.7,
        duration: 1.5, // Much slower
        ease: "power2.out"
      }, "-=1.8")
      // Show bottom right text
      .set(bottomRightTextRef.current, { display: 'block' })
      .to(bottomRightTextRef.current, {
        opacity: 1,
        duration: 1.0, // Slower
        ease: "power2.out"
      }, "-=0.8")
      // Start typewriter effect after content is visible
      .call(() => {
        console.log('Calling typewriter effect from timeline');
        startTypewriterEffect(attorney.position, 500);
      }, [], "-=0.2");
      
    } else {
      // Collapsing animation - very slow and elegant like reference
      const tl = gsap.timeline();
      
      // Stop typewriter effect first
      tl.call(() => {
        stopTypewriterEffect();
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
        duration: 1.2, // Much slower
        ease: "power2.in"
      }, "-=1.2");
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
        flexShrink: 0,
        border: 'none',
        outline: 'none'
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
            <span ref={typewriterTextRef}></span>
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