'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface PreloaderProps {
  onLoadComplete: () => void;
}

export default function Preloader({ onLoadComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const altumRef = useRef<HTMLSpanElement>(null);
  const legalRef = useRef<HTMLSpanElement>(null);
  const scaleLineRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const percentageRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out the entire preloader
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.inOut',
          onComplete: onLoadComplete
        });
      }
    });

    // Initial setup
    gsap.set([altumRef.current, legalRef.current], { opacity: 0, y: 20 });
    gsap.set(scaleLineRef.current, { scaleX: 0, transformOrigin: 'left center' });
    gsap.set(progressRef.current, { scaleX: 0, transformOrigin: 'left center' });
    gsap.set(percentageRef.current, { opacity: 0 });

    // Animation sequence
    tl.to(altumRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    })
    .to(legalRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.6')
    .to(scaleLineRef.current, {
      scaleX: 1,
      duration: 0.6,
      ease: 'power2.inOut'
    }, '-=0.4')
    .to(percentageRef.current, {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out'
    }, '-=0.3')
    .to(progressRef.current, {
      scaleX: 1,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: function() {
        const progress = Math.round(this.progress() * 100);
        if (percentageRef.current) {
          percentageRef.current.textContent = `${progress}%`;
        }
      }
    }, '-=0.2')
    .to([altumRef.current, legalRef.current, scaleLineRef.current, percentageRef.current], {
      opacity: 0,
      y: -10,
      duration: 0.6,
      stagger: 0.05,
      ease: 'power2.in'
    }, '+=0.3');

    return () => {
      tl.kill();
    };
  }, [onLoadComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
    >
      <div className="text-center">
        {/* Logo */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl lg:text-7xl leading-tight">
            <span ref={altumRef} className="altum-brand inline-block" style={{ color: '#000000' }}>
              ALTUM
            </span>{' '}
            <span ref={legalRef} className="legal-brand inline-block" style={{ color: '#B79F76' }}>
              Legal
            </span>
          </h1>
        </div>

        {/* Progress Bar Container */}
        <div className="relative w-64 md:w-80 mx-auto">
          {/* Background Line */}
          <div
            ref={scaleLineRef}
            className="h-[1px] w-full"
            style={{ backgroundColor: '#E5E5E5' }}
          />

          {/* Progress Line */}
          <div className="absolute top-0 left-0 h-[1px] w-full overflow-hidden">
            <div
              ref={progressRef}
              className="h-full w-full"
              style={{ backgroundColor: '#152239' }}
            />
          </div>

          {/* Percentage */}
          <div className="mt-6">
            <span
              ref={percentageRef}
              className="text-sm font-medium tracking-wider"
              style={{ color: '#B79F76' }}
            >
              0%
            </span>
          </div>
        </div>

        {/* Loading Text */}
        <div className="mt-8">
          <p
            className="text-sm uppercase tracking-widest font-light"
            style={{ color: '#152239' }}
          >
            Cargando
          </p>
        </div>
      </div>
    </div>
  );
}