'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface HeroSlide {
  id: number;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  iconType: 'law' | 'justice' | 'contract' | 'shield';
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    eyebrow: "Bufete de Abogados Especializado",
    title: "Excelencia Jurídica",
    subtitle: "desde 1998",
    description: "Más de 25 años de experiencia defendiendo los derechos de nuestros clientes con estrategias jurídicas innovadoras y resultados excepcionales en México.",
    primaryCta: "Consulta Gratuita",
    secondaryCta: "Nuestros Servicios",
    iconType: "law"
  },
  {
    id: 2,
    eyebrow: "Especialistas en Derecho Corporativo",
    title: "Soluciones Legales",
    subtitle: "Integrales",
    description: "Asesoramos a empresas líderes en fusiones, adquisiciones y estructuración corporativa con un enfoque estratégico y resultados medibles.",
    primaryCta: "Agendar Cita",
    secondaryCta: "Ver Casos Exitosos",
    iconType: "contract"
  },
  {
    id: 3,
    eyebrow: "Protección Legal Completa",
    title: "Justicia y",
    subtitle: "Defensa",
    description: "Defendemos sus derechos con pasión y dedicación. Nuestro equipo de especialistas garantiza la mejor representación legal en cada proceso.",
    primaryCta: "Contactar Ahora",
    secondaryCta: "Nuestro Equipo",
    iconType: "shield"
  }
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLSpanElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Initial animation
    const tl = gsap.timeline({ delay: 0.5 });

    tl.fromTo(backgroundRef.current,
      { scale: 1.1, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.5, ease: 'power2.out' }
    )
    // ALTUM Legal branding appears first (persistent element)
    .fromTo('.persistent-branding',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
      '-=1'
    )
    // Then dynamic content appears
    .fromTo([eyebrowRef.current, titleRef.current, subtitleRef.current],
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'power2.out' },
      '-=0.5'
    )
    .fromTo(descriptionRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.4'
    )
    .fromTo([ctaRef.current, iconRef.current],
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
      '-=0.3'
    );
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isPaused && !isTransitioning) {
      autoPlayRef.current = setTimeout(() => {
        nextSlide();
      }, 6000); // Change slide every 6 seconds
    }

    return () => {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current);
      }
    };
  }, [currentSlide, isPaused, isTransitioning]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Removed ambient animation to prevent any background movement

  const transitionToSlide = (newIndex: number) => {
    if (isTransitioning || newIndex === currentSlide) return;
    
    setIsTransitioning(true);
    const tl = gsap.timeline();

    // Slower, more elegant fade transition
    // NO background changes to avoid ALTUM Legal movement
    tl.to([eyebrowRef.current, titleRef.current, subtitleRef.current, descriptionRef.current, ctaRef.current, iconRef.current], {
      opacity: 0,
      duration: 0.6,
      ease: 'power1.inOut'
    })
    
    // Content change during fade
    .call(() => {
      setCurrentSlide(newIndex);
    })
    
    // Brief pause for elegance
    .to({}, { duration: 0.1 })
    
    // Dynamic content fades back in slowly and smoothly
    .to([eyebrowRef.current, titleRef.current, subtitleRef.current, descriptionRef.current, ctaRef.current, iconRef.current], {
      opacity: 1,
      duration: 0.7,
      ease: 'power1.out',
      onComplete: () => setIsTransitioning(false)
    });
  };

  const nextSlide = () => {
    const newIndex = (currentSlide + 1) % heroSlides.length;
    transitionToSlide(newIndex);
  };

  const prevSlide = () => {
    const newIndex = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
    transitionToSlide(newIndex);
  };

  const currentSlideData = heroSlides[currentSlide];

  const renderIcon = (iconType: string) => {
    switch (iconType) {
      case 'law':
        return (
          <svg className="w-20 h-20 mx-auto mb-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'contract':
        return (
          <svg className="w-20 h-20 mx-auto mb-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'shield':
        return (
          <svg className="w-20 h-20 mx-auto mb-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      default:
        return (
          <svg className="w-20 h-20 mx-auto mb-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Clean solid background */}
      <div className="absolute inset-0 bg-white"></div>
      {/* Clean background - no decorative elements */}
      <div
        ref={backgroundRef}
        className="absolute inset-0"
      >
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="relative">
            {/* Persistent ALTUM Legal Branding - Official typography and colors */}
            <div className="persistent-branding mb-8 relative z-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl leading-tight" style={{ color: '#000000' }}>
                <span className="altum-brand">ALTUM</span>{' '}
                <span className="legal-brand" style={{ color: '#B79F76' }}>Legal</span>
              </h1>
            </div>

            {/* Dynamic Content Container - Fixed height to prevent layout shift */}
            <div className="min-h-[400px]">
              {/* Dynamic Content - Changes with transitions */}
              <div className="mb-6">
                <span 
                  ref={eyebrowRef}
                  className="font-medium text-sm uppercase tracking-wider"
                  style={{ color: '#B79F76' }}
                >
                  {currentSlideData.eyebrow}
                </span>
              </div>
              
              <h2
                ref={titleRef}
                className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold mb-2 leading-tight"
                style={{ color: '#000000' }}
              >
                {currentSlideData.title}
                <span 
                  ref={subtitleRef}
                  className="block italic font-light"
                  style={{ color: '#B79F76' }}
                >
                  {currentSlideData.subtitle}
                </span>
              </h2>

              <p
                ref={descriptionRef}
                className="text-lg mb-10 leading-relaxed font-light"
                style={{ color: '#152239' }}
              >
                {currentSlideData.description}
              </p>

              <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
                <button 
                  className="group px-8 py-4 font-medium transition-all duration-300"
                  style={{ 
                    backgroundColor: '#152239',
                    color: '#FFFFFF'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a2a42'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#152239'}
                >
                  <span className="flex items-center justify-center">
                    {currentSlideData.primaryCta}
                    <svg 
                      className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </button>
                
                <button 
                  className="group px-8 py-4 font-medium border-2 transition-all duration-300"
                  style={{ 
                    borderColor: '#B79F76',
                    color: '#152239',
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#B79F76';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#152239';
                  }}
                >
                  <span className="flex items-center justify-center">
                    {currentSlideData.secondaryCta}
                    <svg 
                      className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Content - Professional Illustration */}
          <div className="relative">
            <div 
              ref={iconRef}
              className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-stone-200 rounded-2xl flex items-center justify-center relative overflow-hidden"
            >
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-16 h-16 bg-amber-200 rounded-full opacity-60"></div>
              <div className="absolute bottom-8 left-6 w-12 h-12 bg-slate-300 rounded-full opacity-50"></div>
              
              {/* Dynamic illustration */}
              <div className="text-center text-slate-500">
                {renderIcon(currentSlideData.iconType)}
                <p className="font-medium text-slate-600">Derecho Profesional</p>
                <p className="text-sm text-slate-500 mt-1">Tradición y Experiencia</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mainletter.ru Style Navigation */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center justify-center space-x-12">
          {/* Previous Button - ALTUM brand colors */}
          <button
            onClick={prevSlide}
            disabled={isTransitioning}
            className="flex items-center space-x-3 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            style={{ color: '#152239' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#B79F76'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#152239'}
          >
            <svg className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
            <span className="text-sm font-medium uppercase tracking-wider">ATRÁS</span>
          </button>

          {/* Slide Indicators - ALTUM brand colors */}
          <div className="flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => transitionToSlide(index)}
                disabled={isTransitioning}
                className="w-2 h-2 rounded-full transition-all duration-200 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: index === currentSlide ? '#152239' : '#B79F76',
                  opacity: index === currentSlide ? 1 : 0.4
                }}
                onMouseEnter={(e) => {
                  if (index !== currentSlide) {
                    e.currentTarget.style.opacity = '0.7';
                  }
                }}
                onMouseLeave={(e) => {
                  if (index !== currentSlide) {
                    e.currentTarget.style.opacity = '0.4';
                  }
                }}
              />
            ))}
          </div>

          {/* Next Button - ALTUM brand colors */}
          <button
            onClick={nextSlide}
            disabled={isTransitioning}
            className="flex items-center space-x-3 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            style={{ color: '#152239' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#B79F76'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#152239'}
          >
            <span className="text-sm font-medium uppercase tracking-wider">SIGUIENTE</span>
            <svg className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}