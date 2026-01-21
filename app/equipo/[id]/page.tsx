'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ChevronDown, ChevronRight, Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Languages, Star } from 'lucide-react';
import { AttorneyResponseDTO } from '@/app/lib/application/dtos/AttorneyDTO';
import Navbar from '@/app/components/navigation/Navbar';
import Footer from '@/app/components/sections/Footer';
import FavoriteAttorneyButton from '@/app/components/user/FavoriteAttorneyButton';
import toast from 'react-hot-toast';

interface ServiceData {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  parentId?: string;
  children?: ServiceData[];
}

export default function AttorneyProfilePage() {
  const params = useParams();
  const router = useRouter();
  const attorneyId = params.id as string;
  
  const [attorney, setAttorney] = useState<AttorneyResponseDTO | null>(null);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (attorneyId) {
      fetchAttorneyProfile();
      fetchServices();
    }
  }, [attorneyId]);

  const fetchAttorneyProfile = async () => {
    try {
      setIsLoading(true);

      // API now handles both MongoDB ID and slug lookups
      const response = await fetch(`/api/attorneys/${attorneyId}`);

      if (response.ok) {
        const data = await response.json();
        setAttorney(data);
      } else if (response.status === 404) {
        setError('Abogado no encontrado');
      } else {
        setError('Error al cargar el perfil del abogado');
      }
    } catch (err) {
      console.error('Error fetching attorney:', err);
      setError('Error al cargar el perfil del abogado');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setServices(data.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const getAttorneyServices = () => {
    if (!attorney || !services.length) return [];
    
    // Get all services this attorney handles
    const attorneyServiceIds = services.filter(service => 
      attorney.serviciosQueAtiende?.includes(service.id) ||
      attorney.especializaciones?.some(spec => 
        service.name.toLowerCase().includes(spec.toLowerCase()) ||
        spec.toLowerCase().includes(service.name.toLowerCase())
      )
    );
    
    console.log('Attorney services found:', attorneyServiceIds.length);
    console.log('Services:', attorneyServiceIds.map(s => ({ name: s.name, parentId: s.parentId })));
    
    // Group services by parent-child relationship
    const serviceMap = new Map<string, ServiceData>();
    const parentServices: ServiceData[] = [];
    
    // First pass: create map of all services and get all related services
    const allRelatedServices = new Set<string>();
    
    // Add all attorney services
    attorneyServiceIds.forEach(service => {
      allRelatedServices.add(service.id);
      if (service.parentId) {
        allRelatedServices.add(service.parentId);
      }
    });
    
    // Get all services that are either attorney services or their parents/children
    const relevantServices = services.filter(service => 
      allRelatedServices.has(service.id) ||
      (service.parentId && allRelatedServices.has(service.parentId)) ||
      attorneyServiceIds.some(as => as.parentId === service.id)
    );
    
    console.log('Relevant services:', relevantServices.length);
    console.log('Relevant services list:', relevantServices.map(s => ({ name: s.name, parentId: s.parentId })));
    
    // Create map of all relevant services
    relevantServices.forEach(service => {
      serviceMap.set(service.id, { ...service, children: [] });
    });
    
    // Second pass: organize hierarchy
    relevantServices.forEach(service => {
      const serviceWithChildren = serviceMap.get(service.id)!;
      
      if (!service.parentId) {
        // This is a parent service - only include if attorney handles it or has children that attorney handles
        const hasRelevantChildren = relevantServices.some(child => 
          child.parentId === service.id && 
          attorneyServiceIds.some(as => as.id === child.id)
        );
        
        const attorneyHandlesThis = attorneyServiceIds.some(as => as.id === service.id);
        
        if (attorneyHandlesThis || hasRelevantChildren) {
          parentServices.push(serviceWithChildren);
        }
      } else {
        // This is a child service - add to parent's children if parent exists
        const parent = serviceMap.get(service.parentId);
        if (parent) {
          parent.children!.push(serviceWithChildren);
        }
      }
    });
    
    console.log('Final parent services:', parentServices.map(p => ({ 
      name: p.name, 
      children: p.children?.length || 0 
    })));
    
    return parentServices;
  };

  const toggleServiceExpansion = (serviceId: string) => {
    setExpandedServices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId);
      } else {
        newSet.add(serviceId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-white flex items-center justify-center mt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-medium text-slate-800 mb-2">Cargando perfil...</h2>
            <p className="text-slate-600">Obteniendo información del abogado</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !attorney) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-white flex items-center justify-center mt-20">
          <div className="text-center">
            <h2 className="text-2xl font-medium text-slate-800 mb-4">
              {error || 'Abogado no encontrado'}
            </h2>
            <p className="text-slate-600 mb-6">
              {error === 'Abogado no encontrado' 
                ? 'El abogado que buscas no existe o no está disponible.'
                : 'Ocurrió un error al cargar la información. Por favor, intenta de nuevo.'}
            </p>
            <button
              onClick={() => router.push('/equipo')}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center gap-2 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Equipo
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const attorneyServices = getAttorneyServices();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-slate-50 to-slate-100 py-16 mt-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Back Button */}
            <button
              onClick={() => router.push('/equipo')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors duration-300 mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Volver al Equipo</span>
            </button>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Attorney Photo */}
              <div className="relative">
                <div className="relative bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl overflow-hidden aspect-[3/4] shadow-2xl">
                  {attorney.imagenUrl ? (
                    <Image
                      src={attorney.imagenUrl}
                      alt={attorney.nombre}
                      fill
                      className="object-cover object-center"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                      <div className="text-8xl font-bold text-slate-600">
                        {attorney.nombre.split(' ')[0]?.[0]}{attorney.nombre.split(' ')[1]?.[0]}
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </div>

              {/* Attorney Info */}
              <div className="space-y-8">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-4xl md:text-5xl font-serif font-light text-slate-800 mb-2">
                        {attorney.nombre}
                      </h1>
                      <p className="text-2xl text-amber-600 mb-4">
                        {attorney.cargo}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {attorney.esSocio && (
                        <span className="bg-amber-100 text-amber-800 px-4 py-2 text-sm font-medium rounded-full">
                          Socio Fundador
                        </span>
                      )}
                      <FavoriteAttorneyButton
                        attorneyId={attorney.id}
                        size="lg"
                        showText
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-slate-600 mb-6">
                    <div className="flex items-center">
                      <Briefcase className="w-5 h-5 mr-2 text-amber-600" />
                      <span>{attorney.experienciaAnios || 0} años de experiencia</span>
                    </div>
                    {attorney.idiomas && attorney.idiomas.length > 0 && (
                      <div className="flex items-center">
                        <Languages className="w-5 h-5 mr-2 text-amber-600" />
                        <span>{attorney.idiomas.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Biography */}
                {attorney.biografia && (
                  <div className="prose prose-slate max-w-none">
                    <p className="text-lg text-slate-600 leading-relaxed">
                      {attorney.biografia}
                    </p>
                  </div>
                )}

                {/* Contact Information */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-amber-600" />
                    Información de Contacto
                  </h3>
                  <div className="space-y-3">
                    {attorney.correo && (
                      <a 
                        href={`mailto:${attorney.correo}`}
                        className="flex items-center text-slate-600 hover:text-amber-600 transition-colors group"
                      >
                        <Mail className="w-5 h-5 mr-3 text-amber-600 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">{attorney.correo}</span>
                      </a>
                    )}
                    {attorney.telefono && (
                      <a 
                        href={`tel:${attorney.telefono}`}
                        className="flex items-center text-slate-600 hover:text-amber-600 transition-colors group"
                      >
                        <Phone className="w-5 h-5 mr-3 text-amber-600 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">{attorney.telefono}</span>
                      </a>
                    )}
                    <div className="flex items-center text-slate-600">
                      <MapPin className="w-5 h-5 mr-3 text-amber-600" />
                      <span className="font-medium">Guadalajara, Jalisco</span>
                    </div>
                    {attorney.linkedIn && (
                      <a 
                        href={attorney.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-slate-600 hover:text-blue-600 transition-colors group"
                      >
                        <Linkedin className="w-5 h-5 mr-3 text-blue-600 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">LinkedIn</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Specializations & Services */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Specializations */}
              <div>
                <h2 className="text-3xl font-serif font-light text-slate-800 mb-8 flex items-center">
                  <Star className="w-6 h-6 mr-3 text-amber-600" />
                  Áreas de Especialización
                </h2>
                <div className="space-y-4">
                  {attorney.especializaciones && attorney.especializaciones.length > 0 ? (
                    attorney.especializaciones.map((spec, index) => (
                      <div key={index} className="bg-slate-50 rounded-lg p-4 border-l-4 border-amber-600">
                        <h3 className="font-semibold text-slate-800 mb-1">{spec}</h3>
                        <p className="text-slate-600 text-sm">Experiencia especializada en {spec.toLowerCase()}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 italic">No se han especificado áreas de especialización.</p>
                  )}
                </div>
              </div>

              {/* Services */}
              <div>
                <h2 className="text-3xl font-serif font-light text-slate-800 mb-8 flex items-center">
                  <Briefcase className="w-6 h-6 mr-3 text-amber-600" />
                  Servicios que Atiende
                </h2>
                {attorneyServices.length > 0 ? (
                  <div className="space-y-4">
                    {attorneyServices.map((service) => {
                      const isExpanded = expandedServices.has(service.id);
                      const hasChildren = service.children && service.children.length > 0;
                      
                      return (
                        <div key={service.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                          {/* Parent Service Card */}
                          <div 
                            className="group relative cursor-pointer"
                            onClick={() => hasChildren ? toggleServiceExpansion(service.id) : router.push(`/services/${service.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`)}
                          >
                            <div className="p-6 bg-gradient-to-r from-white to-slate-50/50">
                              {/* Background Pattern */}
                              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full opacity-20 transform translate-x-8 -translate-y-8 group-hover:scale-125 transition-transform duration-500" />
                              
                              <div className="relative z-10 flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center mb-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                                      <Briefcase className="w-4 h-4 text-white" />
                                    </div>
                                    <h3 className="font-bold text-slate-800 text-lg group-hover:text-amber-700 transition-colors duration-300">
                                      {service.name}
                                    </h3>
                                  </div>
                                  <p className="text-slate-600 text-sm leading-relaxed ml-11">
                                    {service.shortDescription || service.description}
                                  </p>
                                  {hasChildren && (
                                    <div className="flex items-center mt-3 ml-11">
                                      <div className="w-2 h-2 bg-amber-400 rounded-full mr-2" />
                                      <span className="text-xs text-slate-500">
                                        {service.children!.length} sub-servicios disponibles
                                      </span>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                  {hasChildren && (
                                    <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
                                      <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-amber-600 transition-colors duration-300" />
                                    </div>
                                  )}
                                  {!hasChildren && (
                                    <div className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                      <ArrowRight className="w-4 h-4 text-amber-600" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Children Services - Expandable */}
                          {hasChildren && (
                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                              isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                            }`}>
                              <div className="bg-slate-50/50 border-t border-slate-100">
                                <div className="p-4 space-y-3">
                                  {console.log(`Rendering ${service.children!.length} children for ${service.name}:`, service.children!.map(c => c.name))}
                                  {service.children!.map((childService, childIndex) => (
                                    <div 
                                      key={childService.id}
                                      className="group relative bg-white rounded-lg p-4 border border-slate-200/50 hover:border-amber-200 hover:shadow-sm transition-all duration-300 cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/services/${childService.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`);
                                      }}
                                    >
                                      {/* Child Service Content */}
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <div className="flex items-center mb-2">
                                            <div className="w-6 h-6 bg-gradient-to-br from-slate-400 to-slate-500 rounded-md flex items-center justify-center mr-3">
                                              <div className="w-2 h-2 bg-white rounded-full" />
                                            </div>
                                            <h4 className="font-semibold text-slate-800 group-hover:text-amber-700 transition-colors duration-300">
                                              {childService.name}
                                            </h4>
                                          </div>
                                          <p className="text-slate-600 text-sm leading-relaxed ml-9">
                                            {childService.shortDescription || childService.description}
                                          </p>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 ml-4">
                                          <ChevronRight className="w-4 h-4 text-amber-600" />
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
                    <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500 text-lg font-medium mb-2">No hay servicios asignados</p>
                    <p className="text-slate-400 text-sm">Este abogado aún no tiene servicios específicos configurados.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Education & Achievements */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Education */}
              <div>
                <h2 className="text-3xl font-serif font-light text-slate-800 mb-8 flex items-center">
                  <GraduationCap className="w-6 h-6 mr-3 text-amber-600" />
                  Formación Académica
                </h2>
                <div className="space-y-4">
                  {attorney.educacion && attorney.educacion.length > 0 ? (
                    attorney.educacion.map((edu, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                        <p className="text-slate-800 font-medium">{edu}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 italic">No se ha especificado información académica.</p>
                  )}
                </div>
              </div>

              {/* Achievements */}
              <div>
                <h2 className="text-3xl font-serif font-light text-slate-800 mb-8 flex items-center">
                  <Award className="w-6 h-6 mr-3 text-amber-600" />
                  Logros y Reconocimientos
                </h2>
                <div className="space-y-4">
                  {attorney.logros && attorney.logros.length > 0 ? (
                    attorney.logros.map((logro, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 border-l-4 border-l-amber-600">
                        <p className="text-slate-800 font-medium">{logro}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 italic">No se han especificado logros o reconocimientos.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Notable Cases */}
        {attorney.casosDestacados && attorney.casosDestacados.length > 0 && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <h2 className="text-3xl font-serif font-light text-slate-800 mb-8 flex items-center justify-center">
                <Briefcase className="w-6 h-6 mr-3 text-amber-600" />
                Casos Destacados
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {attorney.casosDestacados.map((caso, index) => (
                  <div key={index} className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                    <p className="text-slate-700 leading-relaxed">{caso}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Contact CTA */}
        <section className="py-16 bg-slate-800">
          <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
            <h3 className="text-3xl md:text-4xl font-serif font-light text-white mb-6">
              ¿Necesita asesoría legal especializada?
            </h3>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Contacte directamente con {attorney.nombre.split(' ')[0]} para una consulta personalizada
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {attorney.correo && (
                <a
                  href={`mailto:${attorney.correo}`}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Enviar Email
                </a>
              )}
              {attorney.telefono && (
                <a
                  href={`tel:${attorney.telefono}`}
                  className="border border-white/20 hover:bg-white/10 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Llamar Ahora
                </a>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}