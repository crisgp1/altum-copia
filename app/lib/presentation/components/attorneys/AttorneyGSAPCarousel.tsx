'use client';

import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Attorney } from '@/app/lib/types/Attorney';
import { attorneys } from '@/app/lib/data/attorneys';
import { AttorneyGSAPCard } from './AttorneyGSAPCard';
import { createPortal } from 'react-dom';

export const AttorneyGSAPCarousel: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedAttorney, setSelectedAttorney] = useState<Attorney | null>(null);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!cardsContainerRef.current || cardsRef.current.length === 0) return;

    // Initial card positioning
    gsap.set(cardsRef.current, {
      x: (index) => index * 80, // Overlapping cards
      scale: 1,
      transformOrigin: 'left center'
    });
  }, []);

  useEffect(() => {
    if (hoveredIndex === null) {
      // Reset all cards
      gsap.to(cardsRef.current, {
        scale: 1,
        x: (index) => index * 80,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.05
      });
    } else {
      // Animate cards based on hover
      cardsRef.current.forEach((card, index) => {
        if (index === hoveredIndex) {
          // Hovered card expands
          gsap.to(card, {
            scale: 1.1,
            x: index * 100 + 20,
            zIndex: 50,
            duration: 0.5,
            ease: "power3.out"
          });
        } else if (index < hoveredIndex) {
          // Cards before hovered card move left
          gsap.to(card, {
            scale: 0.9,
            x: index * 60 - 20,
            duration: 0.5,
            ease: "power3.out"
          });
        } else {
          // Cards after hovered card move right
          gsap.to(card, {
            scale: 0.9,
            x: index * 60 + 180,
            duration: 0.5,
            ease: "power3.out"
          });
        }
      });
    }
  }, [hoveredIndex]);

  const handleCardClick = (attorney: Attorney) => {
    setSelectedAttorney(attorney);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedAttorney(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <>
      <section className="py-24 bg-neutral-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="font-normal mb-4 block uppercase tracking-wider text-amber-600">
              Nuestro Equipo Legal
            </span>
            <h2 className="text-5xl text-slate-800 mb-6 font-light">
              Abogados <span className="text-amber-600 italic">Especialistas</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Conozca a nuestro equipo de abogados especialistas
            </p>
          </div>

          {/* Cards Container */}
          <div ref={containerRef} className="relative">
            <div 
              ref={cardsContainerRef}
              className="relative h-[500px] flex items-center justify-center"
            >
              <div className="relative flex">
                {attorneys.map((attorney, index) => (
                  <div
                    key={attorney.id}
                    ref={(el) => {
                      if (el) cardsRef.current[index] = el;
                    }}
                    className="absolute"
                    style={{
                      zIndex: index
                    }}
                  >
                    <AttorneyGSAPCard
                      attorney={attorney}
                      index={index}
                      isActive={hoveredIndex === index}
                      onCardHover={setHoveredIndex}
                      onClick={handleCardClick}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedAttorney && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={closeModal}
          />
          <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <AttorneyDetailModal 
              attorney={selectedAttorney}
              onClose={closeModal}
            />
          </div>
        </div>,
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

  useEffect(() => {
    if (!modalRef.current) return;

    const tl = gsap.timeline();
    
    tl.fromTo(modalRef.current,
      { opacity: 0, scale: 0.9, y: 50 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "power3.out" }
    );
  }, []);

  return (
    <div ref={modalRef} className="p-8">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex items-start space-x-6 mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-3xl font-light">
          {attorney.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <h2 className="text-3xl text-slate-800 mb-2">{attorney.name}</h2>
          <p className="text-amber-600 text-lg mb-2">{attorney.position}</p>
          <p className="text-slate-600">{attorney.experience} años de experiencia</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-3">Biografía</h3>
          <p className="text-slate-600 leading-relaxed">{attorney.bio}</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Especialización</h3>
          <div className="flex flex-wrap gap-2">
            {attorney.specialization.map((spec, index) => (
              <span key={index} className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
                {spec}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Contacto</h3>
          <p className="text-slate-600">{attorney.email}</p>
          <p className="text-slate-600">{attorney.phone}</p>
        </div>
      </div>
    </div>
  );
};