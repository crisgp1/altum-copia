'use client';

import React from 'react';

interface ServiceCardProps {
  category: string;
  description: string;
  services: string[];
  icon: React.ReactNode;
  index: number;
  slug: string;
}

export default function ServiceCardSimple({ 
  category, 
  description, 
  services, 
  icon, 
  index,
  slug 
}: ServiceCardProps) {
  return (
    <div 
      className="group relative bg-white rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02]"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
        boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(183, 159, 118, 0.15)',
        animationDelay: `${index * 150}ms`
      }}
    >
      {/* Golden accent line */}
      <div 
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 via-[#B79F76] to-amber-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"
      />
      
      <div className="p-8 lg:p-10">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
          {/* Icon and Category */}
          <div className="flex-shrink-0">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-[#B79F76] to-amber-700 opacity-10 blur-2xl transform scale-150" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-[#152239] to-[#1a2a42] text-white flex items-center justify-center rounded-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                {icon}
              </div>
            </div>
            
            <h2 className="text-2xl lg:text-3xl font-serif font-bold text-[#152239] mb-4 transition-colors duration-300 group-hover:text-[#B79F76]">
              {category}
            </h2>
            
            <p className="text-lg text-slate-600 font-light leading-relaxed max-w-md">
              {description}
            </p>
          </div>

          {/* Services List */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[#152239] mb-6 flex items-center">
              <span className="inline-block w-12 h-0.5 bg-[#B79F76] mr-4" />
              Servicios Incluidos:
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {services.map((service, serviceIndex) => (
                <div 
                  key={serviceIndex} 
                  className="flex items-start group/item"
                >
                  <div className="relative mr-4 mt-2">
                    <div className="absolute inset-0 bg-[#B79F76] opacity-20 blur-sm transform scale-150" />
                    <div className="relative w-2 h-2 bg-gradient-to-br from-[#B79F76] to-amber-700 rounded-full flex-shrink-0 transition-transform duration-300 group-hover/item:scale-125" />
                  </div>
                  <span className="text-slate-600 font-light leading-relaxed transition-colors duration-300 group-hover/item:text-slate-800">
                    {service}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Service Detail Link */}
            <a
              href={`/services/${slug}`}
              className="inline-flex items-center group/cta"
            >
              <span className="text-[#B79F76] font-medium transition-colors duration-200 group-hover/cta:text-[#9C8A6B]">
                Ver detalles y especialistas
              </span>
              <svg
                className="ml-3 w-5 h-5 text-[#B79F76] transition-all duration-300 group-hover/cta:text-[#9C8A6B] group-hover/cta:translate-x-2 group-hover/cta:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Corner decoration */}
      <div className="absolute bottom-0 right-0 w-32 h-32 opacity-5">
        <svg viewBox="0 0 100 100" fill="currentColor" className="text-[#B79F76]">
          <path d="M100 0L100 100L0 100C55.2285 100 100 55.2285 100 0Z" />
        </svg>
      </div>
    </div>
  );
}