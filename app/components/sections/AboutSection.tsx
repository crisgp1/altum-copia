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
      className="py-24 bg-gradient-to-br from-stone-50 to-slate-50"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="text-amber-700 font-medium text-sm uppercase tracking-wider mb-4 block">
              Nuestro Compromiso
            </span>
            
            <h2
              ref={titleRef}
              className="text-4xl md:text-5xl font-serif font-bold text-slate-800 mb-8 leading-tight"
            >
              <span className="text-amber-700 italic">Tradición</span> y
              <br />
              Excelencia Jurídica
            </h2>
            
            <div ref={textRef} className="space-y-6">
              <p className="text-lg text-slate-600 leading-relaxed font-light">
                Fundado en 1998, nuestro despacho ha establecido un estándar de excelencia 
                en el sector jurídico mexicano. Combinamos la sabiduría de décadas de experiencia 
                con enfoques innovadores para resolver los desafíos legales más complejos.
              </p>
              
              <p className="text-lg text-slate-600 leading-relaxed font-light">
                Nuestro equipo está formado por abogados especialistas reconocidos nacional 
                e internacionalmente, comprometidos con la defensa de los intereses de 
                nuestros clientes con la máxima dedicación y profesionalismo.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8 mt-12">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  ref={(el) => { if (el) statsRef.current[index] = el; }}
                  className="text-left"
                >
                  <div className="text-3xl md:text-4xl font-serif font-bold text-amber-700 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-slate-600 font-light">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-8">
            {/* Professional Image Placeholder */}
            <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-stone-200 rounded-none relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-6 right-6 w-20 h-20 bg-amber-200 rounded-full opacity-40"></div>
              <div className="absolute bottom-8 left-8 w-16 h-16 bg-slate-300 rounded-full opacity-50"></div>
              
              {/* Main content */}
              <div className="flex items-center justify-center h-full text-center text-slate-500 relative z-10">
                <div>
                  <svg className="w-16 h-16 mx-auto mb-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p className="font-serif font-medium text-slate-600">Espacio Profesional</p>
                  <p className="text-sm text-slate-500 mt-1 font-light">Tradición y Modernidad</p>
                </div>
              </div>
            </div>

            {/* Credentials */}
            <div ref={credentialsRef} className="bg-white border border-stone-200 p-8">
              <h3 className="text-xl font-serif font-bold text-slate-800 mb-6">
                Membresías y Certificaciones
              </h3>
              <div className="space-y-3">
                {credentials.map((credential, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-amber-700 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <span className="text-slate-600 font-light leading-relaxed">{credential}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}