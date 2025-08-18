'use client';

import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

gsap.registerPlugin(ScrollTrigger);

interface ServiceItem {
  title: string;
  description: string;
}

interface VerticalService {
  id: string;
  title: string;
  backgroundColor: string;
  icon: React.ReactNode;
  shortDescription: string;
  description: string;
  iconUrl?: string;
  order: number;
  isActive: boolean;
}

interface ServiceDetail {
  title: string;
  description: string;
  slug?: string; // Optional slug for navigation
}

interface VerticalServiceWithDetails extends VerticalService {
  details: ServiceDetail[];
}

// Old money color palette for service cards
const defaultColors = [
  '#B79F76', // Classic Gold
  '#8B7D5B', // Dark Sage
  '#A89B7A', // Light Sage
  '#6B5B3A', // Deep Bronze
  '#C5B299', // Warm Beige
  '#D4A574'  // Light Gold
];

// Service items for initial content (can be generated from description)
const generateServiceItems = (description: string): ServiceItem[] => {
  // Split description into sentences and create items
  const sentences = description.split('.').filter(s => s.trim().length > 20);
  return sentences.slice(0, 8).map((sentence, index) => ({
    title: sentence.trim().split(',')[0], // Use first part before comma as title
    description: sentence.trim()
  }));
};

// Function to convert service title to slug
const getServiceSlug = (title: string): string => {
  const slugMap: { [key: string]: string } = {
    'Derecho Administrativo': 'derecho-administrativo',
    'Derecho Notarial': 'derecho-notarial',
    'Derecho Corporativo': 'derecho-corporativo',
    'Derecho Familiar': 'derecho-familiar',
    'Derecho Civil': 'derecho-civil'
  };
  return slugMap[title] || title.toLowerCase().replace(/\s+/g, '-');
};

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
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [services, setServices] = useState<VerticalServiceWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Detect touch device
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/services?active=true');
      const data = await response.json();
      
      if (data.success && data.data) {
        // Transform API data to component format
        const transformedServices: VerticalServiceWithDetails[] = data.data.map((service: any, index: number) => ({
          id: service.id,
          title: service.name,
          backgroundColor: defaultColors[index % defaultColors.length],
          icon: service.iconUrl ? (
            <Image 
              src={service.iconUrl} 
              alt={service.name} 
              width={40} 
              height={40} 
              className="filter brightness-0 invert" 
            />
          ) : (
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">{service.name.charAt(0)}</span>
            </div>
          ),
          shortDescription: service.shortDescription,
          description: service.description,
          iconUrl: service.iconUrl,
          order: service.order,
          isActive: service.isActive,
          details: generateServiceItems(service.description).map((item, idx) => ({
            ...item,
            slug: getServiceSlug(service.name)
          }))
        }));

        // Sort by order
        const sortedServices = transformedServices.sort((a, b) => a.order - b.order);
        setServices(sortedServices);
      } else {
        setError('Error al cargar servicios');
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Error al cargar servicios');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial setup - set all columns to same width
      columnRefs.current.forEach((column, index) => {
        if (column) {
          gsap.set(column, {
            width: '120px', // Same width for all cards
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

  // Touch handling functions for preventing accidental clicks
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setTouchEnd(null);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    setTouchEnd({ x: touch.clientX, y: touch.clientY });
  };

  // Check if movement was intentional tap vs scroll
  const isIntentionalTap = (): boolean => {
    if (!touchStart || !touchEnd) return false;
    
    const deltaX = Math.abs(touchEnd.x - touchStart.x);
    const deltaY = Math.abs(touchEnd.y - touchStart.y);
    const totalMovement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Allow up to 10px of movement for intentional tap
    return totalMovement < 10;
  };

  // Smart navigation handler
  const handleSmartNavigation = (slug: string, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // For touch devices, check if it was intentional tap
    if (isTouchDevice && !isIntentionalTap()) {
      return; // Ignore accidental touches during scroll
    }
    
    // Add small delay for touch devices to feel more intentional
    const navigationDelay = isTouchDevice ? 100 : 0;
    
    setTimeout(() => {
      router.push(`/services/${slug}`);
    }, navigationDelay);
  };

  // Handle column hover with attorney carousel-style expansion
  const handleColumnHover = (index: number | null) => {
    // Prevent animation conflicts by killing any existing animations
    gsap.killTweensOf(columnRefs.current);
    
    setHoveredIndex(index);
    
    columnRefs.current.forEach((column, i) => {
      if (!column) return;
      
      const baseWidth = 120; // Same width for all cards
      
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
    
    const serviceKey = serviceDetail.title;
    
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
      className="py-24 bg-white relative overflow-hidden"
      onClick={(e) => {
        // Check if click is outside all cards - reset selection
        if (e.target === sectionRef.current || e.target === e.currentTarget) {
          setClickedIndex(null);
        }
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8" onClick={(e) => {
        // Allow clicks on content to reset selection too
        if (!(e.target as HTMLElement).closest('[data-service-card]')) {
          setClickedIndex(null);
        }
      }}>
        <div className="relative flex flex-col lg:flex-row h-auto lg:h-[550px] gap-6 sm:gap-8 lg:gap-0">
          {/* Mobile Title */}
          <div className="lg:hidden mb-8 sm:mb-12">
            <h2 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl font-serif font-bold text-slate-800 leading-tight text-center px-4">
              Nuestros Servicios
            </h2>
            <div className="flex items-center justify-center mt-4">
              <div className="flex-1 h-px bg-slate-300 max-w-16 sm:max-w-20"></div>
              <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 text-slate-800 mx-3 sm:mx-4" />
              <div className="flex-1 h-px bg-slate-300 max-w-16 sm:max-w-20"></div>
            </div>
          </div>

          {/* Left Side - Dynamic ALTUM Content - Responsive */}
          <div ref={leftContentRef} className="flex flex-1 flex-col justify-center items-center text-center lg:pr-16 xl:pr-24 lg:max-w-2xl xl:max-w-3xl bg-white">
            {clickedIndex === null ? (
              // Simple default content - Centered and Responsive
              <>
                <div className="space-y-4 sm:space-y-6 lg:space-y-8 mb-8 sm:mb-12 lg:mb-0 px-4 lg:px-0">
                  <h2 
                    ref={titleRef}
                    className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-slate-800 leading-tight"
                  >
                    ALTUM LEGAL
                  </h2>
                  
                  <div 
                    ref={subtitleRef}
                    className="flex items-center justify-center space-x-2 sm:space-x-3 lg:space-x-4"
                  >
                    <span className="text-sm sm:text-base lg:text-lg text-slate-800 font-medium">Seleccione un servicio</span>
                    <ArrowRight className="w-3 sm:w-4 lg:w-5 h-3 sm:h-4 lg:h-5 text-slate-800 animate-bounce-x" />
                  </div>
                </div>
              </>
            ) : (
              // Selected service content - Left aligned
              <div className="w-full text-left self-start px-4 lg:px-0 bg-white min-h-[400px]">
                <div className="space-y-4 sm:space-y-6">
                  {/* Clickeable Header - Smart for desktop/tablet */}
                  {(!isTouchDevice || (typeof window !== 'undefined' && window.innerWidth > 768)) ? (
                    <div
                      className="cursor-pointer group"
                      onTouchStart={handleTouchStart}
                      onTouchEnd={handleTouchEnd}
                      onClick={(e) => handleSmartNavigation(getServiceSlug(services[clickedIndex].title), e)}
                    >
                      <h2 
                        ref={selectedTitleRef}
                        className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl font-serif font-bold text-slate-800 leading-tight group-hover:text-[#B79F76] transition-colors duration-300 flex items-start gap-2 sm:gap-3"
                      >
                        <span className="flex-1 min-w-0">{services[clickedIndex].title}</span>
                        <svg className="w-5 sm:w-6 h-5 sm:h-6 text-[#B79F76] opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </h2>
                    </div>
                  ) : (
                    <h2 
                      ref={selectedTitleRef}
                      className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl font-serif font-bold text-slate-800 leading-tight"
                    >
                      {services[clickedIndex].title}
                    </h2>
                  )}
                  
                  <div 
                    ref={selectedHeaderRef}
                    className="flex items-center space-x-3 sm:space-x-4"
                  >
                    <span className="text-slate-800 font-medium text-sm sm:text-base">Más</span>
                    <div className="flex-1 h-px bg-slate-300"></div>
                    <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 text-slate-800" />
                    <button 
                      onClick={() => setClickedIndex(null)}
                      className="ml-2 sm:ml-4 text-slate-500 hover:text-slate-800 transition-colors p-1"
                    >
                      <span className="text-lg">✕</span>
                    </button>
                  </div>
                </div>

                {/* Selected Service Details */}
                <div className="space-y-6 sm:space-y-8 overflow-y-auto max-h-[300px] sm:max-h-[400px] relative hide-scrollbar">
                  {/* Soft gradient overlay at the bottom for fade effect - fixed positioning */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 pointer-events-none z-10"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, #ffffff 100%)',
                      position: 'sticky',
                      bottom: 0
                    }}
                  ></div>
                  <div ref={selectedListRef}>
                    {services[clickedIndex].details.map((service) => (
                    <div key={service.title} className="space-y-2 sm:space-y-3 relative">
                      <div 
                        className="flex items-start space-x-2 sm:space-x-3 cursor-pointer p-2 -m-2 rounded-lg hover:bg-slate-50 transition-colors duration-200 group"
                        onClick={(e) => handleServiceNavigationTap(service, e)}
                      >
                        <div className="w-3 h-3 bg-slate-400 rounded-full mt-2 min-w-[0.75rem] group-hover:bg-slate-600 transition-colors duration-200 flex-shrink-0"></div>
                        <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-bold text-slate-800 group-hover:text-slate-900 transition-colors duration-200 leading-tight">
                            {service.title}
                          </h3>
                          <p className="text-slate-600 leading-relaxed text-xs sm:text-sm group-hover:text-slate-700 transition-colors duration-200">
                            {service.description}
                          </p>
                        </div>
                        {service.slug && (
                          <div className="flex items-center text-slate-400 group-hover:text-slate-600 transition-colors duration-200 flex-shrink-0">
                            <svg className="w-3 sm:w-4 h-3 sm:h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      {/* Discrete confirmation indicator */}
                      <div 
                        ref={(el) => {
                          const serviceKey = service.title;
                          confirmationRefs.current[serviceKey] = el;
                        }}
                        className={`absolute right-2 top-2 bg-slate-800 text-white text-xs px-2 py-1 rounded-full shadow-lg pointer-events-none z-20 ${
                          selectedForNavigation === service.title ? 'block' : 'hidden'
                        }`}
                        style={{ opacity: 0 }}
                      >
                        Tap again
                      </div>
                    </div>
                  ))}
                  </div>
                  
                  {/* Main Action Button */}
                  <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-200">
                    <button
                      onTouchStart={handleTouchStart}
                      onTouchEnd={handleTouchEnd}
                      onClick={(e) => handleSmartNavigation(getServiceSlug(services[clickedIndex].title), e)}
                      className="w-full bg-gradient-to-r from-[#B79F76] to-[#D4A574] text-white px-6 sm:px-8 py-3 sm:py-4 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#B79F76]/25 transform hover:scale-[1.02] active:scale-[0.98] rounded-lg group flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
                      style={{ minHeight: '44px' }} // Minimum touch target size
                    >
                      <span className="truncate">Ver Información Completa</span>
                      <svg className="w-4 sm:w-5 h-4 sm:h-5 transition-transform duration-300 group-hover:translate-x-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Right Side - Vertical Service Columns - Responsive Layout */}
      <div ref={rightContentRef} className="lg:absolute lg:right-0 lg:top-16 xl:top-24 lg:h-[500px] xl:h-[550px] w-full lg:w-auto">
        {/* Desktop Layout - Wallet Cards */}
        <div className="hidden lg:flex h-full items-end justify-end overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center w-full h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center w-full h-full text-center">
              <div>
                <p className="text-slate-600 mb-4">{error}</p>
                <button
                  onClick={fetchServices}
                  className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            </div>
          ) : services.length === 0 ? (
            <div className="flex items-center justify-center w-full h-full">
              <p className="text-slate-600">No hay servicios disponibles</p>
            </div>
          ) : (
            [
              // Add "Ver más servicios" card FIRST if there are more than 5 services
              ...(services.length > 5 ? [
                <div
                  key="more-services"
                  ref={(el) => {
                    if (el) columnRefs.current[0] = el;
                  }}
                  data-service-card
                  className="relative flex flex-col items-center justify-center text-white p-4 lg:p-5 xl:p-6 cursor-pointer overflow-hidden w-[100px] h-[500px] lg:w-[100px] lg:h-[500px] xl:w-[120px] xl:h-[550px]"
                  style={{ 
                    backgroundColor: '#8B7D5B',
                    marginLeft: '0px',
                    zIndex: 1,
                    borderRadius: '0',
                    alignSelf: 'flex-end',
                    filter: 'brightness(1.1) saturate(1.05)',
                    transition: 'filter 0.3s ease-in-out'
                  }}
                  onMouseEnter={() => {}}
                  onMouseLeave={() => {}}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push('/services');
                  }}
                >
                  {/* "Ver más servicios" text - vertical */}
                  <div className="absolute left-3 lg:left-4 top-6 lg:top-8">
                    <h3 
                      className="text-sm lg:text-base xl:text-lg font-bold text-white leading-none whitespace-nowrap"
                      style={{ 
                        writingMode: 'vertical-lr',
                        textOrientation: 'mixed',
                        transform: 'rotate(0deg)',
                        letterSpacing: '-0.5px',
                        fontFamily: 'Minion Pro, serif'
                      }}
                    >
                      Ver más servicios
                    </h3>
                  </div>
                  
                  {/* Arrow icon */}
                  <div className="absolute bottom-6 lg:bottom-8 left-3 lg:left-4">
                    <div className="w-8 lg:w-9 xl:w-10 h-8 lg:h-9 xl:h-10 flex items-center justify-center">
                      <svg 
                        className="w-6 h-6 text-white" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300"></div>
                </div>
              ] : []),
              // Then show the first 4 services (or all if <= 5)
              ...services.slice(0, services.length > 5 ? 4 : 5).map((service, index) => {
                const actualIndex = services.length > 5 ? index + 1 : index;
                return (
            <div
              key={service.id}
              ref={(el) => {
                if (el) columnRefs.current[actualIndex] = el;
              }}
              data-service-card
              className="relative flex flex-col items-center justify-between text-white p-4 lg:p-5 xl:p-6 cursor-pointer overflow-hidden w-[100px] h-[500px] lg:w-[100px] lg:h-[500px] xl:w-[120px] xl:h-[550px]"
              style={{ 
                backgroundColor: service.backgroundColor,
                marginLeft: actualIndex > 0 ? '-8px' : '0', // Reduced overlap to prevent excessive overlapping
                zIndex: actualIndex + 1,
                borderRadius: '0',
                alignSelf: 'flex-end',
                filter: clickedIndex === null ? 'brightness(1.1) saturate(1.05)' : (clickedIndex === index ? 'brightness(1.3) saturate(1.4)' : 'brightness(0.8)'),
                transition: 'filter 0.3s ease-in-out'
              }}
              onMouseEnter={() => handleColumnHover(index)}
              onMouseLeave={() => handleColumnHover(null)}
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick(index);
              }}
            >
              {/* Service Title - Vertical Text at Top Left Inverted */}
              <div className="absolute left-3 lg:left-4 top-6 lg:top-8">
                <h3 
                  className="column-title text-lg lg:text-xl xl:text-2xl font-bold text-white leading-none whitespace-nowrap transition-transform duration-300"
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
              <div className="column-icon absolute bottom-6 lg:bottom-8 left-3 lg:left-4 transition-transform duration-300">
                <div className="w-8 lg:w-9 xl:w-10 h-8 lg:h-9 xl:h-10">
                  {service.icon}
                </div>
              </div>

              {/* Hover overlay */}
              <div className="column-overlay absolute inset-0 bg-black opacity-0 transition-opacity duration-300 pointer-events-none"></div>
            </div>
              )
          })
        ]
          )}
        </div>

        {/* Mobile Layout - Dropdown Style Cards */}
        <div className="flex lg:hidden flex-col order-first lg:order-last w-full gap-1 sm:gap-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700 mx-auto mb-4"></div>
                <p className="text-slate-600">Cargando servicios...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <p className="text-slate-600 mb-4">{error}</p>
                <button
                  onClick={fetchServices}
                  className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            </div>
          ) : services.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-slate-600">No hay servicios disponibles</p>
            </div>
          ) : (
            [
              // Add "Ver más servicios" card FIRST for mobile if there are more than 5 services
              ...(services.length > 5 ? [
                <div
                  key="more-services-mobile"
                  data-service-card
                  className="relative cursor-pointer overflow-hidden transition-all duration-300 w-full"
                  style={{
                    backgroundColor: '#8B7D5B',
                    filter: 'brightness(1.1) saturate(1.05)',
                    transition: 'filter 0.3s ease-in-out, height 0.3s ease-in-out',
                    height: '120px'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push('/services');
                  }}
                >
                  <div className="h-full flex items-center justify-between p-4 sm:p-6">
                    {/* Left side - Text */}
                    <div className="flex-1">
                      <h3 className="text-white text-lg sm:text-xl font-bold mb-2">
                        Ver más servicios
                      </h3>
                      <p className="text-white/80 text-sm">
                        Explora todos nuestros {services.length} servicios
                      </p>
                    </div>
                    
                    {/* Right side - Arrow */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20">
                      <svg 
                        className="w-6 h-6 text-white" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ] : []),
              // Then show the first 4 services (or all if <= 5)
              ...services.slice(0, services.length > 5 ? 4 : 5).map((service, index) => (
            <div
              key={service.id}
              data-service-card
              className="relative cursor-pointer overflow-hidden transition-all duration-300 w-full"
              style={{
                backgroundColor: service.backgroundColor,
                filter: clickedIndex === null ? 'brightness(1.1) saturate(1.05)' : (clickedIndex === index ? 'brightness(1.3) saturate(1.4)' : 'brightness(0.8)'),
                transition: 'filter 0.3s ease-in-out, height 0.3s ease-in-out',
                height: clickedIndex === index 
                  ? 'auto' 
                  : '70px' // Reduced height for mobile
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick(index);
              }}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex-1 min-w-0">
                  <h3 
                    className="text-base sm:text-lg font-bold leading-tight truncate"
                    style={{
                      color: (service.backgroundColor === '#C5B299' || service.backgroundColor === '#D4A574') ? 'rgba(0,0,0,0.95)' : '#ffffff'
                    }}
                  >
                    {service.title}
                  </h3>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 ml-3 sm:ml-4 flex-shrink-0">
                  <div className="flex-shrink-0">
                    <div className="w-5 sm:w-6 h-5 sm:h-6 relative filter brightness-0 invert">
                      {service.icon}
                    </div>
                  </div>
                  <div>
                    <ArrowRight 
                      className={`w-3 sm:w-4 h-3 sm:h-4 transition-transform duration-300 ${
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
                  clickedIndex === index ? 'max-h-[400px] sm:max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div 
                  className="px-4 sm:px-6 pt-3 sm:pt-4 pb-4 sm:pb-6 relative"
                  style={{
                    borderTop: `1px solid ${service.backgroundColor === '#B8956F' ? 'rgba(255,255,255,0.3)' : 
                                           service.backgroundColor === '#5B8AAE' ? 'rgba(255,255,255,0.4)' : 
                                           service.backgroundColor === '#A89B7A' ? 'rgba(255,255,255,0.3)' : 
                                           'rgba(255,255,255,0.5)'}`
                  }}
                >
                  {/* Left bar indicator for expanded content */}
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-1"
                    style={{
                      backgroundColor: (service.backgroundColor === '#C5B299' || service.backgroundColor === '#D4A574') 
                        ? 'rgba(0,0,0,0.2)' 
                        : 'rgba(255,255,255,0.3)'
                    }}
                  />
                  {service.details.map((detail, detailIndex) => (
                    <div key={detail.title} className="relative mb-1.5 sm:mb-2">
                      <div 
                        className="flex items-start space-x-2 cursor-pointer p-1.5 sm:p-2 -m-1.5 sm:-m-2 rounded-lg transition-colors duration-200 group"
                        onClick={(e) => handleServiceNavigationTap(detail, e)}
                      >
                        <div 
                          className="w-2 h-2 rounded-full min-w-[0.5rem] sm:min-w-[0.5rem] group-hover:scale-110 transition-all duration-200 flex-shrink-0 mt-1"
                          style={{
                            backgroundColor: (service.backgroundColor === '#C5B299' || service.backgroundColor === '#D4A574') ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.6)'
                          }}
                        ></div>
                        <div className="space-y-0.5 sm:space-y-1 flex-1 min-w-0">
                          <h4 
                            className="font-medium text-xs sm:text-sm group-hover:font-semibold transition-all duration-200 leading-tight"
                            style={{
                              color: (service.backgroundColor === '#C5B299' || service.backgroundColor === '#D4A574') ? 'rgba(0,0,0,0.95)' : '#ffffff'
                            }}
                          >
                            {detail.title}
                          </h4>
                          <p 
                            className="text-xs leading-relaxed group-hover:text-opacity-90 transition-all duration-200"
                            style={{
                              color: (service.backgroundColor === '#C5B299' || service.backgroundColor === '#D4A574') ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.95)'
                            }}
                          >
                            {detail.description}
                          </p>
                        </div>
                        {detail.slug && (
                          <div className="flex items-center group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
                            <svg 
                              className="w-2.5 sm:w-3 h-2.5 sm:h-3 transform group-hover:translate-x-1 transition-transform duration-200" 
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
                          const serviceKey = detail.title;
                          confirmationRefs.current[serviceKey] = el;
                        }}
                        className={`absolute right-1.5 sm:right-2 top-1.5 sm:top-2 bg-white text-slate-800 text-xs px-2 py-1 rounded-full shadow-lg pointer-events-none z-20 ${
                          selectedForNavigation === detail.title ? 'block' : 'hidden'
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
          ))
        ]
          )}
        </div>
      </div>

    </section>
  );
}