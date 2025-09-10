'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/sections/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function TermsPage() {
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
            Términos de <span style={{ color: '#B79F76' }}>Servicio</span>
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
                Bienvenido al sitio web de ALTUM Legal. Estos Términos de Servicio rigen el uso de 
                nuestro sitio web www.altumlegal.com. Al acceder y utilizar este sitio, usted acepta 
                cumplir con estos términos y condiciones. Si no está de acuerdo con alguna parte de 
                estos términos, le solicitamos no utilizar nuestro sitio web.
              </p>
            </div>

            {/* Uso Aceptable */}
            <div ref={el => { if (el) sectionRefs.current[1] = el; }} className="mb-10">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#152239' }}>
                1. Uso Aceptable del Sitio Web
              </h2>
              <div className="space-y-4 text-slate-700">
                <p>
                  Al utilizar este sitio web, usted se compromete a:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Utilizar el sitio únicamente con fines legales y de manera que no infrinja los derechos de terceros</li>
                  <li>No intentar acceder sin autorización a áreas restringidas del sitio</li>
                  <li>No interferir con el funcionamiento del sitio o los servidores que lo alojan</li>
                  <li>No transmitir virus, malware o cualquier código de naturaleza destructiva</li>
                  <li>No utilizar el sitio para enviar comunicaciones no solicitadas o spam</li>
                  <li>Respetar todos los avisos de derechos de autor y propiedad intelectual</li>
                </ul>
              </div>
            </div>

            {/* Contenido del Sitio */}
            <div ref={el => { if (el) sectionRefs.current[2] = el; }} className="mb-10">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#152239' }}>
                2. Contenido del Sitio Web
              </h2>
              <div className="space-y-4 text-slate-700">
                <h3 className="text-xl font-semibold" style={{ color: '#B79F76' }}>
                  2.1 Carácter Informativo
                </h3>
                <p>
                  El contenido de este sitio web es únicamente de carácter informativo y educativo. 
                  No constituye asesoría legal ni debe interpretarse como tal. La información 
                  presentada no crea una relación abogado-cliente.
                </p>
                
                <h3 className="text-xl font-semibold" style={{ color: '#B79F76' }}>
                  2.2 Actualización de Contenido
                </h3>
                <p>
                  Nos esforzamos por mantener la información actualizada, pero no garantizamos que 
                  todo el contenido sea preciso, completo o vigente en todo momento. Las leyes y 
                  regulaciones cambian frecuentemente.
                </p>
                
                <h3 className="text-xl font-semibold" style={{ color: '#B79F76' }}>
                  2.3 Enlaces Externos
                </h3>
                <p>
                  Nuestro sitio puede contener enlaces a sitios web de terceros. No somos responsables 
                  del contenido, políticas de privacidad o prácticas de estos sitios externos.
                </p>
              </div>
            </div>

            {/* Propiedad Intelectual */}
            <div ref={el => { if (el) sectionRefs.current[3] = el; }} className="mb-10">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#152239' }}>
                3. Propiedad Intelectual
              </h2>
              <div className="space-y-4 text-slate-700">
                <p>
                  Todo el contenido de este sitio web, incluyendo pero no limitado a:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Textos, artículos y contenido editorial</li>
                  <li>Logotipos, marcas y nombres comerciales</li>
                  <li>Imágenes, fotografías y gráficos</li>
                  <li>Diseño, estructura y apariencia visual</li>
                  <li>Código fuente y software</li>
                </ul>
                <p className="mt-4">
                  Es propiedad de ALTUM Legal o se utiliza con la debida autorización. Queda 
                  estrictamente prohibida su reproducción, distribución, modificación o uso 
                  comercial sin nuestro consentimiento previo por escrito.
                </p>
              </div>
            </div>

            {/* Registro y Cuentas */}
            <div ref={el => { if (el) sectionRefs.current[4] = el; }} className="mb-10">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#152239' }}>
                4. Registro y Formularios de Contacto
              </h2>
              <div className="space-y-4 text-slate-700">
                <p>
                  Al enviar información a través de nuestros formularios de contacto o registro:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Usted garantiza que la información proporcionada es veraz y precisa</li>
                  <li>Se compromete a mantener su información actualizada</li>
                  <li>Es responsable de mantener la confidencialidad de sus credenciales de acceso</li>
                  <li>Acepta que podamos contactarlo en relación con su consulta</li>
                  <li>Comprende que el envío de información no establece una relación abogado-cliente</li>
                </ul>
              </div>
            </div>

            {/* Privacidad y Cookies */}
            <div ref={el => { if (el) sectionRefs.current[5] = el; }} className="mb-10">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#152239' }}>
                5. Privacidad y Cookies
              </h2>
              <div className="space-y-4 text-slate-700">
                <p>
                  El tratamiento de sus datos personales se rige por nuestra Política de Privacidad, 
                  disponible en este sitio web. Al utilizar nuestro sitio, acepta las prácticas 
                  descritas en dicha política.
                </p>
                <p>
                  Utilizamos cookies para mejorar su experiencia de navegación, analizar el tráfico 
                  del sitio y personalizar el contenido. Puede configurar su navegador para rechazar 
                  las cookies, aunque esto puede afectar la funcionalidad del sitio.
                </p>
              </div>
            </div>

            {/* Descargo de Responsabilidad */}
            <div ref={el => { if (el) sectionRefs.current[6] = el; }} className="mb-10">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#152239' }}>
                6. Descargo de Responsabilidad
              </h2>
              <div className="space-y-4 text-slate-700">
                <p>
                  Este sitio web se proporciona "tal cual" y "según disponibilidad". No garantizamos:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Que el sitio funcionará de manera ininterrumpida o libre de errores</li>
                  <li>Que los defectos serán corregidos inmediatamente</li>
                  <li>Que el sitio o el servidor estén libres de virus u otros componentes dañinos</li>
                  <li>La exactitud, integridad o utilidad de cualquier información presentada</li>
                </ul>
                <p className="mt-4 font-semibold">
                  El uso de este sitio web es bajo su propio riesgo. No seremos responsables por 
                  decisiones tomadas basándose únicamente en la información de este sitio.
                </p>
              </div>
            </div>

            {/* Limitación de Responsabilidad */}
            <div ref={el => { if (el) sectionRefs.current[7] = el; }} className="mb-10">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#152239' }}>
                7. Limitación de Responsabilidad
              </h2>
              <div className="space-y-4 text-slate-700">
                <p>
                  En la máxima medida permitida por la ley, ALTUM Legal no será responsable por:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Daños directos, indirectos, incidentales, especiales o consecuenciales</li>
                  <li>Pérdida de datos, beneficios o ingresos</li>
                  <li>Interrupciones del negocio</li>
                  <li>Daños resultantes del uso o incapacidad de usar el sitio</li>
                  <li>Errores, virus, troyanos o similares transmitidos al sitio por terceros</li>
                </ul>
                <p className="mt-4">
                  Esta limitación aplica independientemente de si los daños derivan de incumplimiento 
                  de contrato, agravio, negligencia, responsabilidad estricta u otra causa.
                </p>
              </div>
            </div>

            {/* Indemnización */}
            <div ref={el => { if (el) sectionRefs.current[8] = el; }} className="mb-10">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#152239' }}>
                8. Indemnización
              </h2>
              <p className="text-slate-700">
                Usted acepta indemnizar, defender y mantener indemne a ALTUM Legal, sus directivos, 
                empleados, agentes y afiliados, de cualquier reclamo, daño, obligación, pérdida, 
                responsabilidad, costo o deuda, y gastos (incluyendo honorarios de abogados) que 
                resulten de:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 mt-4">
                <li>Su uso y acceso al sitio web</li>
                <li>Su violación de estos Términos de Servicio</li>
                <li>Su violación de derechos de terceros</li>
                <li>Cualquier contenido que envíe a través del sitio</li>
              </ul>
            </div>

            {/* Modificaciones */}
            <div ref={el => { if (el) sectionRefs.current[9] = el; }} className="mb-10">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#152239' }}>
                9. Modificaciones a los Términos
              </h2>
              <p className="text-slate-700 mb-4">
                Nos reservamos el derecho de modificar estos Términos de Servicio en cualquier momento. 
                Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio web.
              </p>
              <p className="text-slate-700">
                Su uso continuado del sitio después de la publicación de cambios constituye su 
                aceptación de dichos cambios. Le recomendamos revisar periódicamente estos términos 
                para estar informado de cualquier actualización.
              </p>
            </div>

            {/* Jurisdicción */}
            <div ref={el => { if (el) sectionRefs.current[10] = el; }} className="mb-10">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#152239' }}>
                10. Ley Aplicable y Jurisdicción
              </h2>
              <p className="text-slate-700 mb-4">
                Estos Términos de Servicio se rigen por las leyes de los Estados Unidos Mexicanos 
                y del Estado de Jalisco, sin tener en cuenta sus disposiciones sobre conflictos de leyes.
              </p>
              <p className="text-slate-700">
                Para cualquier controversia derivada del uso de este sitio web, las partes se someten 
                a la jurisdicción de los tribunales competentes de Guadalajara, Jalisco, México, 
                renunciando a cualquier otro fuero que pudiera corresponderles.
              </p>
            </div>

            {/* Disposiciones Varias */}
            <div ref={el => { if (el) sectionRefs.current[11] = el; }} className="mb-10">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#152239' }}>
                11. Disposiciones Varias
              </h2>
              <div className="space-y-4 text-slate-700">
                <h3 className="text-xl font-semibold" style={{ color: '#B79F76' }}>
                  11.1 Acuerdo Completo
                </h3>
                <p>
                  Estos Términos de Servicio constituyen el acuerdo completo entre usted y ALTUM Legal 
                  con respecto al uso del sitio web.
                </p>
                
                <h3 className="text-xl font-semibold" style={{ color: '#B79F76' }}>
                  11.2 Divisibilidad
                </h3>
                <p>
                  Si alguna disposición de estos términos es considerada inválida o inaplicable, las 
                  demás disposiciones continuarán en pleno vigor y efecto.
                </p>
                
                <h3 className="text-xl font-semibold" style={{ color: '#B79F76' }}>
                  11.3 No Renuncia
                </h3>
                <p>
                  Nuestra falta de ejercicio o demora en ejercer cualquier derecho no constituirá una 
                  renuncia a dicho derecho o disposición.
                </p>
              </div>
            </div>

            {/* Contacto */}
            <div ref={el => { if (el) sectionRefs.current[12] = el; }} className="mb-10">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#152239' }}>
                12. Información de Contacto
              </h2>
              <p className="text-slate-700 mb-4">
                Si tiene preguntas sobre estos Términos de Servicio o sobre el uso de nuestro sitio web, 
                puede contactarnos a través de:
              </p>
              <div className="bg-stone-50 p-6 rounded-lg">
                <p className="font-semibold text-slate-800 mb-2">ALTUM Legal</p>
                <p className="text-slate-700">
                  Av. Faro #2522, Bosques de la Victoria<br />
                  CP. 44538. Guadalajara, Jalisco, México<br />
                  Teléfono: +52 33 3629 7531<br />
                  WhatsApp: +52 33 1568 1688<br />
                  Email: contacto@altumlegal.com<br />
                  Sitio web: www.altumlegal.com
                </p>
              </div>
            </div>

            {/* Fecha de Vigencia */}
            <div ref={el => { if (el) sectionRefs.current[13] = el; }} className="mb-10">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#152239' }}>
                13. Fecha de Vigencia
              </h2>
              <p className="text-slate-700">
                Estos Términos de Servicio entran en vigor a partir del 1 de enero de 2025 y 
                permanecerán vigentes hasta que sean modificados o actualizados por ALTUM Legal.
              </p>
              <p className="text-slate-700 mt-4">
                Última actualización: Enero 2025
              </p>
            </div>

            {/* Aceptación */}
            <div ref={el => { if (el) sectionRefs.current[14] = el; }} className="mb-10 bg-gradient-to-r from-amber-50 to-stone-50 p-6 rounded-lg border-l-4 border-amber-700">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#152239' }}>
                Aceptación de Términos
              </h2>
              <p className="text-slate-700 font-medium">
                AL ACCEDER O UTILIZAR ESTE SITIO WEB, USTED ACEPTA QUEDAR VINCULADO POR ESTOS 
                TÉRMINOS DE SERVICIO. Si no está de acuerdo con todos estos términos y condiciones, 
                no debe usar este sitio web.
              </p>
              <p className="text-slate-700 mt-4">
                Estos términos se aplican a todos los visitantes, usuarios y otras personas que 
                accedan o utilicen el servicio.
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}