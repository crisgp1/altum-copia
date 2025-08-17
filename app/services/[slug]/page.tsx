'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/app/components/navigation/Navbar';
import Footer from '@/app/components/sections/Footer';
import { Attorney } from '@/app/lib/types/Attorney';

// Service data structure with ALTUM Legal services
const servicesData = {
  'derecho-administrativo': {
    title: 'DERECHO ADMINISTRATIVO',
    subtitle: 'Licencias, Permisos y Procedimientos Administrativos',
    description: 'Especialistas en trámites y procedimientos ante autoridades administrativas con soluciones eficaces y oportunas.',
    detailedDescription: 'En ALTUM Legal contamos con especialistas en derecho administrativo que brindan asesoría integral en todos los procedimientos ante autoridades gubernamentales. Nuestro enfoque se centra en la prevención de conflictos y la resolución eficaz de controversias administrativas.',
    services: [
      'Licencias y permisos municipales',
      'Transparencia y acceso a la información',
      'Impugnaciones de multas y sanciones',
      'Juicios de nulidad contra actos administrativos',
      'Juicios de créditos fiscales',
      'Procedimientos de responsabilidad administrativa',
      'Consulta y asesoría en normativa administrativa'
    ],
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    color: '#152239',
    bgGradient: 'from-slate-50 to-stone-50',
    keywords: ['administrativo', 'licencias', 'permisos', 'gobierno', 'municipales', 'transparencia']
  },
  'derecho-corporativo': {
    title: 'DERECHO CORPORATIVO',
    subtitle: 'Estrategias Corporativas y Comercio Empresarial',
    description: 'Asesoría integral para empresas, desde constitución hasta estrategias corporativas complejas y comercio electrónico.',
    detailedDescription: 'Nuestro equipo de especialistas en derecho corporativo ofrece soluciones integrales para empresas de todos los tamaños. Desde la constitución de sociedades hasta complejas restructuraciones corporativas, brindamos asesoría estratégica para el crecimiento y consolidación empresarial.',
    services: [
      'Constitución de sociedades mercantiles y civiles',
      'Actas de asambleas y consejos de administración',
      'Estrategias corporativas y reestructuraciones',
      'Mediación y conciliación empresarial',
      'Comercio electrónico y regulación digital',
      'Fusiones y adquisiciones',
      'Compliance corporativo',
      'Contratos comerciales especializados'
    ],
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: '#B79F76',
    bgGradient: 'from-amber-50 to-stone-50',
    keywords: ['corporativo', 'empresarial', 'sociedades', 'comercio', 'fusiones', 'mercantil']
  },
  'derecho-familiar': {
    title: 'DERECHO FAMILIAR',
    subtitle: 'Protección Integral de la Familia',
    description: 'Defensa sensible y profesional de los intereses familiares con enfoque humano y soluciones integrales.',
    detailedDescription: 'En ALTUM Legal entendemos la importancia de los asuntos familiares. Nuestros especialistas brindan asesoría con sensibilidad y profesionalismo, priorizando el bienestar familiar y la protección de menores, siempre buscando soluciones que preserven las relaciones familiares.',
    services: [
      'Divorcios necesarios y voluntarios',
      'Pensiones alimenticias y modificaciones',
      'Juicios sucesorios intestamentarios',
      'Juicios testamentarios',
      'Procedimientos de intestado',
      'Patria potestad y custodia de menores',
      'Mediación y conciliación familiar',
      'Adopciones y tutela',
      'Violencia familiar y medidas de protección'
    ],
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    color: '#152239',
    bgGradient: 'from-slate-50 to-stone-50',
    keywords: ['familiar', 'familia', 'divorcios', 'custodia', 'alimentos', 'sucesiones', 'menores']
  },
  'derecho-civil': {
    title: 'DERECHO CIVIL',
    subtitle: 'Protección de Derechos Patrimoniales y Personales',
    description: 'Soluciones jurídicas especializadas para la protección de sus derechos patrimoniales, contratos y bienes inmuebles.',
    detailedDescription: 'Nuestros especialistas en derecho civil ofrecen protección integral de sus derechos patrimoniales y personales. Con amplia experiencia en contratos, propiedad inmobiliaria y resolución de conflictos civiles, garantizamos la defensa efectiva de sus intereses.',
    services: [
      'Elaboración y revisión de contratos',
      'Juicios hipotecarios y prendarios',
      'Juicios de terminación o rescisión de arrendamiento',
      'Disoluciones de copropiedad',
      'Constitución de asociaciones y sociedades civiles',
      'Mediación y conciliación civil',
      'Escrituración de contratos privados de compraventa',
      'Juicios para recuperar la posesión de bienes inmuebles',
      'Responsabilidad civil y daños'
    ],
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16l-3-9m3 9l3-9" />
      </svg>
    ),
    color: '#B79F76',
    bgGradient: 'from-amber-50 to-stone-50',
    keywords: ['civil', 'contratos', 'inmobiliario', 'propiedad', 'hipotecarios', 'arrendamiento']
  },
  'derecho-notarial': {
    title: 'DERECHO NOTARIAL',
    subtitle: 'Servicios Notariales Especializados',
    description: 'Servicios notariales profesionales para la seguridad jurídica de sus actos más importantes con validez legal completa.',
    detailedDescription: 'En ALTUM Legal ofrecemos servicios notariales especializados que garantizan la seguridad jurídica de sus actos más importantes. Nuestros especialistas brindan asesoría integral en todos los procedimientos notariales con la más alta calidad y profesionalismo.',
    services: [
      'Escrituración de compraventas inmobiliarias',
      'Escrituración de donaciones entre vivos',
      'Contratos de permuta de bienes',
      'Cancelaciones de gravámenes hipotecarios',
      'Procedimientos sucesorios notariales',
      'Cartas notariales para viaje con menores',
      'Ratificaciones de firmas',
      'Protocolización de documentos',
      'Constitución de sociedades ante notario'
    ],
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: '#152239',
    bgGradient: 'from-slate-50 to-stone-50',
    keywords: ['notarial', 'escrituras', 'notario', 'compraventa', 'donaciones', 'sucesiones']
  }
};

// Smart attorney matching function
const getMatchingAttorneys = (serviceSlug: string, attorneys: Attorney[]): Attorney[] => {
  const service = servicesData[serviceSlug as keyof typeof servicesData];
  if (!service || !attorneys.length) return [];

  const keywords = service.keywords;
  
  return attorneys.filter(attorney => {
    // Check if attorney's specialization contains any of the service keywords
    const hasKeywordMatch = attorney.specialization.some(spec => 
      keywords.some(keyword => 
        spec.toLowerCase().includes(keyword) || 
        keyword.includes(spec.toLowerCase())
      )
    );

    // Special matching rules for better accuracy
    if (serviceSlug === 'derecho-corporativo') {
      return attorney.specialization.some(spec => 
        spec.toLowerCase().includes('corporativo') || 
        spec.toLowerCase().includes('mercantil') ||
        spec.toLowerCase().includes('empresarial') ||
        spec.toLowerCase().includes('fusiones')
      );
    }
    
    if (serviceSlug === 'derecho-familiar') {
      return attorney.specialization.some(spec => 
        spec.toLowerCase().includes('familia') || 
        spec.toLowerCase().includes('sucesiones') ||
        spec.toLowerCase().includes('patrimonial')
      );
    }
    
    if (serviceSlug === 'derecho-civil') {
      return attorney.specialization.some(spec => 
        spec.toLowerCase().includes('civil') || 
        spec.toLowerCase().includes('inmobiliario') ||
        spec.toLowerCase().includes('contratos')
      );
    }

    // For administrative and notarial law, return attorneys with general experience
    if (serviceSlug === 'derecho-administrativo' || serviceSlug === 'derecho-notarial') {
      return attorney.isPartner || attorney.experience >= 10;
    }

    return hasKeywordMatch;
  }).sort((a, b) => {
    // Sort by partnership status first, then by experience
    if (a.isPartner && !b.isPartner) return -1;
    if (!a.isPartner && b.isPartner) return 1;
    return b.experience - a.experience;
  });
};

export default function ServiceDetailPage() {
  const params = useParams();
  const [matchedAttorneys, setMatchedAttorneys] = useState<Attorney[]>([]);
  const [allAttorneys, setAllAttorneys] = useState<Attorney[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const slug = params?.slug as string;

  const service = servicesData[slug as keyof typeof servicesData];

  // Fetch attorneys from API
  const fetchActiveAttorneys = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/attorneys/active');
      
      if (!response.ok) {
        throw new Error('Error al cargar los abogados');
      }
      
      const data = await response.json();
      
      // Map the API response to match the expected Attorney interface
      const mappedAttorneys: Attorney[] = data.map((attorney: any) => ({
        id: attorney.id,
        name: attorney.nombre,
        position: attorney.cargo,
        specialization: attorney.especializaciones || [],
        experience: attorney.experienciaAnios,
        education: attorney.educacion || [],
        languages: attorney.idiomas || [],
        email: attorney.correo,
        phone: attorney.telefono,
        bio: attorney.biografia,
        achievements: attorney.logros || [],
        cases: attorney.casosDestacados || [],
        imageUrl: attorney.imagenUrl,
        linkedIn: attorney.linkedIn,
        isPartner: attorney.esSocio,
        image: attorney.imagenUrl || '/images/attorneys/default-attorney.jpg',
        shortDescription: attorney.descripcionCorta || attorney.biografia?.substring(0, 150) + '...'
      }));
      
      setAllAttorneys(mappedAttorneys);
    } catch (err) {
      console.error('Error fetching attorneys:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveAttorneys();
  }, []);

  useEffect(() => {
    if (slug && allAttorneys.length > 0) {
      const attorneys = getMatchingAttorneys(slug, allAttorneys);
      setMatchedAttorneys(attorneys);
    }
  }, [slug, allAttorneys]);

  if (!service) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">Servicio no encontrado</h1>
            <p className="text-slate-600">El servicio solicitado no existe.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className={`pt-32 pb-16 bg-gradient-to-br ${service.bgGradient}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-amber-700 font-medium text-sm uppercase tracking-wider mb-4 block">
                ALTUM Legal
              </span>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-800 mb-6 leading-tight">
                {service.title}
              </h1>
              <p className="text-xl text-slate-600 mb-6 leading-relaxed font-light">
                {service.subtitle}
              </p>
              <p className="text-lg text-slate-700 mb-8 leading-relaxed">
                {service.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  className="bg-slate-800 text-white px-8 py-4 font-medium hover:bg-slate-700 transition-colors duration-300 inline-flex items-center justify-center"
                  style={{ backgroundColor: service.color }}
                >
                  <span>Consulta Gratuita</span>
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
                <button className="border-2 px-8 py-4 font-medium hover:bg-slate-800 hover:text-white transition-colors duration-300"
                  style={{ borderColor: service.color, color: service.color }}>
                  Contactar Especialista
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-white rounded-2xl shadow-2xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br opacity-10"
                  style={{ background: `linear-gradient(135deg, ${service.color}20 0%, ${service.color}40 100%)` }}>
                </div>
                <div className="text-center relative z-10" style={{ color: service.color }}>
                  {service.icon}
                  <h3 className="text-xl font-serif font-bold mt-4">Especialización</h3>
                  <p className="text-sm opacity-70 mt-2">Experiencia Comprobada</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Details */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-serif font-bold text-slate-800 mb-6">
                Nuestro Enfoque Especializado
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                {service.detailedDescription}
              </p>
              
              <div className="bg-gradient-to-r from-amber-50 to-stone-50 border-l-4 p-6 mb-8"
                style={{ borderColor: service.color }}>
                <p className="text-slate-700 font-medium italic">
                  "En ALTUM Legal trabajamos bajo un código de ética estricto, garantizando 
                  transparencia, honestidad y confianza en cada proceso legal."
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-serif font-bold text-slate-800 mb-6">
                Servicios Incluidos
              </h3>
              <div className="space-y-4">
                {service.services.map((serviceItem, index) => (
                  <div key={index} className="flex items-start group cursor-pointer p-3 rounded-lg hover:bg-stone-50 transition-colors duration-200">
                    <div className="w-2 h-2 rounded-full mt-2 mr-4 flex-shrink-0 group-hover:scale-125 transition-transform duration-200"
                      style={{ backgroundColor: service.color }}>
                    </div>
                    <span className="text-slate-700 leading-relaxed group-hover:text-slate-900">
                      {serviceItem}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Matched Attorneys Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-stone-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-800 mb-4">
              Nuestros Especialistas en <span className="italic" style={{ color: service.color }}>
                {service.title}
              </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Conozca a nuestros abogados especializados en esta área, seleccionados por su experiencia 
              y trayectoria comprobada en {service.title.toLowerCase()}.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Cargando especialistas...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-slate-600 mb-4">{error}</p>
              <button
                onClick={fetchActiveAttorneys}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          ) : matchedAttorneys.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {matchedAttorneys.map((attorney, index) => (
                <div key={attorney.id} 
                  className="bg-white border border-stone-200 hover:border-amber-200 transition-all duration-300 group overflow-hidden shadow-lg hover:shadow-xl">
                  <div className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-stone-200 rounded-full flex items-center justify-center mr-4">
                        <span className="text-2xl font-bold text-slate-600">
                          {attorney.name.split(' ')[1]?.[0] || attorney.name[0]}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-serif font-bold text-slate-800 group-hover:text-amber-700 transition-colors duration-300">
                          {attorney.name}
                        </h3>
                        <p className="text-sm text-slate-600">{attorney.position}</p>
                        <p className="text-xs text-slate-500">{attorney.experience} años de experiencia</p>
                      </div>
                    </div>
                    
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      {attorney.shortDescription}
                    </p>
                    
                    <div className="mb-4">
                      <p className="text-xs font-medium text-slate-700 mb-2">Especialidades:</p>
                      <div className="flex flex-wrap gap-1">
                        {attorney.specialization.slice(0, 2).map((spec, idx) => (
                          <span key={idx} 
                            className="text-xs px-2 py-1 rounded-full text-white"
                            style={{ backgroundColor: service.color }}>
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs text-slate-500">Disponible</span>
                      </div>
                      <button 
                        className="text-xs font-medium px-3 py-1 border border-amber-700 text-amber-700 hover:bg-amber-700 hover:text-white transition-colors duration-200"
                        style={{ borderColor: service.color, color: service.color }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = service.color;
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = service.color;
                        }}>
                        Contactar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">Especialistas Disponibles</h3>
              <p className="text-slate-600 max-w-md mx-auto">
                Nuestros especialistas en {service.title.toLowerCase()} están disponibles para consulta. 
                Contáctenos para conectarlo con el abogado más adecuado para su caso.
              </p>
              <div className="mt-6">
                <button 
                  className="px-6 py-3 text-white font-medium rounded-lg transition-colors duration-300"
                  style={{ backgroundColor: service.color }}
                >
                  Contactar Especialista
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">
            ¿Necesita Asesoría en {service.title}?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Nuestros especialistas están listos para brindarle la mejor solución jurídica 
            con ética, transparencia y compromiso real.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 font-medium transition-colors duration-300 text-slate-900"
              style={{ backgroundColor: service.color }}>
              Agendar Consulta Gratuita
            </button>
            <button className="border-2 border-amber-700 text-amber-700 px-8 py-4 font-medium hover:bg-amber-700 hover:text-white transition-colors duration-300">
              Llamar Ahora: +52 55 1234-5678
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}