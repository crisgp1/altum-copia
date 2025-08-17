'use client';

import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import { Attorney } from '@/app/lib/types/Attorney';
import { AttorneyGSAPCard } from './AttorneyGSAPCard';
import { createPortal } from 'react-dom';

export const AttorneyGSAPCarousel: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedAttorney, setSelectedAttorney] = useState<Attorney | null>(null);
  const [mounted, setMounted] = useState(false);
  const [attorneys, setAttorneys] = useState<Attorney[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchActiveAttorneys();
  }, []);

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

  // Remove old positioning logic since cards are now in horizontal layout

  const handleCardClick = (attorney: Attorney) => {
    setSelectedAttorney(attorney);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    const modal = document.querySelector('.attorney-modal-content');
    if (modal) {
      gsap.to(modal, {
        opacity: 0,
        scale: 0.95,
        y: 20,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setSelectedAttorney(null);
          document.body.style.overflow = 'auto';
        }
      });
    } else {
      setSelectedAttorney(null);
      document.body.style.overflow = 'auto';
    }
  };

  return (
    <>
      <section className="py-12 sm:py-16 pb-16 sm:pb-24 bg-neutral-50">
        <div className="w-full" style={{ margin: 0, padding: 0 }}>
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12 px-4 sm:px-6 lg:px-8">
            <span 
              className="font-normal mb-3 sm:mb-4 block uppercase tracking-[0.2em] text-xs sm:text-sm"
              style={{ color: '#ad866b' }}
            >
              Nuestro Equipo Legal
            </span>
            <h2 
              className="text-slate-800 mb-4 sm:mb-6 text-2xl xs:text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light leading-tight"
              style={{
                fontFamily: 'Minion Pro, serif'
              }}
            >
              Abogados <span style={{ color: '#ad866b', fontStyle: 'italic' }}>Especialistas</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl sm:max-w-3xl mx-auto font-light px-4 sm:px-0">
              Conozca a nuestro equipo de profesionales con décadas de experiencia
            </p>
          </div>

          {/* Cards Container - Fully Responsive */}
          <div className="relative w-full">
            <div
              className="relative w-full overflow-hidden"
              style={{
                height: 'clamp(400px, 50vh, 650px)', // More responsive height range
                margin: 0,
                padding: 0
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Cargando abogados...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
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
                </div>
              ) : attorneys.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <p className="text-slate-600">No hay abogados disponibles en este momento.</p>
                  </div>
                </div>
              ) : (
                <div
                  className="flex h-full w-full"
                  style={{
                    gap: 'clamp(5px, 1vw, 10px)', // Mobile responsive gap
                    margin: 0,
                    padding: 0
                  }}
                >
                  {attorneys.slice(0, 4).map((attorney, index) => (
                    <AttorneyGSAPCard
                      key={attorney.id}
                      attorney={attorney}
                      index={index}
                      isActive={hoveredIndex === index}
                      onCardHover={setHoveredIndex}
                      onClick={handleCardClick}
                      totalCards={Math.min(attorneys.length, 4)}
                      hoveredIndex={hoveredIndex}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Modal Portal */}
      {selectedAttorney && mounted && createPortal(
        <AttorneyDetailModal 
          attorney={selectedAttorney}
          onClose={closeModal}
        />,
        document.body
      )}
    </>
  );
};

// Modal Component
interface AttorneyDetailModalProps {
  attorney: Attorney;
  onClose: () => void;
}

const AttorneyDetailModal: React.FC<AttorneyDetailModalProps> = ({ attorney, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Entrance animation
    const tl = gsap.timeline();
    
    tl.fromTo(modalRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power2.out" }
    )
    .fromTo(contentRef.current,
      { 
        opacity: 0, 
        scale: 0.95, 
        y: 30 
      },
      { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        duration: 0.4, 
        ease: "power3.out" 
      },
      "-=0.1"
    );

    // ESC key handler
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div 
      ref={modalRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        ref={contentRef}
        className="attorney-modal-content relative bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-xs sm:max-w-lg md:max-w-3xl lg:max-w-5xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 sm:top-4 lg:top-6 right-3 sm:right-4 lg:right-6 z-10 w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 flex items-center justify-center rounded-full bg-white/90 hover:bg-white transition-colors shadow-lg"
        >
          <svg className="w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Responsive Layout */}
        <div className="flex flex-col lg:flex-row min-h-full">
          {/* Left Column - Image */}
          <div className="relative lg:w-2/5 h-48 xs:h-56 sm:h-64 lg:h-auto">
            <Image
              src={attorney.image}
              alt={attorney.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/50 to-transparent" />
            
            {/* Name Overlay on Image */}
            <div className="absolute bottom-0 left-0 p-4 sm:p-6 lg:p-8">
              <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-1 sm:mb-2">{attorney.name}</h2>
              <p className="text-amber-400 text-sm sm:text-base lg:text-lg">{attorney.position}</p>
              {attorney.isPartner && (
                <span className="inline-block mt-1 sm:mt-2 bg-amber-600 text-white px-2 sm:px-3 py-1 text-xs font-medium uppercase tracking-wider rounded">
                  Socio
                </span>
              )}
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-12">
            {/* Quick Info */}
            <div className="flex flex-col xs:flex-row xs:flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-8">
              <div className="flex items-center text-slate-600 text-sm sm:text-base">
                <svg className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{attorney.experience} años de experiencia</span>
              </div>
              <div className="flex items-center text-slate-600 text-sm sm:text-base">
                <svg className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span>{attorney.languages.join(', ')}</span>
              </div>
            </div>

            {/* Biography */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-light text-slate-800 mb-3 sm:mb-4">Biografía</h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{attorney.bio}</p>
            </div>

            {/* Specializations */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-light text-slate-800 mb-3 sm:mb-4">Especialización</h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {attorney.specialization.map((spec, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-medium"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-xl font-light text-slate-800 mb-4">Contacto</h3>
              <div className="space-y-3">
                <a href={`mailto:${attorney.email}`} className="flex items-center text-slate-600 hover:text-amber-600 transition-colors">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{attorney.email}</span>
                </a>
                <a href={`tel:${attorney.phone}`} className="flex items-center text-slate-600 hover:text-amber-600 transition-colors">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{attorney.phone}</span>
                </a>
                {attorney.linkedIn && (
                  <a href={attorney.linkedIn} target="_blank" rel="noopener noreferrer" className="flex items-center text-slate-600 hover:text-amber-600 transition-colors">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};