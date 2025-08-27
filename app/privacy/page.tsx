'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/sections/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function PrivacyPage() {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sectionRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: 'power2.out' }
        );
      }

      // Content sections animation
      const validSections = sectionRefs.current.filter(ref => ref !== null);
      if (validSections.length > 0) {
        gsap.fromTo(validSections,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: contentRef.current,
              start: 'top 85%',
            }
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-stone-50">
      <Navbar />
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative pt-32 pb-16 bg-gradient-to-br from-stone-50 to-slate-50"
      >
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h1
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6"
            style={{ color: '#152239' }}
          >
            Política de <span style={{ color: '#B79F76' }}>Privacidad</span>
          </h1>
          <p className="text-lg text-slate-600">
            Última actualización: Enero 2025
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section ref={contentRef} className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            
            {/* Introducción */}
            <div ref={el => { if (el) sectionRefs.current[0] = el; }} className="mb-8">
              <p className="text-lg text-slate-700 leading-relaxed">
                En ALTUM Legal respetamos y protegemos la privacidad de nuestros clientes y visitantes. 
                Esta Política de Privacidad describe cómo recopilamos, usamos, almacenamos y protegemos 
                su información personal cuando utiliza nuestros servicios legales y visita nuestro sitio web.
              </p>
            </div>

            {/* Información que Recopilamos */}
            <div ref={el => { if (el) sectionRefs.current[1] = el; }} className="mb-10">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#152239' }}>
                1. Información que Recopilamos
              </h2>
              <div className="space-y-4 text-slate-700">
                <div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: '#B79F76' }}>
                    Información Personal
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Nombre completo y datos de identificación</li>
                    <li>Información de contacto (teléfono, correo electrónico, dirección)</li>
                    <li>Información profesional y laboral</li>
                    <li>Información necesaria para la prestación de servicios legales</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: '#B79F76' }}>
                    Información Automática
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Dirección IP y datos de navegación</li>
                    <li>Tipo de navegador y dispositivo</li>
                    <li>Páginas visitadas y tiempo de permanencia</li>
                    <li>Cookies y tecnologías similares</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Uso de la Información */}
            <div ref={el => { if (el) sectionRefs.current[2] = el; }} className="mb-10">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#152239' }}>
                2. Uso de la Información
              </h2>
              <p className="text-slate-700 mb-4">
                Utilizamos su información personal para:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li>Proporcionar servicios legales y asesoría jurídica</li>
                <li>Gestionar su relación como cliente</li>
                <li>Cumplir con obligaciones legales y regulatorias</li>
                <li>Enviar comunicaciones relevantes sobre nuestros servicios</li>
                <li>Mejorar nuestros servicios y experiencia del usuario</li>
                <li>Proteger nuestros derechos legales e intereses</li>
              </ul>
            </div>

            {/* Protección de Datos */}
            <div ref={el => { if (el) sectionRefs.current[3] = el; }} className="mb-10">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#152239' }}>
                3. Protección y Seguridad de Datos
              </h2>
              <p className="text-slate-700 mb-4">
                Implementamos medidas de seguridad técnicas, administrativas y físicas para proteger 
                su información personal contra acceso no autorizado, pérdida, alteración o divulgación:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li>Cifrado de datos sensibles</li>
                <li>Acceso restringido a información personal</li>
                <li>Protocolos de seguridad en nuestras instalaciones</li>
                <li>Capacitación continua del personal en protección de datos</li>
                <li>Auditorías periódicas de seguridad</li>
              </ul>
            </div>

            {/* Compartir Información */}
            <div ref={el => { if (el) sectionRefs.current[4] = el; }} className="mb-10">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#152239' }}>
                4. Compartir Información con Terceros
              </h2>
              <p className="text-slate-700 mb-4">
                No vendemos, alquilamos ni compartimos su información personal con terceros, excepto en los siguientes casos:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li>Con su consentimiento expreso</li>
                <li>Para cumplir con obligaciones legales o requerimientos judiciales</li>
                <li>Con proveedores de servicios que nos asisten en nuestras operaciones</li>
                <li>Para proteger los derechos y seguridad de ALTUM Legal y nuestros clientes</li>
                <li>En caso de fusión, adquisición o venta de activos</li>
              </ul>
            </div>

            {/* Confidencialidad Abogado-Cliente */}
            <div ref={el => { if (el) sectionRefs.current[5] = el; }} className="mb-10">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#152239' }}>
                5. Confidencialidad Abogado-Cliente
              </h2>
              <p className="text-slate-700">
                La información compartida entre usted y nuestros abogados está protegida por el 
                secreto profesional y la confidencialidad abogado-cliente. Esta información solo 
                se divulgará con su autorización expresa o cuando la ley lo requiera expresamente.
              </p>
            </div>

            {/* Derechos del Usuario */}
            <div ref={el => { if (el) sectionRefs.current[6] = el; }} className="mb-10">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#152239' }}>
                6. Sus Derechos
              </h2>
              <p className="text-slate-700 mb-4">
                Usted tiene derecho a:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li>Acceder a su información personal</li>
                <li>Rectificar datos incorrectos o desactualizados</li>
                <li>Cancelar o eliminar su información (cuando sea legalmente posible)</li>
                <li>Oponerse al tratamiento de sus datos para ciertos fines</li>
                <li>Limitar el uso de su información</li>
                <li>Recibir su información en un formato portable</li>
              </ul>
              <p className="text-slate-700 mt-4">
                Para ejercer estos derechos, contáctenos a través de los medios indicados al final de esta política.
              </p>
            </div>

            {/* Retención de Datos */}
            <div ref={el => { if (el) sectionRefs.current[7] = el; }} className="mb-10">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#152239' }}>
                7. Retención de Datos
              </h2>
              <p className="text-slate-700">
                Conservamos su información personal durante el tiempo necesario para cumplir con los 
                propósitos descritos en esta política, cumplir con nuestras obligaciones legales, 
                resolver disputas y hacer cumplir nuestros acuerdos. Los períodos de retención 
                varían según el tipo de información y las obligaciones legales aplicables.
              </p>
            </div>

            {/* Cookies */}
            <div ref={el => { if (el) sectionRefs.current[8] = el; }} className="mb-10">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#152239' }}>
                8. Uso de Cookies
              </h2>
              <p className="text-slate-700">
                Nuestro sitio web utiliza cookies y tecnologías similares para mejorar su experiencia 
                de navegación, analizar el uso del sitio y personalizar contenido. Puede configurar 
                su navegador para rechazar cookies, aunque esto podría afectar algunas funcionalidades 
                del sitio.
              </p>
            </div>

            {/* Menores de Edad */}
            <div ref={el => { if (el) sectionRefs.current[9] = el; }} className="mb-10">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#152239' }}>
                9. Menores de Edad
              </h2>
              <p className="text-slate-700">
                Nuestros servicios no están dirigidos a menores de 18 años. No recopilamos 
                intencionalmente información de menores sin el consentimiento de sus padres o tutores legales.
              </p>
            </div>

            {/* Cambios a la Política */}
            <div ref={el => { if (el) sectionRefs.current[10] = el; }} className="mb-10">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#152239' }}>
                10. Cambios a Esta Política
              </h2>
              <p className="text-slate-700">
                Nos reservamos el derecho de actualizar esta Política de Privacidad periódicamente. 
                Los cambios serán publicados en esta página con la fecha de última actualización. 
                Le recomendamos revisar esta política regularmente.
              </p>
            </div>

            {/* Contacto */}
            <div ref={el => { if (el) sectionRefs.current[11] = el; }} className="mb-10">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#152239' }}>
                11. Contacto
              </h2>
              <p className="text-slate-700 mb-4">
                Si tiene preguntas sobre esta Política de Privacidad o sobre el tratamiento de sus datos 
                personales, puede contactarnos a través de:
              </p>
              <div className="bg-stone-50 p-6 rounded-lg">
                <p className="font-semibold text-slate-800 mb-2">ALTUM Legal</p>
                <p className="text-slate-700">
                  Av. Faro #2522, Bosque de la Victoria<br />
                  CP. 44538. Guadalajara, Jalisco<br />
                  Teléfono: +52 33 3629 7531<br />
                  WhatsApp: +52 33 1568 1688<br />
                  Email: contacto@altumlegal.com
                </p>
              </div>
            </div>

            {/* Autoridad de Protección de Datos */}
            <div ref={el => { if (el) sectionRefs.current[12] = el; }} className="mb-10">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#152239' }}>
                12. Autoridad de Protección de Datos
              </h2>
              <p className="text-slate-700">
                Si considera que el tratamiento de sus datos personales infringe la normativa aplicable, 
                tiene derecho a presentar una reclamación ante el Instituto Nacional de Transparencia, 
                Acceso a la Información y Protección de Datos Personales (INAI).
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}