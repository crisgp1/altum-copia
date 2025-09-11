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

// Color scheme with better contrast and differentiation
const colorSchemes = [
  { 
    bg: '#1a365d', // Deep blue
    accent: '#3182ce', // Blue
    text: '#ffffff'
  },
  { 
    bg: '#2d3748', // Dark gray
    accent: '#4a5568', // Medium gray
    text: '#ffffff'
  },
  { 
    bg: '#2c5530', // Dark green
    accent: '#38a169', // Green
    text: '#ffffff'
  },
  { 
    bg: '#5d2e5d', // Purple
    accent: '#805ad5', // Light purple
    text: '#ffffff'
  },
  { 
    bg: '#744210', // Dark brown
    accent: '#d69e2e', // Gold
    text: '#ffffff'
  }
];

export default function ServiceCardSimple({ 
  category, 
  description, 
  services, 
  icon, 
  index,
  slug 
}: ServiceCardProps) {
  const colorScheme = colorSchemes[index % colorSchemes.length];
  
  return (
    <div 
      className="group relative bg-white rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
        boxShadow: '0 8px 25px -8px rgba(0, 0, 0, 0.12)',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        animationDelay: `${index * 150}ms`
      }}
    >
      {/* Accent line with dynamic color */}
      <div 
        className="absolute top-0 left-0 w-full h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"
        style={{ backgroundColor: colorScheme.accent }}
      />
      
      {/* Responsive padding and spacing */}
      <div className="p-4 sm:p-6 lg:p-8 xl:p-10">
        <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8">
          {/* Icon and Category - Fixed responsive sizing */}
          <div className="flex-shrink-0 lg:w-80">
            <div className="relative mb-4 lg:mb-6">
              {/* Icon container with better mobile sizing */}
              <div 
                className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 text-white flex items-center justify-center rounded-lg sm:rounded-xl shadow-lg transform transition-all duration-500 group-hover:scale-105"
                style={{ 
                  background: `linear-gradient(135deg, ${colorScheme.bg} 0%, ${colorScheme.accent} 100%)`,
                  color: colorScheme.text
                }}
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8">
                  {icon}
                </div>
              </div>
            </div>
            
            {/* Title with improved hierarchy */}
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-3 lg:mb-4 leading-tight">
              {category}
            </h2>
            
            {/* Description with better readability */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed font-normal max-w-md">
              {description}
            </p>
          </div>

          {/* Services List - Improved responsive layout */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4 lg:mb-6 flex items-center">
              <span 
                className="inline-block w-8 sm:w-10 lg:w-12 h-0.5 mr-3 lg:mr-4"
                style={{ backgroundColor: colorScheme.accent }}
              />
              <span className="text-sm sm:text-base lg:text-lg">Servicios Incluidos:</span>
            </h3>
            
            {/* Responsive grid with consistent spacing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 lg:mb-8">
              {services.map((service, serviceIndex) => (
                <div 
                  key={serviceIndex} 
                  className="flex items-start group/item py-1"
                >
                  <div className="relative mr-3 mt-2 flex-shrink-0">
                    <div 
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-transform duration-300 group-hover/item:scale-125" 
                      style={{ backgroundColor: colorScheme.accent }}
                    />
                  </div>
                  <span className="text-sm sm:text-base text-slate-700 leading-relaxed transition-colors duration-300 group-hover/item:text-slate-900 font-normal">
                    {service}
                  </span>
                </div>
              ))}
            </div>
            
            {/* CTA with consistent arrow styling */}
            <a
              href={`/services/${slug}`}
              className="inline-flex items-center group/cta text-sm sm:text-base font-medium transition-colors duration-200"
              style={{ color: colorScheme.accent }}
            >
              <span className="transition-colors duration-200 group-hover/cta:opacity-80">
                Ver detalles y especialistas
              </span>
              <svg
                className="ml-2 sm:ml-3 w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 group-hover/cta:translate-x-1 group-hover/cta:opacity-80"
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

      {/* Subtle corner decoration */}
      <div className="absolute bottom-0 right-0 w-24 h-24 sm:w-32 sm:h-32 opacity-3">
        <svg viewBox="0 0 100 100" fill="currentColor" style={{ color: colorScheme.accent }}>
          <path d="M100 0L100 100L0 100C55.2285 100 100 55.2285 100 0Z" />
        </svg>
      </div>
    </div>
  );
}