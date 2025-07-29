'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import { Attorney } from '@/app/lib/types/Attorney';

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

  useEffect(() => {
    if (!cardRef.current) return;

    // Initial setup
    gsap.set(descriptionRef.current, { opacity: 0, y: 20 });
    gsap.set(overlayRef.current, { opacity: 0 });
    gsap.set(verticalTextRef.current, { opacity: 1 });
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
    }, "-=0.2");
  };

  const handleMouseLeave = () => {
    onCardHover(null);
    
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

      {/* Vertical Text */}
      <div
        ref={verticalTextRef}
        className="absolute left-6 top-1/2 -translate-y-1/2 -rotate-90 origin-center"
        style={{
          writingMode: 'vertical-rl',
          textOrientation: 'mixed'
        }}
      >
        <h3 className="text-2xl font-light text-white tracking-wider whitespace-nowrap">
          {attorney.name}
        </h3>
      </div>

      {/* Description (shown on hover) */}
      <div
        ref={descriptionRef}
        className="absolute bottom-6 right-6 text-right"
      >
        <p className="text-white text-sm font-light leading-relaxed max-w-[200px]">
          {attorney.shortDescription}
        </p>
      </div>
    </div>
  );
};