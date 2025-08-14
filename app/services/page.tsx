'use client';

import Navbar from '@/app/components/navigation/Navbar';
import Footer from '@/app/components/sections/Footer';
import ServiceCard from '@/app/lib/presentation/components/services/ServiceCard';
import ServiceCardSimple from '@/app/lib/presentation/components/services/ServiceCardSimple';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    category: 'DERECHO ADMINISTRATIVO',
    description: 'Especialistas en trámites y procedimientos ante autoridades administrativas.',
    services: [
      'Licencias y permisos municipales',
      'Transparencia',
      'Impugnaciones de multas',
      'Juicios de nulidad',
      'Juicios de créditos fiscales'
    ],
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  },
  {
    category: 'DERECHO NOTARIAL',
    description: 'Servicios notariales especializados para la seguridad jurídica de sus actos.',
    services: [
      'Escrituración de compraventas, donaciones, permuta',
      'Cancelaciones de gravámenes',
      'Sucesiones',
      'Cartas notariales para viaje con menores',
      'Ratificaciones de firmas'
    ],
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    category: 'DERECHO CORPORATIVO',
    description: 'Asesoría integral para empresas y sociedades mercantiles.',
    services: [
      'Constitución de sociedades mercantiles y civiles',
      'Actas de asambleas',
      'Estrategias corporativas',
      'Mediación y conciliación',
      'Comercio electrónico'
    ],
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    category: 'DERECHO FAMILIAR',
    description: 'Protección y defensa de los intereses familiares con sensibilidad y profesionalismo.',
    services: [
      'Divorcios',
      'Pensiones alimenticias',
      'Juicios sucesorios',
      'Testamentarios',
      'Intestamentarios',
      'Patria potestad y custodia de menores',
      'Mediación y/o conciliación'
    ],
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  {
    category: 'DERECHO CIVIL',
    description: 'Soluciones jurídicas para la protección de sus derechos patrimoniales y personales.',
    services: [
      'Contratos',
      'Juicios hipotecarios',
      'Juicios de terminación o rescisión de arrendamiento',
      'Disoluciones de copropiedad',
      'Asociaciones y sociedades civiles',
      'Mediación y/o conciliación',
      'Escrituración de contratos privados de compraventa',
      'Juicios para recuperar la posesión de bienes inmuebles'
    ],
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16l-3-9m3 9l3-9" />
      </svg>
    )
  }
];

// Function to convert service category to slug
const getServiceSlug = (category: string): string => {
  const slugMap: { [key: string]: string } = {
    'DERECHO ADMINISTRATIVO': 'derecho-administrativo',
    'DERECHO NOTARIAL': 'derecho-notarial',
    'DERECHO CORPORATIVO': 'derecho-corporativo',
    'DERECHO FAMILIAR': 'derecho-familiar',
    'DERECHO CIVIL': 'derecho-civil'
  };
  return slugMap[category] || category.toLowerCase().replace(/\s+/g, '-');
};

export default function ServicesPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;

    if (!hero || !title || !subtitle) return;

    // Hero animations
    const tl = gsap.timeline();
    
    gsap.set([title, subtitle], { opacity: 0, y: 30 });

    tl.to(title, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      delay: 0.2
    })
    .to(subtitle, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.4");

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-stone-50">
      <Navbar />
      <main className="pt-32 pb-16">
        {/* Hero Section */}
        <div ref={heroRef} className="relative bg-gradient-to-br from-stone-50 via-white to-amber-50/20 py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#B79F76]/5 to-transparent" />
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#B79F76]/10 to-transparent rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#152239]/10 to-transparent rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
          
          <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center">
              <span className="inline-block text-[#B79F76] font-semibold text-sm uppercase tracking-[0.2em] mb-6 relative">
                <span className="absolute inset-0 bg-[#B79F76]/10 blur-xl" />
                <span className="relative">ALTUM Legal</span>
              </span>
              
              <h1 ref={titleRef} className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#152239] mb-6 leading-tight">
                Nuestros <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B79F76] to-amber-700 italic">Servicios</span>
              </h1>
              
              <p ref={subtitleRef} className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
                Defensa jurídica con ética, transparencia y compromiso real.
                Soluciones jurídicas claras, honestas y eficaces en todas las áreas del derecho.
              </p>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="space-y-12">
            {services.map((serviceCategory, index) => (
              <ServiceCardSimple
                key={serviceCategory.category}
                category={serviceCategory.category}
                description={serviceCategory.description}
                services={serviceCategory.services}
                icon={serviceCategory.icon}
                index={index}
                slug={getServiceSlug(serviceCategory.category)}
              />
            ))}
          </div>

          {/* Contact CTA */}
          <div className="relative mt-20 p-12 bg-gradient-to-br from-[#152239] via-[#1a2a42] to-[#152239] text-white rounded-2xl overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#B79F76]/10 to-transparent" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#B79F76]/20 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
            
            <div className="relative text-center">
              <span className="inline-block text-[#B79F76] font-semibold text-sm uppercase tracking-[0.2em] mb-4">
                Contacto Profesional
              </span>
              
              <h3 className="text-3xl lg:text-4xl font-serif font-bold mb-6">
                ¿Necesita Asesoría Legal Especializada?
              </h3>
              
              <p className="text-xl mb-10 font-light opacity-90 max-w-2xl mx-auto leading-relaxed">
                En ALTUM Legal trabajamos como un solo equipo para brindar
                la mejor estrategia legal y alcanzar resultados de excelencia.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button className="group relative bg-gradient-to-r from-[#B79F76] to-amber-700 text-white px-10 py-4 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#B79F76]/25 transform hover:scale-105 rounded-lg overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    Consulta Gratuita
                    <svg className="ml-3 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-700 to-[#B79F76] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
                
                <button className="group relative border-2 border-[#B79F76] text-[#B79F76] px-10 py-4 font-semibold transition-all duration-300 hover:bg-[#B79F76] hover:text-white rounded-lg overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    Contactar Ahora
                    <svg className="ml-3 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}