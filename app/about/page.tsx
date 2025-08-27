'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/sections/Footer';

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

interface Specialty {
  title: string;
  services: string[];
  color: string;
}

export default function AboutPage() {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLElement>(null);
  const specialtiesRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const paragraphRefs = useRef<HTMLDivElement[]>([]);
  const specialtyRefs = useRef<HTMLDivElement[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
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
          
          // Convert to specialties format with alternating colors
          const formattedSpecialties = parentServices
            .sort((a, b) => a.order - b.order)
            .map((parent, index) => {
              const childServices = servicesData
                .filter(s => s.parentId === parent.id && s.isActive)
                .sort((a, b) => a.order - b.order)
                .map(s => s.name);
              
              return {
                title: parent.name.toUpperCase(),
                services: childServices,
                color: index % 2 === 0 ? '#152239' : '#B79F76'
              };
            });
          
          setSpecialties(formattedSpecialties);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        // Fallback to default data
        setSpecialties([
          {
            title: 'DERECHO ADMINISTRATIVO',
            services: [
              'Licencias y permisos municipales',
              'Transparencia',
              'Impugnaciones de multas',
              'Juicios de nulidad',
              'Juicios de créditos fiscales'
            ],
            color: '#152239'
          },
          {
            title: 'DERECHO NOTARIAL',
            services: [
              'Escrituración de compraventas, donaciones, permuta',
              'Cancelaciones de gravámenes',
              'Sucesiones',
              'Cartas notariales para viaje con menores',
              'Ratificaciones de firmas'
            ],
            color: '#B79F76'
          },
          {
            title: 'DERECHO CORPORATIVO',
            services: [
              'Constitución de sociedades mercantiles y civiles',
              'Actas de asambleas',
              'Estrategias corporativas',
              'Mediación y conciliación',
              'Comercio electrónico'
            ],
            color: '#152239'
          },
          {
            title: 'DERECHO FAMILIAR',
            services: [
              'Divorcios',
              'Pensiones alimenticias',
              'Juicios sucesorios',
              'Testamentarios',
              'Intestamentarios',
              'Patria potestad y custodia de menores',
              'Mediación y/o conciliación'
            ],
            color: '#B79F76'
          },
          {
            title: 'DERECHO CIVIL',
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
            color: '#152239'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      // Hero section animations - with null checks
      if (titleRef.current && subtitleRef.current) {
        const heroTl = gsap.timeline();
        
        heroTl
          .fromTo(titleRef.current, 
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power2.out' }
          )
          .fromTo(subtitleRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
            '-=0.5'
          );
      }

      // Content paragraphs animation - with null checks
      const validParagraphs = paragraphRefs.current.filter(ref => ref !== null);
      if (validParagraphs.length > 0 && contentRef.current) {
        gsap.fromTo(validParagraphs,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: contentRef.current,
              start: 'top 80%',
            }
          }
        );
      }

      // Specialties animation - with null checks
      const validSpecialties = specialtyRefs.current.filter(ref => ref !== null);
      if (validSpecialties.length > 0 && specialtiesRef.current) {
        gsap.fromTo(validSpecialties,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: specialtiesRef.current,
              start: 'top 85%',
            }
          }
        );
      }
    }, [heroRef, contentRef, specialtiesRef]);

    return () => ctx.revert();
  }, [loading]);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 to-slate-50"
        style={{ paddingTop: '80px' }} // Account for fixed navbar
      >
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h1
            ref={titleRef}
            className="text-5xl md:text-6xl lg:text-7xl leading-tight mb-8"
            style={{ color: '#152239' }}
          >
            <span className="altum-brand">ALTUM</span>{' '}
            <span className="legal-brand" style={{ color: '#B79F76' }}>Legal</span>
          </h1>
          
          <p
            ref={subtitleRef}
            className="text-xl md:text-2xl font-light mb-12 leading-relaxed"
            style={{ color: '#B79F76' }}
          >
            Defensa jurídica con ética, transparencia y compromiso real.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section ref={contentRef} className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="space-y-12">
            
            <div 
              ref={el => { if (el) paragraphRefs.current[0] = el; }}
              className="max-w-4xl mx-auto"
            >
              <p className="text-lg md:text-xl leading-relaxed font-light text-slate-700 mb-8">
                En ALTUM Legal sabemos que detrás de cada asunto legal hay personas, familias y empresas que confían en un equipo para defender lo que más les importa. Por eso, nuestro compromiso va más allá de representar casos: defendemos causas, cuidamos intereses y protegemos derechos.
              </p>
            </div>

            <div 
              ref={el => { if (el) paragraphRefs.current[1] = el; }}
              className="max-w-4xl mx-auto"
            >
              <p className="text-lg md:text-xl leading-relaxed font-light text-slate-700 mb-8">
                Somos un despacho conformado por especialistas en diversas ramas del derecho, enfocados en ofrecer soluciones jurídicas claras, honestas y eficaces. Cada uno de nuestros abogados trabaja bajo un código de ética estricto, garantizando un trato respetuoso, cercano y profesional desde el primer contacto.
              </p>
            </div>

            <div 
              ref={el => { if (el) paragraphRefs.current[2] = el; }}
              className="max-w-4xl mx-auto"
            >
              <p className="text-lg md:text-xl leading-relaxed font-light text-slate-700 mb-8">
                Transparencia, honestidad y confianza no son palabras decorativas para nosotros; son la base de cada acción que tomamos. Buscamos relaciones de asociación a largo plazo con los clientes, con el fin de brindar la mejor solución integral a sus necesidades legales, lo cual se logra empleando estrategias de la más alta calidad y trabajo arduo para garantizar que se satisfagan las necesidades legales de nuestros clientes.
              </p>
            </div>

            <div 
              ref={el => { if (el) paragraphRefs.current[3] = el; }}
              className="max-w-4xl mx-auto bg-gradient-to-r from-amber-50 to-stone-50 p-8 border-l-4 border-amber-700"
            >
              <p className="text-lg md:text-xl leading-relaxed font-medium italic text-slate-800">
                "Creemos que el éxito para obtener buenos resultados depende de la estrecha coordinación con nuestros clientes y el trabajo colaborativo de nuestros abogados para establecer objetivos, comunicar riesgos y beneficios, desarrollar estrategias y revisar periódicamente el progreso para mantener informados a nuestros clientes en todo momento."
              </p>
            </div>

            <div 
              ref={el => { if (el) paragraphRefs.current[4] = el; }}
              className="max-w-4xl mx-auto"
            >
              <p className="text-lg md:text-xl leading-relaxed font-light text-slate-700">
                En ALTUM Legal impulsamos la colaboración entre nuestros abogados con distintas especialidades para ofrecer soluciones legales integrales y certeras. Trabajamos de manera coordinada, como un solo equipo, combinando experiencia y una amplia capacidad en cada área para brindar a nuestros clientes la mejor estrategia posible y alcanzar resultados de excelencia.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section ref={specialtiesRef} className="py-24 bg-gradient-to-br from-stone-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-800 mb-6">
              Nuestras <span style={{ color: '#B79F76', fontStyle: 'italic' }}>Especialidades</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto font-light">
              Áreas de práctica donde ofrecemos soluciones jurídicas especializadas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {specialties.map((specialty, index) => (
              <div
                key={specialty.title}
                ref={el => { if (el) specialtyRefs.current[index] = el; }}
                className="bg-white rounded-none shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div 
                  className="h-2"
                  style={{ backgroundColor: specialty.color }}
                />
                
                <div className="p-8">
                  <h3 
                    className="text-xl font-bold mb-6 leading-tight"
                    style={{ 
                      color: specialty.color,
                      fontFamily: 'Minion Pro, serif'
                    }}
                  >
                    {specialty.title}
                  </h3>
                  
                  <ul className="space-y-3">
                    {specialty.services.map((service, serviceIndex) => (
                      <li 
                        key={serviceIndex}
                        className="flex items-start"
                      >
                        <div 
                          className="w-1.5 h-1.5 rounded-full mt-2 mr-3 flex-shrink-0"
                          style={{ backgroundColor: specialty.color }}
                        />
                        <span className="text-slate-600 font-light leading-relaxed text-sm">
                          {service}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}