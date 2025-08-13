'use client';

import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

gsap.registerPlugin(ScrollTrigger);

interface ServiceItem {
  number: string;
  title: string;
  description: string;
}

interface VerticalService {
  title: string;
  backgroundColor: string;
  icon: React.ReactNode;
}

const serviceItems: ServiceItem[] = [
  {
    number: '01',
    title: 'Protección de intereses en tribunales estatales',
    description: 'Defensa integral en todas las instancias de la federación'
  },
  {
    number: '02',
    title: 'Protección en tribunales de arbitraje',
    description: 'Marco de arbitraje comercial internacional'
  },
  {
    number: '03',
    title: 'Cobranza de deudas vencidas',
    description: 'Deudas por préstamos, transacciones de seguridad y disputas contractuales'
  },
  {
    number: '04',
    title: 'Representación en disputas inmobiliarias',
    description: 'Disputas en construcción y bienes raíces'
  },
  {
    number: '05',
    title: 'Representación en disputas corporativas',
    description: 'Conflictos empresariales y comerciales'
  },
  {
    number: '06',
    title: 'Disputas del mercado de valores',
    description: 'Representación en disputas relacionadas con el mercado de valores'
  },
  {
    number: '07',
    title: 'Protección en procedimientos de cumplimiento',
    description: 'Marco de procedimientos de aplicación'
  },
  {
    number: '08',
    title: 'Búsqueda de propiedad de deudores',
    description: 'Para ejecutar embargo por el reembolso'
  }
];

interface ServiceDetail {
  number: string;
  title: string;
  description: string;
  slug?: string; // Optional slug for navigation
}

interface VerticalServiceWithDetails extends VerticalService {
  details: ServiceDetail[];
}

const verticalServices: VerticalServiceWithDetails[] = [
  {
    title: 'Derecho Corporativo',
    backgroundColor: '#D4A574',
    icon: <Image src="/assets/svg/building.svg" alt="Derecho Corporativo" width={48} height={48} className="filter brightness-0 invert" />,
    details: [
      {
        number: '01',
        title: 'Constitución de empresas',
        description: 'Asesoría integral para la constitución de sociedades mercantiles y civiles',
        slug: 'derecho-corporativo'
      },
      {
        number: '02', 
        title: 'Fusiones y adquisiciones',
        description: 'Estructuración y ejecución de operaciones de M&A empresariales',
        slug: 'derecho-corporativo'
      },
      {
        number: '03',
        title: 'Contratos comerciales',
        description: 'Redacción y negociación de contratos mercantiles complejos',
        slug: 'derecho-corporativo'
      },
      {
        number: '04',
        title: 'Compliance corporativo',
        description: 'Implementación de programas de cumplimiento normativo',
        slug: 'derecho-corporativo'
      }
    ]
  },
  {
    title: 'Litigio Estratégico',
    backgroundColor: '#7FAAB3', 
    icon: <Image src="/assets/svg/hammer.svg" alt="Litigio Estratégico" width={48} height={48} className="filter brightness-0 invert" />,
    details: [
      {
        number: '01',
        title: 'Litigio civil y mercantil',
        description: 'Representación en controversias civiles y comerciales complejas',
        slug: 'derecho-civil'
      },
      {
        number: '02',
        title: 'Arbitraje comercial',
        description: 'Resolución de disputas mediante arbitraje nacional e internacional',
        slug: 'derecho-civil'
      },
      {
        number: '03',
        title: 'Litigio constitucional',
        description: 'Amparo y controversias constitucionales',
        slug: 'derecho-administrativo'
      },
      {
        number: '04',
        title: 'Ejecución de sentencias',
        description: 'Estrategias de cobro y ejecución de resoluciones judiciales',
        slug: 'derecho-civil'
      }
    ]
  },
  {
    title: 'Derecho Fiscal',
    backgroundColor: '#C5B299',
    icon: <Image src="/assets/svg/bank.svg" alt="Derecho Fiscal" width={48} height={48} className="filter brightness-0 invert" />,
    details: [
      {
        number: '01',
        title: 'Planeación fiscal',
        description: 'Estructuras fiscales eficientes para personas físicas y morales',
        slug: 'derecho-administrativo'
      },
      {
        number: '02',
        title: 'Defensa fiscal',
        description: 'Representación ante autoridades fiscales y tribunales',
        slug: 'derecho-administrativo'
      },
      {
        number: '03',
        title: 'Precios de transferencia',
        description: 'Estudios y defensa en materia de precios de transferencia',
        slug: 'derecho-administrativo'
      },
      {
        number: '04',
        title: 'Comercio exterior',
        description: 'Asesoría en operaciones de importación y exportación',
        slug: 'derecho-administrativo'
      }
    ]
  },
  {
    title: 'Derecho Laboral',
    backgroundColor: '#3D4A5C',
    icon: <Image src="/assets/svg/people.svg" alt="Derecho Laboral" width={48} height={48} className="filter brightness-0 invert" />,
    details: [
      {
        number: '01',
        title: 'Relaciones laborales',
        description: 'Asesoría preventiva en derecho del trabajo',
        slug: 'derecho-familiar'
      },
      {
        number: '02',
        title: 'Litigio laboral',
        description: 'Defensa en conflictos individuales y colectivos de trabajo',
        slug: 'derecho-civil'
      },
      {
        number: '03',
        title: 'Seguridad social',
        description: 'Trámites y defensa ante el IMSS, INFONAVIT y AFORE',
        slug: 'derecho-administrativo'
      },
      {
        number: '04',
        title: 'Outsourcing legal',
        description: 'Esquemas de tercerización conforme a la nueva legislación',
        slug: 'derecho-corporativo'
      }
    ]
  }
];

export default function ServicesPreview() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);
  const columnRefs = useRef<HTMLDivElement[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const selectedTitleRef = useRef<HTMLHeadingElement>(null);
  const selectedHeaderRef = useRef<HTMLDivElement>(null);
  const selectedListRef = useRef<HTMLDivElement>(null);
  const confirmationRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const [selectedForNavigation, setSelectedForNavigation] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial setup - set columns to their designed incremental widths
      columnRefs.current.forEach((column, index) => {
        if (column) {
          gsap.set(column, {
            width: `${120 + (index * 25)}px`, // Set to designed widths: 120px, 145px, 170px, 195px
            transition: 'width 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)'
          });
        }
      });

      // Animate only text elements individually when no card is selected - smooth
      if (clickedIndex === null && titleRef.current && subtitleRef.current) {
        // Title text animation - smooth fade and slide
        gsap.fromTo(titleRef.current,
          { 
            opacity: 0,
            y: 20
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
            }
          }
        );

        // Subtitle text animation - smooth slide with delay  
        gsap.fromTo(subtitleRef.current,
          { 
            opacity: 0,
            x: -20
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            delay: 0.4,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
            }
          }
        );

        // Subtle breathing effect for title only - very gentle
        gsap.to(titleRef.current, {
          scale: 1.01,
          duration: 4,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: -1,
          delay: 2
        });
      }

      // Animate selected service content when card is clicked - smooth, no jumps
      if (clickedIndex !== null && selectedTitleRef.current && selectedHeaderRef.current && selectedListRef.current) {
        // Selected title animation - smooth fade in
        gsap.fromTo(selectedTitleRef.current,
          { 
            opacity: 0,
            y: 10
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            delay: 0.1
          }
        );

        // Selected header animation - smooth slide
        gsap.fromTo(selectedHeaderRef.current,
          { 
            opacity: 0,
            x: 15
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: 'power2.out',
            delay: 0.3
          }
        );

        // Selected services list - staggered smooth entrance
        const serviceItems = selectedListRef.current.children;
        gsap.fromTo(serviceItems,
          { 
            opacity: 0,
            y: 8
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            stagger: 0.08,
            delay: 0.4
          }
        );
      }

      // No animations for cards - they appear instantly
    }, sectionRef);

    return () => ctx.revert();
  }, [clickedIndex]);

  // Handle column hover with attorney carousel-style expansion
  const handleColumnHover = (index: number | null) => {
    // Prevent animation conflicts by killing any existing animations
    gsap.killTweensOf(columnRefs.current);
    
    setHoveredIndex(index);
    
    columnRefs.current.forEach((column, i) => {
      if (!column) return;
      
      const baseWidth = 120 + (i * 25); // Original incremental width
      
      if (index === null) {
        // Return to original position and width
        gsap.to(column, {
          x: 0,
          width: `${baseWidth}px`,
          duration: 0.3,
          ease: 'power2.out'
        });
      } else if (i === index) {
        // Slide card to the left like pulling it out of wallet - KEEP THIS STATE
        gsap.to(column, {
          x: -10, // Move only 10px to the left
          width: `${baseWidth}px`, // Keep original width
          duration: 0.25,
          ease: 'power2.out'
        });
        
        // Add subtle content animations
        const overlay = column.querySelector('.column-overlay');
        const icon = column.querySelector('.column-icon');
        
        if (overlay) {
          gsap.to(overlay, {
            opacity: 0.1,
            duration: 0.2,
            ease: 'power2.out'
          });
        }
        
        if (icon) {
          gsap.to(icon, {
            scale: 1.05,
            duration: 0.25,
            ease: 'power2.out'
          });
        }
        
      } else {
        // Keep other columns in place
        gsap.to(column, {
          x: 0,
          width: `${baseWidth}px`,
          duration: 0.25,
          ease: 'power2.out'
        });
      }
    });
  };

  // Card click with smooth content transitions only
  const handleCardClick = (clickedCardIndex: number) => {
    const newClickedIndex = clickedIndex === clickedCardIndex ? null : clickedCardIndex;
    
    // If there's currently selected content, animate it out first
    if (clickedIndex !== null && newClickedIndex !== clickedIndex) {
      // Animate current content out
      if (selectedTitleRef.current && selectedHeaderRef.current && selectedListRef.current) {
        const timeline = gsap.timeline();
        
        // Fade out current content
        timeline.to([selectedTitleRef.current, selectedHeaderRef.current], {
          opacity: 0,
          y: -10,
          duration: 0.3,
          ease: 'power2.in'
        });
        
        timeline.to(selectedListRef.current.children, {
          opacity: 0,
          y: -8,
          duration: 0.2,
          stagger: 0.05,
          ease: 'power2.in'
        }, "-=0.1");
        
        // After fade out, change the index
        timeline.call(() => {
          setClickedIndex(newClickedIndex);
        });
      } else {
        setClickedIndex(newClickedIndex);
      }
    } else {
      // No current selection or same card clicked
      setClickedIndex(newClickedIndex);
    }
  };

  // Handle navigation tap with discrete confirmation for service items
  const handleServiceNavigationTap = (serviceDetail: ServiceDetail, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (!serviceDetail.slug) return; // No navigation if no slug
    
    const serviceKey = `${serviceDetail.number}-${serviceDetail.title}`;
    
    if (selectedForNavigation === serviceKey) {
      // Second tap - navigate with smooth exit animation
      const confirmationEl = confirmationRefs.current[serviceKey];
      if (confirmationEl) {
        gsap.to(confirmationEl, {
          scale: 1.1,
          opacity: 0,
          duration: 0.2,
          ease: 'power2.out',
          onComplete: () => {
            router.push(`/services/${serviceDetail.slug}`);
          }
        });
      }
    } else {
      // First tap - show discrete confirmation
      setSelectedForNavigation(serviceKey);
      
      // Animate confirmation indicator
      const confirmationEl = confirmationRefs.current[serviceKey];
      if (confirmationEl) {
        gsap.fromTo(confirmationEl, 
          { 
            scale: 0.8, 
            opacity: 0,
            y: 10 
          },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: 'back.out(1.7)'
          }
        );
      }
      
      // Auto-reset after 3 seconds if no second tap
      setTimeout(() => {
        if (selectedForNavigation === serviceKey) {
          setSelectedForNavigation(null);
          if (confirmationEl) {
            gsap.to(confirmationEl, {
              scale: 0.9,
              opacity: 0,
              y: -5,
              duration: 0.2,
              ease: 'power2.out'
            });
          }
        }
      }, 3000);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-white relative"
      onClick={(e) => {
        // Check if click is outside all cards - reset selection
        if (e.target === sectionRef.current || e.target === e.currentTarget) {
          setClickedIndex(null);
        }
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8" onClick={(e) => {
        // Allow clicks on content to reset selection too
        if (!e.target.closest('[data-service-card]')) {
          setClickedIndex(null);
        }
      }}>
        <div className="relative flex flex-col lg:flex-row h-auto lg:h-[600px] gap-8 lg:gap-0">
          {/* Mobile Title */}
          <div className="lg:hidden mb-6">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-800 leading-tight text-center">
              Nuestros Servicios
            </h2>
            <div className="flex items-center justify-center mt-4">
              <div className="flex-1 h-px bg-slate-300 max-w-20"></div>
              <ArrowRight className="w-5 h-5 text-slate-800 mx-4" />
              <div className="flex-1 h-px bg-slate-300 max-w-20"></div>
            </div>
          </div>

          {/* Left Side - Dynamic ALTUM Content - Responsive */}
          <div ref={leftContentRef} className="flex flex-1 flex-col justify-center items-center text-center lg:pr-24 lg:max-w-2xl">
            {clickedIndex === null ? (
              // Simple default content - Centered and Responsive
              <>
                <div className="space-y-6 lg:space-y-8">
                  <h2 
                    ref={titleRef}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-800 leading-tight"
                  >
                    ALTUM LEGAL
                  </h2>
                  
                  <div 
                    ref={subtitleRef}
                    className="flex items-center justify-center space-x-3 lg:space-x-4"
                  >
                    <span className="text-base lg:text-lg text-slate-800 font-medium">Seleccione un servicio</span>
                    <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 text-slate-800 animate-bounce-x" />
                  </div>
                </div>
              </>
            ) : (
              // Selected service content - Left aligned
              <div className="w-full text-left self-start">
                <div className="space-y-6">
                  <h2 
                    ref={selectedTitleRef}
                    className="text-4xl md:text-5xl font-serif font-bold text-slate-800 leading-tight"
                  >
                    {verticalServices[clickedIndex].title}
                  </h2>
                  
                  <div 
                    ref={selectedHeaderRef}
                    className="flex items-center space-x-4"
                  >
                    <span className="text-slate-800 font-medium">Más</span>
                    <div className="flex-1 h-px bg-slate-300"></div>
                    <ArrowRight className="w-5 h-5 text-slate-800" />
                    <button 
                      onClick={() => setClickedIndex(null)}
                      className="ml-4 text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Selected Service Details */}
                <div className="space-y-8 overflow-y-auto max-h-[400px] relative hide-scrollbar">
                  {/* Soft gradient overlay at the bottom for fade effect - fixed positioning */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none z-10"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, #ffffff 100%)',
                      position: 'sticky',
                      bottom: 0
                    }}
                  ></div>
                  <div ref={selectedListRef}>
                    {verticalServices[clickedIndex].details.map((service) => (
                    <div key={service.number} className="space-y-3 relative">
                      <div 
                        className="flex items-start space-x-4 cursor-pointer p-2 -m-2 rounded-lg hover:bg-slate-50 transition-colors duration-200 group"
                        onClick={(e) => handleServiceNavigationTap(service, e)}
                      >
                        <span className="text-2xl font-bold text-slate-400 mt-1 min-w-[3rem] group-hover:text-slate-600 transition-colors duration-200">
                          {service.number}
                        </span>
                        <div className="space-y-2 flex-1">
                          <h3 className="text-lg font-bold text-slate-800 group-hover:text-slate-900 transition-colors duration-200">
                            {service.title}
                          </h3>
                          <p className="text-slate-600 leading-relaxed text-sm group-hover:text-slate-700 transition-colors duration-200">
                            {service.description}
                          </p>
                        </div>
                        {service.slug && (
                          <div className="flex items-center text-slate-400 group-hover:text-slate-600 transition-colors duration-200">
                            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      {/* Discrete confirmation indicator */}
                      <div 
                        ref={(el) => {
                          const serviceKey = `${service.number}-${service.title}`;
                          confirmationRefs.current[serviceKey] = el;
                        }}
                        className={`absolute right-2 top-2 bg-slate-800 text-white text-xs px-2 py-1 rounded-full shadow-lg pointer-events-none z-20 ${
                          selectedForNavigation === `${service.number}-${service.title}` ? 'block' : 'hidden'
                        }`}
                        style={{ opacity: 0 }}
                      >
                        Tap again
                      </div>
                    </div>
                  ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Right Side - Vertical Service Columns - Responsive Layout */}
      <div ref={rightContentRef} className="lg:absolute lg:-right-10 lg:top-24 lg:h-[600px] w-full lg:w-auto">
        {/* Desktop Layout - Wallet Cards */}
        <div className="hidden lg:flex h-full items-end justify-end">
          {verticalServices.map((service, index) => (
            <div
              key={service.title}
              ref={(el) => {
                if (el) columnRefs.current[index] = el;
              }}
              data-service-card
              className="relative flex flex-col items-center justify-between text-white p-6 cursor-pointer overflow-hidden"
              style={{ 
                backgroundColor: service.backgroundColor,
                width: `${120 + (index * 25)}px`, // Incremental width: 120px, 145px, 170px, 195px (biggest on right)
                height: '600px', // Same height for all cards
                marginLeft: index > 0 ? '-20px' : '0', // More overlap like wallet cards
                zIndex: index + 1, // Higher z-index for bigger cards (right side)
                borderRadius: '0',
                alignSelf: 'flex-end', // Align to bottom
                filter: clickedIndex === null ? 'brightness(1.1) saturate(1.05)' : (clickedIndex === index ? 'brightness(1.3) saturate(1.4)' : 'brightness(0.8)'),
                transition: 'filter 0.3s ease-in-out'
              }}
              onMouseEnter={() => handleColumnHover(index)}
              onMouseLeave={() => handleColumnHover(null)}
              onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling to section
                handleCardClick(index);
              }}
            >
              {/* Service Title - Vertical Text at Top Left Inverted */}
              <div className="absolute left-4 top-8">
                <h3 
                  className="column-title text-2xl font-bold text-white leading-none whitespace-nowrap transition-transform duration-300"
                  style={{ 
                    writingMode: 'vertical-lr',
                    textOrientation: 'mixed',
                    transform: 'rotate(0deg)',
                    letterSpacing: '-0.5px',
                    fontFamily: 'Minion Pro, serif'
                  }}
                >
                  {service.title}
                </h3>
              </div>
              
              {/* Icon at left */}
              <div className="column-icon absolute bottom-8 left-4 transition-transform duration-300">
                {service.icon}
              </div>

              {/* Hover overlay */}
              <div className="column-overlay absolute inset-0 bg-black opacity-0 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Mobile Layout - Dropdown Style Cards */}
        <div className="flex lg:hidden flex-col order-first lg:order-last w-full">
          {verticalServices.map((service, index) => (
            <div
              key={service.title}
              data-service-card
              className="relative cursor-pointer overflow-hidden transition-all duration-300 w-full"
              style={{
                backgroundColor: service.backgroundColor,
                filter: clickedIndex === null ? 'brightness(1.1) saturate(1.05)' : (clickedIndex === index ? 'brightness(1.3) saturate(1.4)' : 'brightness(0.8)'),
                transition: 'filter 0.3s ease-in-out, height 0.3s ease-in-out',
                height: clickedIndex === index 
                  ? 'auto' 
                  : '80px', // Same height for all cards - wider
                width: '100vw', // Full viewport width
                marginLeft: 'calc(-50vw + 50%)', // Center and extend to full width
                marginRight: 'calc(-50vw + 50%)'
              }}
              onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling to section
                handleCardClick(index);
              }}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between px-6 py-4">
                <div className="flex-1">
                  <h3 
                    className="text-lg font-bold leading-tight"
                    style={{
                      color: (service.backgroundColor === '#C5B299' || service.backgroundColor === '#D4A574') ? 'rgba(0,0,0,0.95)' : '#ffffff'
                    }}
                  >
                    {service.title}
                  </h3>
                </div>
                <div className="flex items-center space-x-3 ml-4">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 relative">
                      {React.cloneElement(service.icon as React.ReactElement, {
                        width: 24,
                        height: 24,
                        className: "filter brightness-0 invert"
                      })}
                    </div>
                  </div>
                  <div>
                    <ArrowRight 
                      className={`w-4 h-4 transition-transform duration-300 ${
                        clickedIndex === index ? 'rotate-90' : 'rotate-0'
                      }`}
                      style={{ color: service.backgroundColor === '#8B7D5B' ? 'rgba(0,0,0,0.8)' : '#ffffff' }}
                    />
                  </div>
                </div>
              </div>

              {/* Expandable Content */}
              <div 
                className={`relative overflow-hidden transition-all duration-500 ease-in-out ${
                  clickedIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div 
                  className="px-6 pb-8 space-y-3 relative"
                  style={{
                    borderTop: `1px solid ${service.backgroundColor === '#B8956F' ? 'rgba(255,255,255,0.3)' : 
                                           service.backgroundColor === '#5B8AAE' ? 'rgba(255,255,255,0.4)' : 
                                           service.backgroundColor === '#A89B7A' ? 'rgba(255,255,255,0.3)' : 
                                           'rgba(255,255,255,0.5)'}`
                  }}
                >
                  {/* Soft gradient overlay at the bottom - fixed positioning for scroll */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-10"
                    style={{
                      background: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.05) 30%, ${service.backgroundColor} 100%)`,
                      position: 'sticky',
                      bottom: 0
                    }}
                  ></div>
                  {service.details.map((detail, detailIndex) => (
                    <div key={detail.number} className="pt-3 first:pt-4 relative">
                      <div 
                        className="flex items-start space-x-3 cursor-pointer p-2 -m-2 rounded-lg hover:bg-black hover:bg-opacity-10 transition-colors duration-200 group"
                        onClick={(e) => handleServiceNavigationTap(detail, e)}
                      >
                        <span 
                          className="font-bold text-sm min-w-[2rem] group-hover:opacity-80 transition-opacity duration-200"
                          style={{
                            color: (service.backgroundColor === '#C5B299' || service.backgroundColor === '#D4A574') ? 'rgba(0,0,0,0.8)' : '#ffffff'
                          }}
                        >
                          {detail.number}
                        </span>
                        <div className="space-y-1 flex-1">
                          <h4 
                            className="font-medium text-sm group-hover:opacity-90 transition-opacity duration-200"
                            style={{
                              color: (service.backgroundColor === '#C5B299' || service.backgroundColor === '#D4A574') ? 'rgba(0,0,0,0.95)' : '#ffffff'
                            }}
                          >
                            {detail.title}
                          </h4>
                          <p 
                            className="text-xs leading-relaxed group-hover:opacity-80 transition-opacity duration-200"
                            style={{
                              color: (service.backgroundColor === '#C5B299' || service.backgroundColor === '#D4A574') ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.95)'
                            }}
                          >
                            {detail.description}
                          </p>
                        </div>
                        {detail.slug && (
                          <div className="flex items-center group-hover:opacity-70 transition-opacity duration-200">
                            <svg 
                              className="w-3 h-3 transform group-hover:translate-x-1 transition-transform duration-200" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                              style={{
                                color: (service.backgroundColor === '#C5B299' || service.backgroundColor === '#D4A574') ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)'
                              }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      {/* Mobile confirmation indicator */}
                      <div 
                        ref={(el) => {
                          const serviceKey = `${detail.number}-${detail.title}`;
                          confirmationRefs.current[serviceKey] = el;
                        }}
                        className={`absolute right-2 top-2 bg-white text-slate-800 text-xs px-2 py-1 rounded-full shadow-lg pointer-events-none z-20 ${
                          selectedForNavigation === `${detail.number}-${detail.title}` ? 'block' : 'hidden'
                        }`}
                        style={{ opacity: 0 }}
                      >
                        Tap again
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}