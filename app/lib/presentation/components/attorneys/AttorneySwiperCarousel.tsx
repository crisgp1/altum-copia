'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Glide from '@glidejs/glide';
import { Attorney } from '@/app/lib/types/Attorney';
import { createPortal } from 'react-dom';
import { X, Mail, Phone, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

// Import Glide styles
import '@glidejs/glide/dist/css/glide.core.min.css';
import '@glidejs/glide/dist/css/glide.theme.min.css';
import './glide-styles.css';

// Modal Component
interface AttorneyModalProps {
  attorney: Attorney;
  onClose: () => void;
}

const AttorneyModal: React.FC<AttorneyModalProps> = ({ attorney, onClose }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        <div className="flex flex-col lg:flex-row">
          {/* Image Section */}
          <div className="lg:w-2/5 relative h-72 lg:h-auto min-h-[400px] bg-gradient-to-br from-slate-100 to-slate-200">
            {attorney.image && !attorney.image.includes('default') ? (
              <Image
                src={attorney.image}
                alt={attorney.name}
                fill
                className="object-cover rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-7xl font-light text-slate-400 mb-2">
                    {attorney.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <p className="text-sm text-slate-500">Sin fotografía</p>
                </div>
              </div>
            )}
            
            {/* Name Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <h2 className="text-3xl font-light text-white mb-1">{attorney.name}</h2>
              <p className="text-amber-300 text-lg">{attorney.position}</p>
              {attorney.isPartner && (
                <span className="inline-block mt-2 bg-white/20 backdrop-blur text-white px-3 py-1 text-xs font-medium uppercase tracking-wider rounded">
                  Socio Fundador
                </span>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6 lg:p-8">
            {/* Quick Info */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center text-slate-600">
                <div className="w-2 h-2 bg-amber-600 rounded-full mr-2"></div>
                <span className="text-sm font-medium">{attorney.experience} años de experiencia</span>
              </div>
              {attorney.languages && attorney.languages.length > 0 && (
                <div className="flex items-center text-slate-600">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mr-2"></div>
                  <span className="text-sm font-medium">{attorney.languages.join(', ')}</span>
                </div>
              )}
            </div>

            {/* Biography */}
            {attorney.bio && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-3">Biografía</h3>
                <p className="text-slate-600 leading-relaxed">{attorney.bio}</p>
              </div>
            )}

            {/* Specializations */}
            {attorney.specialization && attorney.specialization.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-3">Áreas de práctica</h3>
                <div className="flex flex-wrap gap-2">
                  {attorney.specialization.map((spec, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact */}
            <div className="bg-slate-50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Información de contacto</h3>
              <div className="space-y-3">
                {attorney.email && (
                  <a href={`mailto:${attorney.email}`} className="flex items-center text-slate-600 hover:text-amber-600 transition-colors">
                    <Mail className="w-4 h-4 mr-3 text-amber-600" />
                    <span className="text-sm font-medium">{attorney.email}</span>
                  </a>
                )}
                {attorney.phone && (
                  <a href={`tel:${attorney.phone}`} className="flex items-center text-slate-600 hover:text-amber-600 transition-colors">
                    <Phone className="w-4 h-4 mr-3 text-amber-600" />
                    <span className="text-sm font-medium">{attorney.phone}</span>
                  </a>
                )}
                <div className="flex items-center text-slate-600">
                  <MapPin className="w-4 h-4 mr-3 text-amber-600" />
                  <span className="text-sm font-medium">Guadalajara, Jalisco</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AttorneyGlideCarousel: React.FC = () => {
  const [attorneys, setAttorneys] = useState<Attorney[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAttorney, setSelectedAttorney] = useState<Attorney | null>(null);
  const [mounted, setMounted] = useState(false);
  const glideRef = useRef<HTMLDivElement>(null);
  const glideInstance = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
    fetchActiveAttorneys();
  }, []);

  useEffect(() => {
    if (!loading && attorneys.length > 0 && glideRef.current && !glideInstance.current) {
      glideInstance.current = new Glide(glideRef.current, {
        type: 'carousel',
        startAt: 0,
        perView: 3,
        gap: 32,
        autoplay: 5000,
        hoverpause: true,
        animationDuration: 600,
        dragThreshold: 120, // Increase drag threshold to prevent accidental drag
        swipeThreshold: 80, // Increase swipe threshold
        touchRatio: 0.5, // Reduce touch sensitivity
        breakpoints: {
          1024: {
            perView: 3,
            gap: 32
          },
          768: {
            perView: 2,
            gap: 24
          },
          640: {
            perView: 1,
            gap: 20
          }
        }
      });
      glideInstance.current.mount();
    }

    return () => {
      if (glideInstance.current) {
        glideInstance.current.destroy();
        glideInstance.current = null;
      }
    };
  }, [loading, attorneys.length]);

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
        experience: attorney.experienciaAnios || 0,
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
        shortDescription: attorney.descripcionCorta
      }));
      
      setAttorneys(mappedAttorneys);
    } catch (err) {
      console.error('Error fetching attorneys:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (attorney: Attorney, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log('Card clicked:', attorney.name);
    
    // Add small delay to ensure click is not during carousel transition
    setTimeout(() => {
      setSelectedAttorney(attorney);
      document.body.style.overflow = 'hidden';
    }, 50);
  };

  const closeModal = () => {
    setSelectedAttorney(null);
    document.body.style.overflow = 'auto';
  };

  // Placeholder images for attorneys without photos
  const getPlaceholderImage = (index: number) => {
    const placeholders = [
      'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1559526324-593bc073d938?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1582896911227-c966f6e7fb93?w=400&h=500&fit=crop'
    ];
    return placeholders[index % placeholders.length];
  };

  if (loading) {
    return (
      <section className="py-16 sm:py-20 bg-white">
        <div className="flex items-center justify-center h-[500px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Cargando equipo legal...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || attorneys.length === 0) {
    return (
      <section className="py-16 sm:py-20 bg-white">
        <div className="flex items-center justify-center h-[500px]">
          <div className="text-center">
            <p className="text-slate-600 font-medium">{error || 'No hay abogados disponibles'}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-16 sm:py-20 bg-white">
        <div className="w-full">
          {/* Section Header */}
          <div className="text-center mb-12 px-4 sm:px-6 lg:px-8">
            <span 
              className="text-amber-600 font-semibold text-xs uppercase tracking-[0.15em] mb-3 block"
            >
              Nuestro Equipo Legal
            </span>
            <h2 
              className="text-slate-900 text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            >
              Abogados <span className="text-amber-600">Especialistas</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Conozca a nuestro equipo de profesionales con décadas de experiencia
            </p>
          </div>

          {/* Glide Carousel Container */}
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glide" ref={glideRef}>
              <div className="glide__track" data-glide-el="track">
                <ul className="glide__slides">
                  {attorneys.map((attorney, index) => (
                    <li key={attorney.id} className="glide__slide">
                      <div 
                        className="group cursor-pointer h-full"
                        onClick={(e) => handleCardClick(attorney, e)}
                      >
                        <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 attorney-card">
                          {/* Image Container */}
                          <div className="relative aspect-[4/5] bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                            {attorney.image && !attorney.image.includes('default') && !attorney.image.includes('getty') ? (
                              <Image
                                src={attorney.image}
                                alt={attorney.name}
                                fill
                                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              />
                            ) : (
                              <Image
                                src={getPlaceholderImage(index)}
                                alt={attorney.name}
                                fill
                                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              />
                            )}
                            
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            
                            {/* Partner Badge */}
                            {attorney.isPartner && (
                              <div className="absolute top-4 right-4">
                                <span className="bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                                  Socio
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {/* Content Container */}
                          <div className="attorney-card-content">
                            {/* Name and Position */}
                            <div className="attorney-card-header">
                              <h3 className="attorney-card-name">
                                {attorney.name}
                              </h3>
                              <p className="attorney-card-position">
                                {attorney.position}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Navigation Arrows */}
              <div className="glide__arrows" data-glide-el="controls">
                <button 
                  className="glide__arrow glide__arrow--left absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-slate-50 transition-colors -ml-4 lg:-ml-6"
                  data-glide-dir="<"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="w-6 h-6 text-slate-700" />
                </button>
                <button 
                  className="glide__arrow glide__arrow--right absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-slate-50 transition-colors -mr-4 lg:-mr-6"
                  data-glide-dir=">"
                  aria-label="Siguiente"
                >
                  <ChevronRight className="w-6 h-6 text-slate-700" />
                </button>
              </div>
              
              {/* Bullet Pagination */}
              <div className="glide__bullets" data-glide-el="controls[nav]">
                {attorneys.map((_, index) => (
                  <button 
                    key={index}
                    className="glide__bullet" 
                    data-glide-dir={`=${index}`}
                    aria-label={`Ir al abogado ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Portal */}
      {selectedAttorney && mounted && (
        <>
          {console.log('Rendering modal for:', selectedAttorney.name)}
          {createPortal(
            <AttorneyModal 
              attorney={selectedAttorney}
              onClose={closeModal}
            />,
            document.body
          )}
        </>
      )}
    </>
  );
};