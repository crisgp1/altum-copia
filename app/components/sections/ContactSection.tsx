'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const contactInfo = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    title: 'Teléfono',
    info: '+52 (55) 1234-5678',
    href: 'tel:+525512345678'
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Email',
    info: 'contacto@altumlegal.mx',
    href: 'mailto:contacto@altumlegal.mx'
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Oficina',
    info: 'Polanco, Ciudad de México',
    href: '#'
  }
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

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
      .fromTo([formRef.current, contactRef.current],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power2.out' },
        '-=0.5'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-24 bg-slate-800"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-amber-400 font-medium text-sm uppercase tracking-wider mb-4 block">
            Contacto Profesional
          </span>
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl text-white mb-6 leading-tight"
            style={{ fontFamily: 'Minion Pro, serif', fontWeight: 'bold' }}
          >
            ¿Necesita <span className="text-amber-400 italic">Asesoría Legal</span>?
          </h2>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto font-light">
            Contáctenos hoy mismo para una consulta gratuita. 
            Estamos aquí para proteger sus intereses legales.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div ref={formRef} className="bg-white p-8 border border-stone-200">
            <h3 className="text-2xl text-slate-800 mb-6" style={{ fontFamily: 'Minion Pro, serif', fontWeight: 'bold' }}>
              Consulta Gratuita
            </h3>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Área de interés
                  </label>
                  <select className="w-full px-4 py-3 border border-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200">
                    <option value="">Seleccione un área</option>
                    <option value="corporativo">Derecho Corporativo</option>
                    <option value="litigios">Litigios</option>
                    <option value="fiscal">Derecho Fiscal</option>
                    <option value="propiedad">Propiedad Intelectual</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Describa su consulta
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 resize-none"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-slate-800 text-white px-8 py-4 font-medium hover:bg-slate-700 transition-all duration-300 inline-flex items-center justify-center"
              >
                <span>Enviar Consulta</span>
                <svg 
                  className="ml-2 w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div ref={contactRef} className="space-y-8">
            <div>
              <h3 className="text-2xl text-white mb-6" style={{ fontFamily: 'Minion Pro, serif', fontWeight: 'bold' }}>
                Información de Contacto
              </h3>
              <p className="text-slate-300 text-lg leading-relaxed mb-8 font-light">
                Nuestro equipo está disponible para atenderle de lunes a viernes 
                de 9:00 AM a 7:00 PM. Para casos urgentes, contamos con atención 24/7.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="flex items-center p-6 bg-slate-700 border border-slate-600 hover:border-amber-500 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-amber-600 text-white flex items-center justify-center mr-4 group-hover:bg-amber-500 transition-colors duration-200">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm font-medium">
                      {item.title}
                    </div>
                    <div className="text-white font-medium">
                      {item.info}
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <div className="bg-slate-700 border border-slate-600 p-6">
              <h4 className="text-white mb-4" style={{ fontFamily: 'Minion Pro, serif', fontWeight: 'bold' }}>Horarios de Atención</h4>
              <div className="space-y-2 text-slate-300">
                <div className="flex justify-between font-light">
                  <span>Lunes - Viernes:</span>
                  <span>9:00 AM - 7:00 PM</span>
                </div>
                <div className="flex justify-between font-light">
                  <span>Sábados:</span>
                  <span>10:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between font-light">
                  <span>Emergencias:</span>
                  <span className="text-amber-400">24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}