'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { number: '25+', label: 'Años de Experiencia' },
  { number: '500+', label: 'Casos Exitosos' },
  { number: '50+', label: 'Empresas Asesoradas' },
  { number: '98%', label: 'Tasa de Éxito' }
];

const credentials = [
  'Colegio de Abogados de México',
  'American Bar Association',
  'International Bar Association',
  'Barra Mexicana de Abogados'
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement[]>([]);
  const credentialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        }
      });

      tl.fromTo(titleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power2.out' }
      )
      .fromTo(textRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.5'
      )
      .fromTo(statsRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.7)' },
        '-=0.3'
      )
      .fromTo(credentialsRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.3'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-stone-50 to-slate-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="text-amber-700 font-medium text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4 block">
              ALTUM Legal
            </span>
            
            <h2
              ref={titleRef}
              className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl font-serif font-bold text-slate-800 mb-6 sm:mb-8 leading-tight"
            >
              <span className="text-amber-700 italic">Ética, Transparencia</span> y
              <br />
              Compromiso Real
            </h2>
            
            <div ref={textRef} className="space-y-4 sm:space-y-6">
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-light">
                En ALTUM Legal sabemos que detrás de cada asunto legal hay personas, familias y empresas
                que confían en un equipo para defender lo que más les importa. Por eso, nuestro compromiso
                va más allá de representar casos: defendemos causas, cuidamos intereses y protegemos derechos.
              </p>
              
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-light">
                Somos un despacho conformado por especialistas en diversas ramas del derecho, enfocados
                en ofrecer soluciones jurídicas claras, honestas y eficaces. Cada uno de nuestros abogados
                trabaja bajo un código de ética estricto, garantizando un trato respetuoso, cercano y profesional.
              </p>
              
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-light">
                Transparencia, honestidad y confianza no son palabras decorativas para nosotros; son la base
                de cada acción que tomamos. Buscamos relaciones de asociación a largo plazo para brindar la
                mejor solución integral a sus necesidades legales.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mt-8 sm:mt-10 lg:mt-12">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  ref={(el) => { if (el) statsRef.current[index] = el; }}
                  className="text-left"
                >
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-amber-700 mb-1 sm:mb-2">
                    {stat.number}
                  </div>
                  <div className="text-slate-600 font-light text-sm sm:text-base">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-amber-50 to-stone-50 border-l-4 border-amber-700">
              <p className="text-slate-700 font-medium italic text-base sm:text-lg leading-relaxed">
                "Creemos que el éxito depende de la estrecha coordinación con nuestros clientes
                y el trabajo colaborativo de nuestros abogados para establecer objetivos,
                comunicar riesgos y beneficios, y desarrollar estrategias de excelencia."
              </p>
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-6 sm:space-y-8 mt-8 lg:mt-0">
            {/* Professional Image Placeholder */}
            <div className="aspect-[4/3] sm:aspect-[3/2] lg:aspect-[4/3] bg-gradient-to-br from-slate-100 to-stone-200 rounded-none relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-4 sm:top-6 right-4 sm:right-6 w-12 sm:w-16 lg:w-20 h-12 sm:h-16 lg:h-20 bg-amber-200 rounded-full opacity-40"></div>
              <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 w-10 sm:w-12 lg:w-16 h-10 sm:h-12 lg:h-16 bg-slate-300 rounded-full opacity-50"></div>
              
              {/* Main content */}
              <div className="flex items-center justify-center h-full text-center text-slate-500 relative z-10">
                <div>
                  <svg className="w-12 sm:w-14 lg:w-16 h-12 sm:h-14 lg:h-16 mx-auto mb-3 sm:mb-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p className="font-serif font-medium text-slate-600 text-base sm:text-lg">Espacio Profesional</p>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 font-light">Tradición y Modernidad</p>
                </div>
              </div>
            </div>

            {/* Credentials */}
            <div ref={credentialsRef} className="bg-white border border-stone-200 p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-800 mb-4 sm:mb-6">
                Nuestro Enfoque
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-amber-700 rounded-full mt-2 mr-3 sm:mr-4 flex-shrink-0"></div>
                  <span className="text-slate-600 font-light leading-relaxed text-sm sm:text-base">
                    Colaboración entre especialistas para soluciones integrales
                  </span>
                </div>
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-amber-700 rounded-full mt-2 mr-3 sm:mr-4 flex-shrink-0"></div>
                  <span className="text-slate-600 font-light leading-relaxed text-sm sm:text-base">
                    Trabajo coordinado como un solo equipo
                  </span>
                </div>
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-amber-700 rounded-full mt-2 mr-3 sm:mr-4 flex-shrink-0"></div>
                  <span className="text-slate-600 font-light leading-relaxed text-sm sm:text-base">
                    Estrategias de alta calidad para resultados de excelencia
                  </span>
                </div>
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-amber-700 rounded-full mt-2 mr-3 sm:mr-4 flex-shrink-0"></div>
                  <span className="text-slate-600 font-light leading-relaxed text-sm sm:text-base">
                    Comunicación constante y seguimiento periódico
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}