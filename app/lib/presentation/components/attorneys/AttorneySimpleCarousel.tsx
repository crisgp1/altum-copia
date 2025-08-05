'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Attorney } from '@/app/lib/types/Attorney';
import { attorneys } from '@/app/lib/data/attorneys';
import { AttorneyHorizontalCard } from './AttorneyHorizontalCard';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import Image from 'next/image';
import { CardSpacingService } from '@/app/lib/domain/services/CardSpacingService';
import { AnimationConfigService } from '@/app/lib/domain/services/AnimationConfigService';

export const AttorneySimpleCarousel: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedAttorney, setSelectedAttorney] = useState<Attorney | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      <section className="py-16 bg-neutral-50">
        <div className="w-full" style={{ margin: 0, padding: 0 }}>
          {/* Section Header */}
          <div className="text-center mb-12 px-6 lg:px-8">
            <span 
              className="font-normal mb-4 block uppercase tracking-[0.2em] text-sm"
              style={{ color: '#ad866b' }}
            >
              Nuestro Equipo Legal
            </span>
            <h2 
              className="text-slate-800 mb-6"
              style={{
                fontSize: '48px',
                fontWeight: '300',
                lineHeight: '1.2',
                fontFamily: 'Minion Pro, serif'
              }}
            >
              Abogados <span style={{ color: '#ad866b', fontStyle: 'italic' }}>Especialistas</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto font-light">
              Conozca a nuestro equipo de profesionales con décadas de experiencia
            </p>
          </div>

          {/* Simple Cards Container - No Slider */}
          <div className="relative w-full">
            <div 
              className="relative h-[550px] w-full overflow-hidden"
              style={{ margin: 0, padding: 0 }}
            >
              <div className="flex h-full w-full" style={{ gap: `${CardSpacingService.getAttorneyCarouselGap()}px`, margin: 0, padding: 0 }}>
                {attorneys.slice(0, 4).map((attorney, index) => (
                  <AttorneyHorizontalCard
                    key={attorney.id}
                    attorney={attorney}
                    index={index}
                    isExpanded={hoveredIndex === index}
                    onHover={(idx) => setHoveredIndex(idx)}
                    onClick={handleCardClick}
                    totalCards={4}
                    hoveredIndex={hoveredIndex}
                  />
                ))}
              </div>
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
  }, []);

  return (
    <div 
      ref={modalRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        ref={contentRef}
        className="attorney-modal-content relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/90 hover:bg-white transition-colors shadow-lg"
        >
          <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row h-full">
          {/* Left Column - Image */}
          <div className="relative lg:w-2/5 h-64 lg:h-auto">
            <Image
              src={attorney.image}
              alt={attorney.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/50 to-transparent" />
            
            {/* Name Overlay on Image */}
            <div className="absolute bottom-0 left-0 p-8">
              <h2 className="text-4xl font-light text-white mb-2">{attorney.name}</h2>
              <p className="text-amber-400 text-lg">{attorney.position}</p>
              {attorney.isPartner && (
                <span className="inline-block mt-2 bg-amber-600 text-white px-3 py-1 text-xs font-medium uppercase tracking-wider rounded">
                  Socio
                </span>
              )}
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="flex-1 p-8 lg:p-12 overflow-y-auto">
            {/* Quick Info */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center text-slate-600">
                <svg className="w-5 h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{attorney.experience} años de experiencia</span>
              </div>
              <div className="flex items-center text-slate-600">
                <svg className="w-5 h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span>{attorney.languages.join(', ')}</span>
              </div>
            </div>

            {/* Biography */}
            <div className="mb-8">
              <h3 className="text-2xl font-light text-slate-800 mb-4">Biografía</h3>
              <p className="text-slate-600 leading-relaxed">{attorney.bio}</p>
            </div>

            {/* Specializations */}
            <div className="mb-8">
              <h3 className="text-2xl font-light text-slate-800 mb-4">Especialización</h3>
              <div className="flex flex-wrap gap-2">
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