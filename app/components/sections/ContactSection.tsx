'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import toast from 'react-hot-toast';
import { validateContactForm, sanitizeInput } from '@/app/lib/utils/validation';

gsap.registerPlugin(ScrollTrigger);

const contactInfo = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    title: 'Oficina',
    info: '+52 33 3629 7531',
    href: 'tel:+523336297531'
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: 'WhatsApp',
    info: '+52 33 1568 1688',
    href: 'https://wa.me/523315681688'
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Dirección',
    info: 'Av. Faro #2522, Bosque de la Victoria',
    href: 'https://maps.google.com/?q=Av.+Faro+2522+Bosque+de+la+Victoria+Guadalajara'
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Horario',
    info: 'Lun - Vie: 09:00 - 18:00',
    href: '#'
  }
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    area: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Validate form
    const validation = validateContactForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error('Por favor corrija los errores en el formulario');
      return;
    }
    
    setErrors({});
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success(data.message || 'Su consulta ha sido enviada exitosamente');
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          area: '',
          message: ''
        });
      } else {
        toast.error(data.error || 'Error al enviar el formulario');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error de conexión. Por favor intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 border transition-all duration-200 focus:outline-none focus:ring-1 ${
                      errors.name 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-stone-300 focus:ring-amber-500 focus:border-amber-500'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 border transition-all duration-200 focus:outline-none focus:ring-1 ${
                      errors.email 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-stone-300 focus:ring-amber-500 focus:border-amber-500'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border transition-all duration-200 focus:outline-none focus:ring-1 ${
                      errors.phone 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-stone-300 focus:ring-amber-500 focus:border-amber-500'
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Área de interés
                  </label>
                  <select 
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                  >
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
                  Describa su consulta *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className={`w-full px-4 py-3 border transition-all duration-200 focus:outline-none focus:ring-1 resize-none ${
                    errors.message 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-stone-300 focus:ring-amber-500 focus:border-amber-500'
                  }`}
                ></textarea>
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-slate-800 text-white px-8 py-4 font-medium transition-all duration-300 inline-flex items-center justify-center ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-700'
                }`}
              >
                <span>{isSubmitting ? 'Enviando...' : 'Enviar Consulta'}</span>
                {!isSubmitting && (
                  <svg 
                    className="ml-2 w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                )}
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