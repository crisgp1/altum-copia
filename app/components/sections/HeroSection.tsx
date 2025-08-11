'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  backgroundImage: string;
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    eyebrow: "Defensa Jurídica Profesional",
    title: "Ética, Transparencia",
    subtitle: "y Compromiso Real",
    description: "En ALTUM Legal sabemos que detrás de cada asunto legal hay personas, familias y empresas que confían en un equipo para defender lo que más les importa.",
    primaryCta: "Consulta Gratuita",
    secondaryCta: "Nuestros Servicios",
    iconType: "law",
    backgroundImage: "/images/brand/background.png"
  },
  {
    id: 2,
    eyebrow: "Especialistas Jurídicos",
    title: "Soluciones Claras,",
    subtitle: "Honestas y Eficaces",
    description: "Somos un despacho conformado por especialistas en diversas ramas del derecho, enfocados en ofrecer soluciones jurídicas bajo un código de ética estricto.",
    primaryCta: "Agendar Cita",
    secondaryCta: "Nuestro Equipo",
    iconType: "shield",
    backgroundImage: "/images/brand/background2.png"
  },
  {
    id: 3,
    eyebrow: "Compromiso y Confianza",
    title: "Defendemos Causas,",
    subtitle: "Protegemos Derechos",
    description: "Nuestro compromiso va más allá de representar casos: defendemos causas, cuidamos intereses y protegemos derechos con transparencia, honestidad y confianza.",
    primaryCta: "Contactar Ahora",
    secondaryCta: "Ver Especialidades",
    iconType: "contract",
    backgroundImage: "/images/brand/background3.png"
  }
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const router = useRouter();
  
  const heroRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLSpanElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const backgroundImageRef = useRef<HTMLDivElement>(null);
  const backgroundOverlayRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Set initial background image without animation
    if (backgroundImageRef.current) {
      gsap.set(backgroundImageRef.current, {
        backgroundImage: `url(${heroSlides[0].backgroundImage})`
      });
    }
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

  // Subtle ambient animation for background when not transitioning
  useEffect(() => {
    if (!isTransitioning && backgroundImageRef.current) {
      const ambientTl = gsap.timeline({ repeat: -1, yoyo: true });
      
      ambientTl.to(backgroundImageRef.current, {
        scale: 1.02,
        duration: 8,
        ease: 'power1.inOut'
      });

      return () => {
        ambientTl.kill();
      };
    }
  }, [isTransitioning, currentSlide]);

  const transitionToSlide = (newIndex: number) => {
    if (isTransitioning || newIndex === currentSlide) return;
    
    setIsTransitioning(true);
    const tl = gsap.timeline();
    const newSlide = heroSlides[newIndex];

    // Elegant transition with background change
    tl.to([eyebrowRef.current, titleRef.current, subtitleRef.current, descriptionRef.current, ctaRef.current], {
      opacity: 0,
      y: -20,
      duration: 0.6,
      ease: 'power2.inOut'
    })
    // Background image smooth transition
    .to(backgroundImageRef.current, {
      opacity: 0.3,
      scale: 1.05,
      duration: 0.8,
      ease: 'power2.inOut'
    }, '-=0.4')
    
    // Change background image and content during transition
    .call(() => {
      if (backgroundImageRef.current) {
        gsap.set(backgroundImageRef.current, {
          backgroundImage: `url(${newSlide.backgroundImage})`
        });
      }
      setCurrentSlide(newIndex);
    })
    
    // Brief pause for elegance
    .to({}, { duration: 0.15 })
    
    // Background fades back in with new image
    .to(backgroundImageRef.current, {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'power2.out'
    })
    
    // Dynamic content slides back in smoothly
    .to([eyebrowRef.current, titleRef.current, subtitleRef.current, descriptionRef.current, ctaRef.current], {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.05,
      ease: 'power2.out',
      onComplete: () => setIsTransitioning(false)
    }, '-=0.6');
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


  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0" ref={backgroundRef}>
        <div 
          ref={backgroundImageRef}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-out"
        />
        {/* Gradient overlay from image to white */}
        <div 
          ref={backgroundOverlayRef}
          className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/70"
        />
        {/* Additional bottom gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/30" />
      </div>

      {/* Content - Small centered container with left-aligned text */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-left">
          {/* Persistent ALTUM Legal Branding - Official typography and colors */}
          <div className="persistent-branding mb-6 sm:mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight" style={{ color: '#000000' }}>
                <span className="altum-brand">ALTUM</span>{' '}
                <span className="legal-brand" style={{ color: '#B79F76' }}>Legal</span>
              </h1>
            </div>

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
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold mb-2 leading-tight"
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
            className="text-base sm:text-lg mb-6 sm:mb-8 lg:mb-10 leading-relaxed font-light"
            style={{ color: '#152239' }}
          >
            {currentSlideData.description}
          </p>

          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button 
              className="group px-6 sm:px-8 py-3 sm:py-4 font-medium transition-all duration-300 text-sm sm:text-base"
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
              onClick={() => router.push('/services')}
              className="group px-6 sm:px-8 py-3 sm:py-4 font-medium border-2 transition-all duration-300 text-sm sm:text-base"
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

      {/* Mainletter.ru Style Navigation */}
      <div className="absolute bottom-6 sm:bottom-12 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center justify-center space-x-6 sm:space-x-12 bg-white/30 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 shadow-lg">
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
            <span className="text-xs sm:text-sm font-medium uppercase tracking-wider">ATRÁS</span>
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
            <span className="text-xs sm:text-sm font-medium uppercase tracking-wider">SIGUIENTE</span>
            <svg className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}