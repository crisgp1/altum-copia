'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import toast from 'react-hot-toast';
import { validateContactForm, sanitizeInput } from '@/app/lib/utils/validation';
import { FaPhone, FaWhatsapp, FaMapMarkerAlt, FaClock, FaEnvelope, FaArrowRight } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

const contactInfo = [
  {
    icon: <FaPhone className="w-6 h-6" />,
    title: 'Oficina',
    info: '+52 33 3629 7531',
    href: 'tel:+523336297531'
  },
  {
    icon: <FaWhatsapp className="w-6 h-6" />,
    title: 'WhatsApp',
    info: '+52 33 1568 1688',
    href: 'https://wa.me/523315681688'
  },
  {
    icon: <FaMapMarkerAlt className="w-6 h-6" />,
    title: 'Dirección',
    info: 'Av. Faro #2522, Bosques de la Victoria',
    href: 'https://maps.google.com/?q=Av.+Faro+2522+Bosques+de+la+Victoria+Guadalajara'
  },
  {
    icon: <FaClock className="w-6 h-6" />,
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

  const generateWhatsAppMessage = () => {
    const { name, email, phone, area, message } = formData;
    
    let whatsappMessage = `*Nueva Consulta Legal - ALTUM Legal*\n\n`;
    whatsappMessage += `*Nombre:* ${name}\n`;
    whatsappMessage += `*Email:* ${email}\n`;
    
    if (phone) {
      whatsappMessage += `*Teléfono:* ${phone}\n`;
    }
    
    if (area) {
      whatsappMessage += `*Área de interés:* ${area}\n`;
    }
    
    whatsappMessage += `\n*Consulta:*\n${message}\n\n`;
    whatsappMessage += `_Mensaje enviado desde altum-legal.mx_`;
    
    return encodeURIComponent(whatsappMessage);
  };

  const sendToWhatsApp = () => {
    // Validate form first
    const validation = validateContactForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error('Por favor corrija los errores en el formulario');
      return;
    }
    
    setErrors({});
    
    // WhatsApp number from contact info
    const whatsappNumber = '523315681688';
    const encodedMessage = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in new window/tab
    window.open(whatsappUrl, '_blank');
    
    // Show success message
    toast.success('Redirigiendo a WhatsApp...');
    
    // Reset form after successful validation
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        area: '',
        message: ''
      });
    }, 1000);
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
      className="py-16 sm:py-20 lg:py-24 bg-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-amber-400 font-medium text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4 block">
            Contacto Profesional
          </span>
          <h2
            ref={titleRef}
            className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl text-white mb-4 sm:mb-6 leading-tight"
            style={{ fontFamily: 'Minion Pro, serif', fontWeight: 'bold' }}
          >
            ¿Necesita <span className="text-amber-400 italic">Asesoría Legal</span>?
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl sm:max-w-3xl mx-auto font-light px-4 sm:px-0">
            Contáctenos hoy mismo para una consulta gratuita. 
            Estamos aquí para proteger sus intereses legales.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
          {/* Contact Form */}
          <div ref={formRef} className="bg-white p-4 sm:p-6 lg:p-8 border border-stone-200">
            <h3 className="text-xl sm:text-2xl text-slate-800 mb-4 sm:mb-6" style={{ fontFamily: 'Minion Pro, serif', fontWeight: 'bold' }}>
              Consulta Gratuita
            </h3>
            
            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 border transition-all duration-200 focus:outline-none focus:ring-1 text-sm sm:text-base ${
                      errors.name 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-stone-300 focus:ring-amber-500 focus:border-amber-500'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 border transition-all duration-200 focus:outline-none focus:ring-1 text-sm sm:text-base ${
                      errors.email 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-stone-300 focus:ring-amber-500 focus:border-amber-500'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 border transition-all duration-200 focus:outline-none focus:ring-1 text-sm sm:text-base ${
                      errors.phone 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-stone-300 focus:ring-amber-500 focus:border-amber-500'
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">
                    Área de interés
                  </label>
                  <select 
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-sm sm:text-base"
                  >
                    <option value="">Seleccione un área</option>
                    <option value="Derecho Administrativo">Derecho Administrativo</option>
                    <option value="Derecho Notarial">Derecho Notarial</option>
                    <option value="Derecho Corporativo">Derecho Corporativo</option>
                    <option value="Derecho Familiar">Derecho Familiar</option>
                    <option value="Derecho Civil">Derecho Civil</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">
                  Describa su consulta *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border transition-all duration-200 focus:outline-none focus:ring-1 resize-none text-sm sm:text-base ${
                    errors.message 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-stone-300 focus:ring-amber-500 focus:border-amber-500'
                  }`}
                ></textarea>
                {errors.message && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-slate-800 text-white px-6 sm:px-8 py-3 sm:py-4 font-medium transition-all duration-300 inline-flex items-center justify-center text-sm sm:text-base ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-700'
                  }`}
                  style={{ minHeight: '44px' }}
                >
                  <span>{isSubmitting ? 'Enviando...' : 'Enviar por Email'}</span>
                  {!isSubmitting && (
                    <FaEnvelope className="ml-2 w-3 sm:w-4 h-3 sm:h-4" />
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={sendToWhatsApp}
                  className="bg-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 font-medium transition-all duration-300 inline-flex items-center justify-center text-sm sm:text-base hover:bg-green-700 group"
                  style={{ minHeight: '44px' }}
                >
                  <span>Enviar por WhatsApp</span>
                  <FaWhatsapp className="ml-2 w-4 h-4 transition-transform group-hover:scale-110" />
                </button>
              </div>
            </form>
          </div>

          {/* Contact Information */}
          <div ref={contactRef} className="space-y-6 sm:space-y-8">
            <div>
              <h3 className="text-xl sm:text-2xl text-white mb-4 sm:mb-6" style={{ fontFamily: 'Minion Pro, serif', fontWeight: 'bold' }}>
                Información de Contacto
              </h3>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 font-light">
                Nuestro equipo está disponible para atenderle de lunes a viernes 
                de 9:00 AM a 7:00 PM. Para casos urgentes, contamos con atención 24/7.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {contactInfo.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="flex items-center p-4 sm:p-6 bg-slate-700 border border-slate-600 hover:border-amber-500 transition-all duration-300 group"
                >
                  <div className="w-10 sm:w-12 h-10 sm:h-12 bg-amber-600 text-white flex items-center justify-center mr-3 sm:mr-4 group-hover:bg-amber-500 transition-colors duration-200 flex-shrink-0">
                    <div className="w-5 sm:w-6 h-5 sm:h-6">
                      {item.icon}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-slate-400 text-xs sm:text-sm font-medium">
                      {item.title}
                    </div>
                    <div className="text-white font-medium text-sm sm:text-base leading-tight">
                      {item.info}
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <div className="bg-slate-700 border border-slate-600 p-4 sm:p-6">
              <h4 className="text-white mb-3 sm:mb-4 text-base sm:text-lg" style={{ fontFamily: 'Minion Pro, serif', fontWeight: 'bold' }}>Horarios de Atención</h4>
              <div className="space-y-2 text-slate-300 text-sm sm:text-base">
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