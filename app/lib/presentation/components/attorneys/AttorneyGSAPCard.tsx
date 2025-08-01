'use client';

import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import { Attorney } from '@/app/lib/types/Attorney';
import { useAutoAdjustingVerticalText } from '../../hooks/useAutoAdjustingVerticalText';

interface AttorneyGSAPCardProps {
  attorney: Attorney;
  index: number;
  isActive: boolean;
  onCardHover: (index: number | null) => void;
  onClick: (attorney: Attorney) => void;
}

export const AttorneyGSAPCard: React.FC<AttorneyGSAPCardProps> = ({
  attorney,
  index,
  isActive,
  onCardHover,
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const verticalTextRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const typewriterTextRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const typewriterTimelineRef = useRef<gsap.core.Timeline | null>(null);
  
  // State for typewriter effect
  const [splitTextElements, setSplitTextElements] = useState<HTMLSpanElement[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Auto-adjusting vertical text hook
  const { textStyles, displayText, isTextTruncated } = useAutoAdjustingVerticalText({
    text: attorney.name,
    containerRef: cardRef,
    leftPosition: 24 // 6 * 4px (left-6 in Tailwind)
  });

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

  useEffect(() => {
    if (!cardRef.current) return;

    // Initial setup
    gsap.set(descriptionRef.current, { opacity: 0, y: 20 });
    gsap.set(overlayRef.current, { opacity: 0 });
    gsap.set(verticalTextRef.current, { opacity: 1 });

    // Cleanup on unmount
    return () => {
      if (typewriterTimelineRef.current) {
        typewriterTimelineRef.current.kill();
      }
    };
  }, []);

  const handleMouseEnter = () => {
    onCardHover(index);
    
    if (!cardRef.current || !isActive) return;

    const tl = gsap.timeline();

    // Expand card
    tl.to(cardRef.current, {
      scale: 1.1,
      zIndex: 50,
      duration: 0.5,
      ease: "power3.out"
    })
    // Show overlay
    .to(overlayRef.current, {
      opacity: 1,
      duration: 0.3,
      ease: "power2.inOut"
    }, "-=0.3")
    // Fade vertical text
    .to(verticalTextRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: "power2.out"
    }, "-=0.3")
    // Show description
    .to(descriptionRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: "power2.out"
    }, "-=0.2")
    // Start typewriter effect
    .call(() => {
      console.log('Calling typewriter effect from GSAP timeline');
      startTypewriterEffect(attorney.position, 300);
    }, [], "-=0.1");
  };

  const handleMouseLeave = () => {
    onCardHover(null);
    
    // Stop typewriter effect
    stopTypewriterEffect();
    
    if (!cardRef.current) return;

    const tl = gsap.timeline();

    // Reset card
    tl.to(cardRef.current, {
      scale: 1,
      zIndex: index,
      duration: 0.4,
      ease: "power3.inOut"
    })
    // Hide overlay
    .to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.inOut"
    }, "-=0.3")
    // Show vertical text
    .to(verticalTextRef.current, {
      opacity: 1,
      duration: 0.2,
      ease: "power2.in"
    }, "-=0.2")
    // Hide description
    .to(descriptionRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.3,
      ease: "power2.in"
    }, "-=0.3");
  };

  return (
    <div
      ref={cardRef}
      className="relative w-[300px] h-[400px] cursor-pointer overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(attorney)}
      style={{
        transformOrigin: 'center center',
        zIndex: index
      }}
    >
      {/* Background Image */}
      <div ref={imageRef} className="absolute inset-0">
        <Image
          src={attorney.image}
          alt={attorney.name}
          fill
          className="object-cover"
          priority={index < 3}
        />
      </div>

      {/* Gradient Overlay */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
      />

      {/* Vertical Text - Auto-adjusting */}
      <div
        ref={verticalTextRef}
        style={textStyles}
      >
        <h3 className="text-white font-light tracking-wider">
          {attorney.name}
        </h3>
      </div>

      {/* Description (shown on hover) */}
      <div
        ref={descriptionRef}
        className="absolute bottom-6 right-6 text-right max-w-[200px]"
      >
        <h3 className="text-white text-lg font-light mb-1 drop-shadow-lg leading-tight">
          {attorney.name}
        </h3>
        <p className="text-amber-400 text-xs opacity-95 mb-2 uppercase tracking-wider font-medium drop-shadow-lg">
          <span ref={typewriterTextRef}></span>
        </p>
        <p className="text-white/90 text-xs leading-relaxed drop-shadow-lg mb-3">
          {attorney.shortDescription}
        </p>
        <p className="text-white/60 text-xs drop-shadow-lg font-light">
          Haz click aquí para ver más
        </p>
      </div>
    </div>
  );
};