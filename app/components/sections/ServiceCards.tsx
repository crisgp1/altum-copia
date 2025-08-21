'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Service {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  iconUrl?: string;
  parentId?: string;
  order: number;
  isActive: boolean;
}

export default function ServiceCards() {
  const [parentServices, setParentServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [subServices, setSubServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllServices, setShowAllServices] = useState(false);
  const router = useRouter();

  const MAX_VISIBLE_SERVICES = 5;

  useEffect(() => {
    fetchParentServices();
  }, []);

  useEffect(() => {
    if (selectedService) {
      fetchSubServices(selectedService.id);
    }
  }, [selectedService]);

  const fetchParentServices = async () => {
    try {
      const response = await fetch('/api/services?onlyParents=true');
      const data = await response.json();
      console.log('API Response - Parent Services:', data);
      if (data.success) {
        // Double check - only show services without parentId
        const actualParents = data.data.filter((service: Service) => !service.parentId);
        console.log('Filtered Parent Services:', actualParents);
        setParentServices(actualParents);
        if (actualParents.length > 0) {
          setSelectedService(actualParents[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching parent services:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubServices = async (parentId: string) => {
    try {
      const response = await fetch(`/api/services?parentId=${parentId}`);
      const data = await response.json();
      if (data.success) {
        setSubServices(data.data);
      }
    } catch (error) {
      console.error('Error fetching sub services:', error);
    }
  };

  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-gray-500">Cargando servicios...</p>
          </div>
        </div>
      </section>
    );
  }

  if (parentServices.length === 0) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#152239' }}>
              Nuestros Servicios
            </h2>
            <div className="flex items-center justify-center mb-8">
              <button 
                onClick={() => router.push('/services')}
                className="group flex items-center space-x-2 text-lg"
                style={{ color: '#B79F76' }}
              >
                <span>Seleccione un servicio</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <p className="text-gray-500">No hay servicios disponibles</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#152239' }}>
            Nuestros Servicios
          </h2>
          <div className="flex items-center justify-center mb-8">
            <button 
              onClick={() => router.push('/services')}
              className="group flex items-center space-x-2 text-lg hover:opacity-80 transition-opacity"
              style={{ color: '#B79F76' }}
            >
              <span>Ver todos los servicios</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Parent Service Tabs */}
        <div className="flex flex-col items-center gap-4 mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            {(showAllServices ? parentServices : parentServices.slice(0, MAX_VISIBLE_SERVICES)).map((service) => (
              <button
                key={service.id}
                onClick={() => setSelectedService(service)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  selectedService?.id === service.id
                    ? 'text-white shadow-lg transform scale-105'
                    : 'text-gray-700 hover:shadow-md'
                }`}
                style={{
                  backgroundColor: selectedService?.id === service.id ? '#152239' : '#f3f4f6',
                  borderColor: selectedService?.id === service.id ? '#152239' : '#e5e7eb',
                  borderWidth: '2px',
                  borderStyle: 'solid'
                }}
              >
                {service.iconUrl && service.iconUrl.trim() && service.iconUrl !== 'undefined' && service.iconUrl.startsWith('http') ? (
                  <img
                    src={service.iconUrl}
                    alt={service.name}
                    className="w-6 h-6 inline-block mr-2"
                  />
                ) : (
                  <div className="w-6 h-6 bg-slate-300 rounded flex items-center justify-center mr-2">
                    <span className="text-slate-700 font-bold text-xs">{service.name.charAt(0)}</span>
                  </div>
                )}
                {service.name}
              </button>
            ))}
          </div>
          
          {/* Show More/Less Button */}
          {parentServices.length > MAX_VISIBLE_SERVICES && (
            <button
              onClick={() => setShowAllServices(!showAllServices)}
              className="flex items-center space-x-2 text-sm font-medium hover:opacity-80 transition-opacity px-4 py-2 border rounded-lg"
              style={{ 
                color: '#B79F76',
                borderColor: '#B79F76'
              }}
            >
              <span>
                {showAllServices 
                  ? 'Mostrar menos servicios' 
                  : `Ver más servicios (${parentServices.length - MAX_VISIBLE_SERVICES} más)`
                }
              </span>
              <svg 
                className={`w-4 h-4 transition-transform ${showAllServices ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* Selected Service Description */}
        {selectedService && (
          <div className="mb-12 text-center max-w-3xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4" style={{ color: '#152239' }}>
              {selectedService.name}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {selectedService.description}
            </p>
          </div>
        )}

        {/* Sub-services Grid */}
        {subServices.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subServices.map((subService) => (
              <div
                key={subService.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200"
              >
                <div className="flex items-start mb-4">
                  {subService.iconUrl && subService.iconUrl.trim() && subService.iconUrl !== 'undefined' && subService.iconUrl.startsWith('http') ? (
                    <img
                      src={subService.iconUrl}
                      alt={subService.name}
                      className="w-12 h-12 mr-4"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-slate-700 font-bold text-lg">{subService.name.charAt(0)}</span>
                    </div>
                  )}
                  <div>
                    <h4 className="text-lg font-semibold mb-2" style={{ color: '#152239' }}>
                      {subService.name}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {subService.shortDescription}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/services/${subService.id}`)}
                  className="mt-4 text-sm font-medium flex items-center group"
                  style={{ color: '#B79F76' }}
                >
                  <span>Más información</span>
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* No sub-services message */}
        {selectedService && subServices.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No hay servicios específicos disponibles para {selectedService.name}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}