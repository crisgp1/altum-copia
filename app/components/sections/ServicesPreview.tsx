'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Service {
  title: string;
  description: string;
  icon: JSX.Element;
}

const services: Service[] = [
  {
    title: 'Derecho Corporativo',
    description: 'Asesoramiento integral para empresas, fusiones, adquisiciones y estructuración corporativa.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  },
  {
    title: 'Litigios Complejos',
    description: 'Representación especializada en casos de alta complejidad y gran envergadura.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16l-3-9m3 9l3-9" />
      </svg>
    )
  },
  {
    title: 'Derecho Fiscal',
    description: 'Estrategias fiscales, planificación tributaria y defensa ante autoridades fiscales.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    title: 'Propiedad Intelectual',
    description: 'Protección y registro de marcas, patentes y derechos de autor.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  }
];

export default function ServicesPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      );

      gsap.fromTo(cardsRef.current,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-white"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16">
          <div className="max-w-3xl">
            <span className="text-amber-700 font-medium text-sm uppercase tracking-wider mb-4 block">
              Especialidades Jurídicas
            </span>
            <h2
              ref={titleRef}
              className="text-4xl md:text-5xl font-serif font-bold text-slate-800 mb-6 leading-tight"
            >
              Áreas de <span className="text-amber-700 italic">Especialización</span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed font-light">
              Ofrecemos servicios jurídicos especializados con la más alta calidad 
              y dedicación para proteger sus intereses legales y patrimoniales.
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={service.title}
              ref={(el) => { if (el) cardsRef.current[index] = el; }}
              className="group bg-gradient-to-br from-stone-50 to-slate-50 border border-stone-200 hover:border-amber-200 transition-all duration-500 relative overflow-hidden"
            >
              {/* Decorative element */}
              <div className="absolute top-4 right-4 w-16 h-16 bg-amber-100 rounded-full opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              
              <div className="p-8 relative z-10">
                <div className="mb-6">
                  <div className="w-14 h-14 bg-slate-800 text-white flex items-center justify-center group-hover:bg-amber-700 transition-colors duration-300">
                    {service.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-serif font-bold text-slate-800 mb-4 group-hover:text-amber-700 transition-colors duration-300">
                  {service.title}
                </h3>
                
                <p className="text-slate-600 leading-relaxed mb-6 font-light">
                  {service.description}
                </p>
                
                <button className="text-slate-800 font-medium group-hover:text-amber-700 transition-colors duration-200 flex items-center group">
                  <span>Más información</span>
                  <svg 
                    className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-slate-600 mb-6 font-light">
            ¿Necesita asesoría en otra área del derecho?
          </p>
          <button className="bg-slate-800 text-white px-8 py-4 font-medium hover:bg-slate-700 transition-all duration-300 inline-flex items-center">
            <span>Ver Todos los Servicios</span>
            <svg 
              className="ml-2 w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}