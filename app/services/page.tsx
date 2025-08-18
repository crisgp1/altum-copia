'use client';

import Navbar from '@/app/components/navigation/Navbar';
import Footer from '@/app/components/sections/Footer';
import ServiceCard from '@/app/lib/presentation/components/services/ServiceCard';
import ServiceCardSimple from '@/app/lib/presentation/components/services/ServiceCardSimple';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { getIconById } from '@/app/lib/constants/serviceIcons';

gsap.registerPlugin(ScrollTrigger);

interface ServiceItem {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  iconUrl?: string;
  parentId?: string;
  order: number;
  isActive: boolean;
}

interface ServiceCategory {
  category: string;
  description: string;
  services: string[];
  icon: React.ReactNode;
  slug: string;
}

// Function to convert service name to slug
const getServiceSlug = (name: string): string => {
  return name.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};


export default function ServicesPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        const data = await response.json();
        
        if (data.success) {
          // Group services by parent
          const servicesData = data.data as ServiceItem[];
          const parentServices = servicesData.filter(s => !s.parentId && s.isActive);
          
          const formattedServices = parentServices
            .sort((a, b) => a.order - b.order)
            .map(parent => {
              const childServices = servicesData
                .filter(s => s.parentId === parent.id && s.isActive)
                .sort((a, b) => a.order - b.order)
                .map(s => s.name);
              
              return {
                category: parent.name,
                description: parent.shortDescription,
                services: childServices,
                icon: parent.iconUrl ? getIconById(parent.iconUrl) : getIconById('balance-scale'),
                slug: getServiceSlug(parent.name)
              };
            });
          
          setServices(formattedServices);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

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
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B79F76]"></div>
            </div>
          ) : services.length > 0 ? (
            <div className="space-y-12">
              {services.map((serviceCategory, index) => (
                <ServiceCardSimple
                  key={serviceCategory.category}
                  category={serviceCategory.category}
                  description={serviceCategory.description}
                  services={serviceCategory.services}
                  icon={serviceCategory.icon}
                  index={index}
                  slug={serviceCategory.slug}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">No hay servicios disponibles en este momento.</p>
            </div>
          )}

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