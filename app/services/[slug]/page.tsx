'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/app/components/navigation/Navbar';
import Footer from '@/app/components/sections/Footer';
import { Attorney } from '@/app/lib/types/Attorney';
import { getIconById } from '@/app/lib/constants/serviceIcons';
import { FaWhatsapp } from 'react-icons/fa';

// Service interface to match database structure
interface ServiceData {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  iconUrl?: string;
  imageUrl?: string;
  parentId?: string;
  order: number;
  isActive: boolean;
  children?: ServiceData[];
}

interface FormattedService {
  title: string;
  subtitle: string;
  description: string;
  services: string[];
  icon: React.ReactNode;
  imageUrl?: string;
  color: string;
  bgGradient: string;
  keywords: string[];
}

// Convert slug to service name for matching
const slugToServiceName = (slug: string): string => {
  return slug.replace(/-/g, ' ').toLowerCase();
};

// Smart attorney matching function
const getMatchingAttorneys = (serviceName: string, attorneys: Attorney[]): Attorney[] => {
  if (!serviceName || !attorneys.length) return [];

  const searchTerms = serviceName.toLowerCase().split(' ');
  
  return attorneys.filter(attorney => {
    // Check if attorney's specialization contains any of the service terms
    return attorney.specialization.some(spec => 
      searchTerms.some(term => 
        spec.toLowerCase().includes(term) || 
        term.includes(spec.toLowerCase())
      )
    );
  }).sort((a, b) => {
    // Sort by partnership status first, then by experience
    if (a.isPartner && !b.isPartner) return -1;
    if (!a.isPartner && b.isPartner) return 1;
    return b.experience - a.experience;
  });
};

// Generate WhatsApp message for attorney contact in specific service
const generateServiceWhatsAppMessage = (attorney: Attorney, serviceName: string): string => {
  let whatsappMessage = `*Consulta Legal - ALTUM Legal*\n\n`;
  whatsappMessage += `Hola ${attorney.name},\n\n`;
  whatsappMessage += `Me interesa obtener asesoría legal en *${serviceName}*.\n\n`;
  whatsappMessage += `He visto su perfil como especialista en esta área y me gustaría agendar una consulta.\n\n`;
  whatsappMessage += `¿Podríamos programar una cita para discutir mi caso?\n\n`;
  whatsappMessage += `_Mensaje enviado desde altum-legal.mx_`;
  
  return encodeURIComponent(whatsappMessage);
};

// Send WhatsApp message to specific attorney
const sendToAttorneyWhatsApp = (attorney: Attorney, serviceName: string) => {
  // Validate phone number exists
  if (!attorney.phone) {
    console.error('No phone number available for attorney:', attorney.name);
    return;
  }
  
  // Clean and format phone number for WhatsApp
  let phoneNumber = attorney.phone.replace(/\D/g, '');
  
  // Validate cleaned phone number
  if (!phoneNumber || phoneNumber.length < 10) {
    console.error('Invalid phone number for attorney:', attorney.name, attorney.phone);
    return;
  }
  
  // Ensure phone number has country code
  if (!phoneNumber.startsWith('52') && phoneNumber.length === 10) {
    phoneNumber = '52' + phoneNumber;
  }
  
  const encodedMessage = generateServiceWhatsAppMessage(attorney, serviceName);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  
  // Open WhatsApp in new window/tab
  window.open(whatsappUrl, '_blank');
};

// Generate SEO-friendly slug from attorney name
const generateAttorneySlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
};

// Format service data for display
const formatServiceForDisplay = (service: ServiceData, children: ServiceData[]): FormattedService => {
  return {
    title: service.name.toUpperCase(),
    subtitle: service.shortDescription,
    description: service.description,
    services: children.map(child => child.name),
    icon: service.iconUrl ? getIconById(service.iconUrl) : getIconById('balance-scale'),
    imageUrl: service.imageUrl,
    color: '#152239',
    bgGradient: 'from-slate-50 to-stone-50',
    keywords: service.name.toLowerCase().split(' ')
  };
};

export default function ServiceDetailPage() {
  const params = useParams();
  const [matchedAttorneys, setMatchedAttorneys] = useState<Attorney[]>([]);
  const [allAttorneys, setAllAttorneys] = useState<Attorney[]>([]);
  const [service, setService] = useState<FormattedService | null>(null);
  const [loading, setLoading] = useState(true);
  const [attorneysLoading, setAttorneysLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attorneysError, setAttorneysError] = useState<string | null>(null);
  const slug = params?.slug as string;

  // Fetch service data from API
  const fetchService = async () => {
    try {
      const response = await fetch('/api/services');
      const data = await response.json();
      
      if (data.success) {
        const services = data.data as ServiceData[];
        
        // Find the parent service that matches the slug
        const parentService = services.find(s => {
          if (!s.parentId && s.isActive) {
            const serviceSlug = s.name.toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/\s+/g, '-')
              .replace(/[^a-z0-9-]/g, '');
            return serviceSlug === slug;
          }
          return false;
        });
        
        if (parentService) {
          // Get children services
          const children = services.filter(s => s.parentId === parentService.id && s.isActive)
            .sort((a, b) => a.order - b.order);
          
          const formattedService = formatServiceForDisplay(parentService, children);
          setService(formattedService);
        } else {
          setError('Servicio no encontrado');
        }
      } else {
        setError('Error al cargar el servicio');
      }
    } catch (err) {
      console.error('Error fetching service:', err);
      setError('Error al cargar el servicio');
    }
  };

  // Fetch attorneys from API
  const fetchActiveAttorneys = async () => {
    try {
      setAttorneysLoading(true);
      const response = await fetch('/api/attorneys/active');
      
      if (!response.ok) {
        throw new Error('Error al cargar los abogados');
      }
      
      const data = await response.json();
      
      // Map the API response to match the expected Attorney interface
      const mappedAttorneys: Attorney[] = data.map((attorney: any) => {
        console.log('Mapping attorney:', attorney.nombre, 'Phone from API:', attorney.telefono);
        return {
          id: attorney.id,
          name: attorney.nombre,
          position: attorney.cargo,
          specialization: attorney.especializaciones || [],
          experience: attorney.experienciaAnios,
          education: attorney.educacion || [],
          languages: attorney.idiomas || [],
          email: attorney.correo,
          phone: attorney.telefono, // Map telefono from public DTO to phone field
          bio: attorney.biografia,
          achievements: attorney.logros || [],
          cases: attorney.casosDestacados || [],
          imageUrl: attorney.imagenUrl,
          linkedIn: attorney.linkedIn,
          isPartner: attorney.esSocio,
          image: attorney.imagenUrl || '/images/attorneys/default-attorney.jpg',
          shortDescription: attorney.descripcionCorta || attorney.biografia?.substring(0, 150) + '...'
        };
      });
      
      setAllAttorneys(mappedAttorneys);
    } catch (err) {
      console.error('Error fetching attorneys:', err);
      setAttorneysError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setAttorneysLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchService();
      setLoading(false);
      // Load attorneys separately
      fetchActiveAttorneys();
    };
    
    if (slug) {
      loadData();
    }
  }, [slug]);

  useEffect(() => {
    if (service && allAttorneys.length > 0) {
      const attorneys = getMatchingAttorneys(service.title, allAttorneys);
      setMatchedAttorneys(attorneys);
    }
  }, [service, allAttorneys]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B79F76] mx-auto mb-4"></div>
            <p className="text-slate-600">Cargando servicio...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">Servicio no encontrado</h1>
            <p className="text-slate-600">{error || 'El servicio solicitado no existe.'}</p>
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
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              <div className="aspect-square bg-white rounded-2xl shadow-2xl flex items-center justify-center relative overflow-hidden">
                {service.imageUrl ? (
                  <>
                    <img
                      src={service.imageUrl}
                      alt={service.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      onLoad={() => console.log('Service image loaded:', service.imageUrl)}
                      onError={(e) => {
                        console.error('Service image failed to load:', service.imageUrl);
                        // Hide broken image and show fallback
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40 flex items-center justify-center">
                      <div className="text-center relative z-10 text-white">
                        <div className="flex items-center justify-center">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-white">
                            {service.icon}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br opacity-10"
                      style={{ background: `linear-gradient(135deg, ${service.color}20 0%, ${service.color}40 100%)` }}>
                    </div>
                    <div className="text-center relative z-10" style={{ color: service.color }}>
                      <div className="flex items-center justify-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24" style={{ color: service.color }}>
                          {service.icon}
                        </div>
                      </div>
                    </div>
                  </>
                )}
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
                En ALTUM Legal sabemos que detrás de cada asunto legal hay personas, familias y empresas
                que confían en un equipo para defender lo que más les importa. Por eso, nuestro compromiso
                va más allá de representar casos: defendemos causas, cuidamos intereses y protegemos derechos.
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

          {attorneysLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Cargando especialistas...</p>
              </div>
            </div>
          ) : attorneysError ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-slate-600 mb-4">{attorneysError}</p>
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
                      <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-stone-200 rounded-full flex items-center justify-center mr-4 overflow-hidden">
                        {attorney.imageUrl || attorney.image ? (
                          <img
                            src={attorney.imageUrl || attorney.image}
                            alt={attorney.name}
                            className="w-full h-full object-cover rounded-full"
                            onError={(e) => {
                              // Fallback to initials if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.parentElement!.innerHTML = `
                                <span class="text-2xl font-bold text-slate-600">
                                  ${attorney.name.split(' ')[1]?.[0] || attorney.name[0]}
                                </span>
                              `;
                            }}
                          />
                        ) : (
                          <span className="text-2xl font-bold text-slate-600">
                            {attorney.name.split(' ')[1]?.[0] || attorney.name[0]}
                          </span>
                        )}
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
                    
                    <div className="pt-4 border-t border-stone-200 space-y-3">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs text-slate-500">{attorney.email}</span>
                      </div>
                      
                      {/* WhatsApp Button - Always show, fallback for debugging */}
                      <button
                        onClick={() => attorney.phone ? sendToAttorneyWhatsApp(attorney, service.title) : console.log('No phone available for:', attorney.name)}
                        className={`w-full py-2 px-4 rounded-lg transition-colors duration-200 inline-flex items-center justify-center space-x-2 text-sm font-medium ${
                          attorney.phone
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        }`}
                        title={attorney.phone ? `WhatsApp: ${attorney.phone}` : 'Teléfono no disponible'}
                        disabled={!attorney.phone}
                      >
                        <FaWhatsapp className="w-4 h-4" />
                        <span>{attorney.phone ? 'Contactar por WhatsApp' : 'Sin WhatsApp disponible'}</span>
                      </button>
                      
                      {/* View Profile Button */}
                      <a
                        href={`/equipo/${attorney.slug || generateAttorneySlug(attorney.name)}`}
                        className="w-full text-sm font-medium py-2 px-4 rounded-lg border-2 border-amber-600 text-amber-600 hover:bg-amber-50 transition-colors duration-200 inline-flex items-center justify-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Conoce al abogado</span>
                      </a>
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