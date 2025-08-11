'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, Mail, Phone, MapPin } from 'lucide-react';
import { attorneys } from '@/app/lib/data/attorneys';
import { Attorney } from '@/app/lib/types/Attorney';

const legalAreas = [
  {
    name: 'Derecho Corporativo',
    description: 'Especialistas en constitución de empresas, fusiones y adquisiciones',
    color: 'amber',
    attorneys: attorneys.filter(attorney => 
      attorney.specialization.some(spec => 
        spec.includes('Corporativo') || spec.includes('Empresarial') || spec.includes('Mercantil')
      )
    )
  },
  {
    name: 'Litigio Estratégico',
    description: 'Expertos en resolución de disputas civiles y comerciales',
    color: 'blue',
    attorneys: attorneys.filter(attorney => 
      attorney.specialization.some(spec => 
        spec.includes('Civil') || spec.includes('Litigio') || spec.includes('Penal')
      )
    )
  },
  {
    name: 'Derecho Fiscal',
    description: 'Asesores en planeación fiscal y defensa tributaria',
    color: 'green',
    attorneys: attorneys.filter(attorney => 
      attorney.specialization.some(spec => 
        spec.includes('Fiscal') || spec.includes('Tributario') || spec.includes('Impuestos')
      )
    )
  },
  {
    name: 'Derecho Laboral',
    description: 'Especialistas en relaciones laborales y seguridad social',
    color: 'purple',
    attorneys: attorneys.filter(attorney => 
      attorney.specialization.some(spec => 
        spec.includes('Laboral') || spec.includes('Trabajo') || spec.includes('Social')
      )
    )
  }
];

export default function EquipoPage() {
  const [selectedAttorney, setSelectedAttorney] = useState<Attorney | null>(attorneys[0] || null);
  const [selectedArea, setSelectedArea] = useState<string>('Derecho Corporativo');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleAttorneySelect = (attorney: Attorney) => {
    if (selectedAttorney?.id === attorney.id) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedAttorney(attorney);
      setIsTransitioning(false);
    }, 300); // Fade out duration
  };

  const handleAreaSelect = (areaName: string) => {
    if (selectedArea === areaName) return;
    
    setSelectedArea(areaName);
    const firstAttorneyInArea = legalAreas.find(area => area.name === areaName)?.attorneys[0];
    if (firstAttorneyInArea) {
      handleAttorneySelect(firstAttorneyInArea);
    }
  };

  const currentArea = legalAreas.find(area => area.name === selectedArea);
  const currentAreaAttorneys = currentArea?.attorneys || [];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section with Featured Attorney */}
      <section className="relative bg-gradient-to-br from-slate-100 to-slate-200 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className={`space-y-8 transition-opacity duration-300 ease-in-out ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}>
              <div>
                <h1 className="text-5xl md:text-6xl font-serif font-light text-slate-800 mb-6">
                  Nuestro Equipo
                </h1>
                <div className="flex items-center space-x-4 mb-8">
                  <div className="flex-1 h-px bg-slate-400"></div>
                  <ArrowRight className="w-5 h-5 text-slate-600" />
                </div>
              </div>
              
              {selectedAttorney && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-light text-slate-800 mb-2">
                      {selectedAttorney.name}
                    </h2>
                    <p className="text-xl text-amber-600 mb-4">
                      {selectedAttorney.position}
                    </p>
                    {selectedAttorney.isPartner && (
                      <span className="inline-block bg-amber-100 text-amber-800 px-3 py-1 text-sm font-medium rounded-full">
                        Socio Fundador
                      </span>
                    )}
                  </div>
                  
                  <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                    {selectedAttorney.bio}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-slate-600">
                      <Mail className="w-5 h-5 mr-3 text-amber-600" />
                      <span>{selectedAttorney.email}</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Phone className="w-5 h-5 mr-3 text-amber-600" />
                      <span>{selectedAttorney.phone}</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <MapPin className="w-5 h-5 mr-3 text-amber-600" />
                      <span>Ciudad de México</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Right - Featured Image with Background Text */}
            <div className="relative">
              {selectedAttorney && (
                <div className={`relative transition-opacity duration-300 ease-in-out ${
                  isTransitioning ? 'opacity-0' : 'opacity-100'
                }`}>
                  {/* Background Text */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl p-8 shadow-2xl">
                    <div className="h-full flex flex-col justify-center space-y-4">
                      <h3 className="text-2xl font-serif font-light text-slate-700 mb-4">
                        {selectedArea}
                      </h3>
                      <p className="text-slate-600 leading-relaxed text-sm">
                        {selectedAttorney.bio}
                      </p>
                      <div className="mt-6 space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {selectedAttorney.specialization.slice(0, 3).map((spec, index) => (
                            <span 
                              key={index}
                              className="bg-slate-400/20 text-slate-700 px-2 py-1 rounded text-xs"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                        <p className="text-slate-500 text-xs">
                          {selectedAttorney.experience} años de experiencia • {selectedAttorney.languages.join(' • ')}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Attorney Image */}
                  <div className="relative bg-gradient-to-br from-slate-300 to-slate-400 rounded-2xl overflow-hidden aspect-[4/5] shadow-2xl ml-8 mt-8">
                    <Image
                      src={selectedAttorney.image}
                      alt={selectedAttorney.name}
                      fill
                      className="object-cover object-center"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Legal Areas Navigation - Smart Tabs */}
      <section className="py-8 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-light text-slate-800 mb-2">
              Áreas de Práctica
            </h2>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {legalAreas.map((area) => (
              <button
                key={area.name}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                  selectedArea === area.name
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700'
                }`}
                onClick={() => handleAreaSelect(area.name)}
              >
                <span>{area.name}</span>
                <div className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${
                  selectedArea === area.name 
                    ? 'bg-amber-600 text-white' 
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {area.attorneys.length}
                </div>
              </button>
            ))}
          </div>
          
          
        </div>
      </section>

      {/* Team Grid Section - Filtered by Area */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8 justify-items-center">
            {currentAreaAttorneys.map((attorney, index) => (
              <div
                key={attorney.id}
                className={`group cursor-pointer transition-all duration-300 ${
                  selectedAttorney?.id === attorney.id 
                    ? 'ring-4 ring-amber-200' 
                    : 'hover:ring-2 hover:ring-amber-100'
                }`}
                onClick={() => handleAttorneySelect(attorney)}
              >
                <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl overflow-hidden aspect-[4/5] shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Image
                    src={attorney.image}
                    alt={attorney.name}
                    fill
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Overlay Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="font-medium text-lg leading-tight">
                      {attorney.name}
                    </h3>
                    <p className="text-amber-200 text-sm">
                      {attorney.position}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {attorney.specialization.slice(0, 2).map((spec, specIndex) => (
                        <span
                          key={specIndex}
                          className="bg-white/20 backdrop-blur-sm px-2 py-1 text-xs rounded-full"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Name below image for mobile */}
                <div className="mt-4 text-center lg:hidden">
                  <h3 className="font-medium text-slate-800">
                    {attorney.name}
                  </h3>
                  <p className="text-amber-600 text-sm">
                    {attorney.position}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Contact CTA */}
      <section className="py-24 bg-slate-800">
        <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
          <h3 className="text-3xl md:text-4xl font-serif font-light text-white mb-6">
            ¿Necesita asesoría legal especializada?
          </h3>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Nuestro equipo está preparado para brindarle la mejor representación legal
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300">
              Agendar Consulta
            </button>
            <button className="border border-white/20 hover:bg-white/10 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300">
              Más Información
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}