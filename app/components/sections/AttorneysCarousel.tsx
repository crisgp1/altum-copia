'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { Attorney } from '@/app/lib/types/Attorney';
import { attorneys } from '@/app/lib/data/attorneys';

export default function AttorneysCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAttorney, setSelectedAttorney] = useState<Attorney | null>(null);
  const [hoveredAttorney, setHoveredAttorney] = useState<Attorney | null>(null);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const catalogRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const visibleCards = 3;
  const totalCards = attorneys.length;

  useEffect(() => {
    // Initial setup - show exactly 3 cards (0, 1, 2)
    const cardSpacing = 350;
    const centerOffset = -cardSpacing;
    
    gsap.set(cardsRef.current, { 
      x: (index) => {
        if (index < visibleCards) {
          return centerOffset + (index * cardSpacing);
        }
        return centerOffset + (visibleCards * cardSpacing); // Hide others to the right
      },
      scale: 1,
      opacity: (index) => index < visibleCards ? 1 : 0,
      zIndex: (index) => index < visibleCards ? visibleCards - index : 0
    });
  }, []);

  const updateCarousel = (newIndex: number) => {
    const tl = gsap.timeline();
    const cardSpacing = 350;
    const centerOffset = -cardSpacing;
    
    cardsRef.current.forEach((card, index) => {
      // Calculate position relative to newIndex
      const position = index - newIndex;
      
      // Only show exactly 3 cards: positions 0, 1, 2
      const isVisible = position >= 0 && position < visibleCards;
      
      tl.to(card, {
        x: isVisible 
          ? centerOffset + (position * cardSpacing)
          : centerOffset + (visibleCards * cardSpacing), // Hide off-screen to right
        scale: 1,
        opacity: isVisible ? 1 : 0,
        zIndex: isVisible ? visibleCards - position : 0,
        duration: 0.6,
        ease: 'power2.out'
      }, 0);
    });
    
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const newIndex = (currentIndex + 1) % totalCards;
    updateCarousel(newIndex);
  };

  const prevSlide = () => {
    const newIndex = (currentIndex - 1 + totalCards) % totalCards;
    updateCarousel(newIndex);
  };

  const handleCardClick = (attorney: Attorney) => {
    setSelectedAttorney(attorney);
    setCatalogOpen(true);
    
    // Disable body scroll
    document.body.style.overflow = 'hidden';
    
    if (isMobile) {
      // Mobile: slide in from right
      const tl = gsap.timeline();
      
      tl.fromTo(catalogRef.current,
        { x: '100%' },
        { x: '0%', duration: 0.5, ease: 'power3.out' }
      );
    } else {
      // Desktop: modal entrance animation
      const tl = gsap.timeline();
      
      // Fade in overlay
      tl.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      )
      // Scale and fade in modal
      .fromTo(catalogRef.current,
        { 
          opacity: 0,
          scale: 0.9,
          y: 50
        },
        { 
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out'
        },
        '-=0.2'
      );
    }
  };

  const closeCatalog = () => {
    if (isMobile) {
      // Mobile: slide out to right
      gsap.to(catalogRef.current, {
        x: '100%',
        duration: 0.4,
        ease: 'power3.in',
        onComplete: () => {
          setCatalogOpen(false);
          setSelectedAttorney(null);
          document.body.style.overflow = 'auto';
        }
      });
    } else {
      // Desktop: modal exit animation
      const tl = gsap.timeline();
      
      tl.to(catalogRef.current, {
        opacity: 0,
        scale: 0.95,
        y: 30,
        duration: 0.4,
        ease: 'power2.in'
      })
      .to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          setCatalogOpen(false);
          setSelectedAttorney(null);
          // Re-enable body scroll
          document.body.style.overflow = 'auto';
        }
      }, '-=0.1');
    }
  };

  const handleCardHover = (attorney: Attorney | null) => {
    setHoveredAttorney(attorney);
  };

  return (
    <section className="py-24 bg-neutral-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header - Mainletter.ru style */}
        <div className="text-center mb-16">
          <span 
            className="font-normal mb-4 block uppercase tracking-wider"
            style={{
              fontSize: '16px',
              color: '#ad866b'
            }}
          >
            Nuestro Equipo Legal
          </span>
          <h2 
            className="text-slate-800 mb-6 leading-tight"
            style={{
              fontSize: '48px',
              fontWeight: '500',
              lineHeight: '1.2',
              fontFamily: 'Minion Pro, serif'
            }}
          >
            Abogados <span style={{ color: '#ad866b', fontStyle: 'italic' }}>Especialistas</span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed font-light max-w-3xl mx-auto">
            Conozca a nuestro equipo de abogados especialistas, cada uno con décadas de experiencia 
            en sus respectivas áreas del derecho.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div 
            ref={carouselRef}
            className="relative h-[560px] overflow-hidden flex items-center justify-center"
          >
            {/* Attorney Cards */}
            {attorneys.map((attorney, index) => (
              <AttorneyCard
                key={attorney.id}
                attorney={attorney}
                index={index}
                ref={(el) => { if (el) cardsRef.current[index] = el; }}
                onHover={handleCardHover}
                onClick={handleCardClick}
                isActive={index === currentIndex}
              />
            ))}
          </div>

          {/* Navigation Buttons - Minimalist style */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm text-slate-600 hover:text-slate-800 hover:bg-white transition-all duration-200 z-10 rounded-full shadow-sm"
          >
            <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm text-slate-600 hover:text-slate-800 hover:bg-white transition-all duration-200 z-10 rounded-full shadow-sm"
          >
            <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Carousel Indicators - Minimalist style */}
          <div className="flex justify-center mt-8 space-x-3">
            {attorneys.map((_, index) => (
              <button
                key={index}
                onClick={() => updateCarousel(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? 'bg-slate-600 scale-125' 
                    : 'bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Attorney Profile - Responsive Portal */}
      {catalogOpen && mounted && createPortal(
        <>
          {/* Desktop Modal Overlay */}
          {!isMobile && (
            <div
              ref={overlayRef}
              className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
              onClick={closeCatalog}
            />
          )}
          
          {/* Attorney Content - Modal on Desktop, Full Screen Slide on Mobile */}
          <div
            ref={catalogRef}
            className={`
              fixed z-[10000] bg-white shadow-xl overflow-hidden
              ${isMobile 
                ? 'inset-0' 
                : 'inset-0 flex items-center justify-center p-4 pointer-events-none'
              }
            `}
          >
            <div 
              className={`
                ${isMobile 
                  ? 'w-full h-full' 
                  : 'bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[85vh] overflow-hidden pointer-events-auto'
                }
              `}
              onClick={(e) => !isMobile && e.stopPropagation()}
            >
              <AttorneyModal
                attorney={selectedAttorney}
                onClose={closeCatalog}
                isMobile={isMobile}
              />
            </div>
          </div>
        </>,
        document.body
      )}
    </section>
  );
}

// Attorney Card Component
interface AttorneyCardProps {
  attorney: Attorney;
  index: number;
  onHover: (attorney: Attorney | null) => void;
  onClick: (attorney: Attorney) => void;
  isActive: boolean;
}

const AttorneyCard = React.forwardRef<HTMLDivElement, AttorneyCardProps>(
  ({ attorney, index, onHover, onClick, isActive }, ref) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = () => {
      onHover(attorney);
      
      // Subtle image scale effect like mainletter.ru
      gsap.to(imageRef.current, {
        scale: 1.1,
        duration: 0.2,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      onHover(null);
      
      // Reset image scale
      gsap.to(imageRef.current, {
        scale: 1,
        duration: 0.2,
        ease: 'power2.out'
      });
    };

    return (
      <div
        ref={(el) => {
          cardRef.current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) ref.current = el;
        }}
        className="absolute w-80 h-[520px] bg-neutral-50 cursor-pointer group overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => onClick(attorney)}
        style={{ 
          minHeight: '520px',
          maxWidth: '335px'
        }}
      >
        {/* Attorney Image - Mainletter.ru style */}
        <div className="h-96 bg-stone-100 relative overflow-hidden">
          <div 
            ref={imageRef}
            className="absolute inset-0 bg-gradient-to-br from-stone-200 via-slate-200 to-stone-300 flex items-end justify-center"
            style={{ objectFit: 'contain' }}
          >
            {/* Professional placeholder with better styling */}
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-32 h-32 bg-slate-400/60 rounded-full flex items-center justify-center">
                <svg className="w-16 h-16 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Attorney Info - Mainletter.ru typography style */}
        <div className="p-6 bg-neutral-50">
          <h3 
            className="text-2xl text-slate-800 mb-2 leading-tight"
            style={{
              fontFamily: 'Minion Pro, serif',
              fontSize: '30px',
              fontWeight: '500',
              lineHeight: '1.2'
            }}
          >
            {attorney.name}
          </h3>
          
          <p 
            className="text-amber-600 font-normal mb-4 uppercase tracking-wide"
            style={{
              fontSize: '16px',
              color: '#ad866b'
            }}
          >
            {attorney.position}
          </p>
          
          {/* Minimal additional info */}
          <div className="text-sm text-slate-600 font-light">
            <p className="mb-1">{attorney.experience} años de experiencia</p>
            <p className="text-xs text-slate-500">
              {attorney.specialization[0]}
            </p>
          </div>
        </div>
      </div>
    );
  }
);

AttorneyCard.displayName = 'AttorneyCard';

// Attorney Modal Component
interface AttorneyModalProps {
  attorney: Attorney | null;
  onClose: () => void;
  isMobile?: boolean;
}

const AttorneyModal: React.FC<AttorneyModalProps> = ({ attorney, onClose, isMobile = false }) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const positionRef = useRef<HTMLParagraphElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!attorney) return;

    // Stagger entrance animations
    const tl = gsap.timeline({ delay: 0.2 });

    // Header animations
    tl.fromTo(headerRef.current,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    )
    // Avatar animation with scale
    .fromTo(avatarRef.current,
      { opacity: 0, scale: 0.8, rotation: -10 },
      { opacity: 1, scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.7)' },
      '-=0.4'
    )
    // Name appears
    .fromTo(nameRef.current,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.5'
    )
    // Position appears
    .fromTo(positionRef.current,
      { opacity: 0, x: -15 },
      { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' },
      '-=0.4'
    )
    // Details appear
    .fromTo(detailsRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      '-=0.3'
    )
    // Content sections stagger in
    .fromTo(sectionsRef.current,
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        stagger: 0.1, 
        ease: 'power2.out' 
      },
      '-=0.2'
    );
  }, [attorney]);

  if (!attorney) return null;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Sophisticated Header */}
      <div 
        ref={headerRef}
        className={`
          relative bg-gradient-to-br from-slate-50 to-stone-100 border-b border-stone-200
          ${isMobile ? 'p-4' : 'p-8'}
        `}
      >
        <button
          onClick={onClose}
          className={`
            absolute w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all duration-200 rounded-full hover:bg-white/80
            ${isMobile ? 'top-4 left-4' : 'top-6 right-6'}
          `}
        >
          {isMobile ? (
            // Back arrow for mobile
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          ) : (
            // Close X for desktop
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </button>

        {/* Attorney Profile Header */}
        <div className={`flex items-start ${isMobile ? 'space-x-4 mt-12' : 'space-x-6'}`}>
          <div 
            ref={avatarRef}
            className={`
              bg-gradient-to-br from-slate-200 to-stone-300 rounded-2xl flex items-center justify-center shadow-sm
              ${isMobile ? 'w-16 h-16' : 'w-24 h-24'}
            `}
          >
            <svg className={`text-slate-400 ${isMobile ? 'w-8 h-8' : 'w-12 h-12'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          
          <div className="flex-1">
            <h2 
              ref={nameRef}
              className={`text-slate-800 mb-2 legal-brand ${isMobile ? 'text-xl' : 'text-3xl'}`}
            >
              {attorney.name}
            </h2>
            <p 
              ref={positionRef}
              className={`mb-3 ${isMobile ? 'text-base' : 'text-lg'}`}
              style={{ color: '#B79F76', fontFamily: 'Minion Pro, serif' }}
            >
              {attorney.position}
            </p>
            <div 
              ref={detailsRef}
              className={`flex items-center ${isMobile ? 'flex-col items-start space-y-2' : 'space-x-4'}`}
            >
              <div className="flex items-center">
                <div className="w-2 h-2 bg-amber-600 rounded-full mr-2"></div>
                <span className="text-slate-600 text-sm font-medium">{attorney.experience} años de experiencia</span>
              </div>
              {attorney.isPartner && (
                <span className="bg-amber-700 text-white px-3 py-1 text-xs font-medium uppercase tracking-wider rounded-full">
                  SOCIO
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sophisticated Content */}
      <div 
        ref={contentRef}
        className="flex-1 overflow-y-auto min-h-0"
        style={{ maxHeight: 'calc(100vh - 200px)' }}
      >
        <div className={isMobile ? 'p-4' : 'p-8'}>
          <div className={`${isMobile ? 'space-y-6' : 'grid lg:grid-cols-3 gap-8'}`}>
            {/* Contact Info - Always first on mobile */}
            <div 
              ref={(el) => { if (el) sectionsRef.current[0] = el; }} 
              className={`${!isMobile && 'lg:col-span-1'} ${isMobile ? 'order-1' : ''}`}
            >
              {/* Contact */}
              <div className="bg-slate-800 text-white p-6 rounded-xl mb-6">
                <h4 className="text-lg mb-4 legal-brand text-white">
                  Información de Contacto
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">{attorney.email}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-sm">{attorney.phone}</span>
                  </div>
                </div>
              </div>

              {/* Languages - Desktop only in sidebar, mobile gets its own section */}
              {!isMobile && (
                <div>
                  <h4 className="text-xl text-slate-800 mb-4 legal-brand">
                    Idiomas
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {attorney.languages.map((lang, index) => (
                      <span
                        key={index}
                        className="bg-stone-100 text-slate-700 px-3 py-2 text-sm font-medium rounded-lg border border-stone-200"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Main Content Column */}
            <div className={`${!isMobile && 'lg:col-span-2'} space-y-8`}>
              {/* Biography */}
              <div 
                ref={(el) => { if (el) sectionsRef.current[1] = el; }}
              >
                <h4 className="text-2xl text-slate-800 mb-4 legal-brand">
                  Biografía Profesional
                </h4>
                <p className="text-slate-600 leading-relaxed font-light text-lg">
                  {attorney.bio}
                </p>
              </div>

              {/* Specializations */}
              <div 
                ref={(el) => { if (el) sectionsRef.current[2] = el; }}
              >
                <h4 className={`text-slate-800 mb-4 legal-brand ${isMobile ? 'text-xl' : 'text-2xl'}`}>
                  Áreas de Especialización
                </h4>
                <div className={`gap-4 ${isMobile ? 'space-y-3' : 'grid md:grid-cols-2'}`}>
                  {attorney.specialization.map((spec, index) => (
                    <div key={index} className="flex items-center p-3 bg-stone-50 rounded-lg border border-stone-200">
                      <div className="w-2 h-2 bg-amber-700 rounded-full mr-3 flex-shrink-0"></div>
                      <span className="text-slate-700 font-medium">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages - Mobile only */}
              {isMobile && (
                <div 
                  ref={(el) => { if (el) sectionsRef.current[6] = el; }}
                >
                  <h4 className="text-xl text-slate-800 mb-4 legal-brand">
                    Idiomas
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {attorney.languages.map((lang, index) => (
                      <span
                        key={index}
                        className="bg-stone-100 text-slate-700 px-3 py-2 text-sm font-medium rounded-lg border border-stone-200"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              <div 
                ref={(el) => { if (el) sectionsRef.current[3] = el; }}
              >
                <h4 className="text-2xl text-slate-800 mb-4 legal-brand">
                  Formación Académica
                </h4>
                <div className="space-y-4">
                  {attorney.education.map((edu, index) => (
                    <div key={index} className="border-l-4 border-amber-700 pl-6 py-2">
                      <p className="text-slate-700 font-light text-lg">{edu}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div 
                ref={(el) => { if (el) sectionsRef.current[4] = el; }}
              >
                <h4 className="text-2xl text-slate-800 mb-4 legal-brand">
                  Reconocimientos y Logros
                </h4>
                <div className="space-y-3">
                  {attorney.achievements.slice(0, 4).map((achievement, index) => (
                    <div key={index} className="flex items-start p-4 bg-stone-50 rounded-lg border border-stone-200">
                      <div className="w-1.5 h-1.5 bg-amber-700 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                      <p className="text-slate-700 font-light">{achievement}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notable Cases */}
              <div 
                ref={(el) => { if (el) sectionsRef.current[5] = el; }}
              >
                <h4 className="text-2xl text-slate-800 mb-4 legal-brand">
                  Casos Destacados
                </h4>
                <div className="space-y-4 pb-8">
                  {attorney.cases.slice(0, 3).map((case_item, index) => (
                    <div key={index} className="p-6 bg-gradient-to-br from-stone-50 to-slate-50 rounded-xl border border-stone-200 shadow-sm">
                      <p className="text-slate-700 font-light leading-relaxed">{case_item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};