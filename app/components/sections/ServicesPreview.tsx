'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DollarSign, Gavel, Calculator, Building, Users, ArrowRight, Briefcase, Scale } from 'lucide-react';

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

const verticalServices: VerticalService[] = [
  {
    title: 'Bankruptcy',
    backgroundColor: '#B8956F',
    icon: <DollarSign className="w-12 h-12 text-white" />
  },
  {
    title: 'Criminal legal protection of business',
    backgroundColor: '#5B8AAE', 
    icon: <Gavel className="w-12 h-12 text-white" />
  },
  {
    title: 'Taxes',
    backgroundColor: '#A89B7A',
    icon: <Calculator className="w-12 h-12 text-white" />
  },
  {
    title: 'Outsourcing',
    backgroundColor: '#3D4A5C',
    icon: <Briefcase className="w-12 h-12 text-white" />
  }
];

export default function ServicesPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);
  const columnRefs = useRef<HTMLDivElement[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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

      // Entrance animations
      gsap.fromTo(leftContentRef.current,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      );

      gsap.fromTo(rightContentRef.current,
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      );

      // Staggered column entrance
      gsap.fromTo(columnRefs.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: rightContentRef.current,
            start: 'top 85%',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-white relative"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative flex h-[600px]">
          {/* Left Side - Settlement of Disputes */}
          <div ref={leftContentRef} className="flex-1 space-y-8 pr-8">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-800 leading-tight">
                Solución integral de
                <span className="block text-slate-800">disputas legales</span>
              </h2>
              
              <div className="flex items-center space-x-4">
                <span className="text-slate-800 font-medium">Más</span>
                <div className="flex-1 h-px bg-slate-300"></div>
                <ArrowRight className="w-5 h-5 text-slate-800" />
              </div>
            </div>

            {/* Numbered Services List */}
            <div className="space-y-8 overflow-y-auto max-h-[400px]">
              {serviceItems.map((service) => (
                <div key={service.number} className="space-y-3">
                  <div className="flex items-start space-x-4">
                    <span className="text-2xl font-bold text-slate-400 mt-1 min-w-[3rem]">
                      {service.number}
                    </span>
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-slate-800">
                        {service.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed text-sm">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Vertical Service Columns - Independent positioning outside container */}
      <div ref={rightContentRef} className="absolute -right-10 top-24 h-[600px]">
        <div className="flex h-full items-end justify-end">
          {verticalServices.map((service, index) => (
            <div
              key={service.title}
              ref={(el) => {
                if (el) columnRefs.current[index] = el;
              }}
              className="relative flex flex-col items-center justify-between text-white p-6 cursor-pointer overflow-hidden"
              style={{ 
                backgroundColor: service.backgroundColor,
                width: `${120 + (index * 25)}px`, // Incremental width: 120px, 145px, 170px, 195px (biggest on right)
                height: '600px', // Same height for all cards
                marginLeft: index > 0 ? '-20px' : '0', // More overlap like wallet cards
                zIndex: index + 1, // Higher z-index for bigger cards (right side)
                borderRadius: '0',
                alignSelf: 'flex-end' // Align to bottom
              }}
              onMouseEnter={() => handleColumnHover(index)}
              onMouseLeave={() => handleColumnHover(null)}
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
      </div>
    </section>
  );
}