'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface RouteTransitionLoaderProps {
  isLoading: boolean;
}

export default function RouteTransitionLoader({ isLoading }: RouteTransitionLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !barRef.current) return;

    if (isLoading) {
      // Show loader immediately
      gsap.set(containerRef.current, { display: 'block' });
      gsap.set(barRef.current, { scaleX: 0, transformOrigin: 'left center' });
      
      gsap.to(containerRef.current, {
        opacity: 1,
        duration: 0.2,
        ease: 'power2.out'
      });

      // Icon rotation animation
      if (iconRef.current) {
        gsap.to(iconRef.current, {
          rotation: 360,
          duration: 1,
          ease: 'none',
          repeat: -1
        });
      }

      // Progress bar animation
      gsap.to(barRef.current, {
        scaleX: 0.95,
        duration: 0.8,
        ease: 'power2.inOut'
      });
    } else {
      // Complete and hide quickly
      const tl = gsap.timeline();
      
      tl.to(barRef.current, {
        scaleX: 1,
        duration: 0.2,
        ease: 'power2.out'
      })
      .to(containerRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(containerRef.current, { display: 'none' });
          if (iconRef.current) {
            gsap.killTweensOf(iconRef.current);
          }
        }
      });
    }
  }, [isLoading]);

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 right-0 z-50"
      style={{ display: 'none', opacity: 0 }}
    >
      {/* Top bar loader style - different from initial preloader */}
      <div className="h-1 w-full bg-white shadow-sm">
        <div
          ref={barRef}
          className="h-full"
          style={{ backgroundColor: '#B79F76' }}
        />
      </div>

      {/* Small floating icon */}
      <div className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg">
        <div ref={iconRef} className="w-5 h-5">
          <svg 
            className="w-full h-full" 
            fill="none" 
            stroke="#152239" 
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
            />
          </svg>
        </div>
      </div>
    </div>
  );
}