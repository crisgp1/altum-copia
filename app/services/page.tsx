import Navbar from '@/app/components/navigation/Navbar';
import Footer from '@/app/components/sections/Footer';

const services = [
  {
    category: 'DERECHO ADMINISTRATIVO',
    description: 'Especialistas en trámites y procedimientos ante autoridades administrativas.',
    services: [
      'Licencias y permisos municipales',
      'Transparencia',
      'Impugnaciones de multas',
      'Juicios de nulidad',
      'Juicios de créditos fiscales'
    ],
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  },
  {
    category: 'DERECHO NOTARIAL',
    description: 'Servicios notariales especializados para la seguridad jurídica de sus actos.',
    services: [
      'Escrituración de compraventas, donaciones, permuta',
      'Cancelaciones de gravámenes',
      'Sucesiones',
      'Cartas notariales para viaje con menores',
      'Ratificaciones de firmas'
    ],
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    category: 'DERECHO CORPORATIVO',
    description: 'Asesoría integral para empresas y sociedades mercantiles.',
    services: [
      'Constitución de sociedades mercantiles y civiles',
      'Actas de asambleas',
      'Estrategias corporativas',
      'Mediación y conciliación',
      'Comercio electrónico'
    ],
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    category: 'DERECHO FAMILIAR',
    description: 'Protección y defensa de los intereses familiares con sensibilidad y profesionalismo.',
    services: [
      'Divorcios',
      'Pensiones alimenticias',
      'Juicios sucesorios',
      'Testamentarios',
      'Intestamentarios',
      'Patria potestad y custodia de menores',
      'Mediación y/o conciliación'
    ],
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  {
    category: 'DERECHO CIVIL',
    description: 'Soluciones jurídicas para la protección de sus derechos patrimoniales y personales.',
    services: [
      'Contratos',
      'Juicios hipotecarios',
      'Juicios de terminación o rescisión de arrendamiento',
      'Disoluciones de copropiedad',
      'Asociaciones y sociedades civiles',
      'Mediación y/o conciliación',
      'Escrituración de contratos privados de compraventa',
      'Juicios para recuperar la posesión de bienes inmuebles'
    ],
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16l-3-9m3 9l3-9" />
      </svg>
    )
  }
];

// Function to convert service category to slug
const getServiceSlug = (category: string): string => {
  const slugMap: { [key: string]: string } = {
    'DERECHO ADMINISTRATIVO': 'derecho-administrativo',
    'DERECHO NOTARIAL': 'derecho-notarial',
    'DERECHO CORPORATIVO': 'derecho-corporativo',
    'DERECHO FAMILIAR': 'derecho-familiar',
    'DERECHO CIVIL': 'derecho-civil'
  };
  return slugMap[category] || category.toLowerCase().replace(/\s+/g, '-');
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-32 pb-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-stone-50 to-slate-50 py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center">
              <span className="text-amber-700 font-medium text-sm uppercase tracking-wider mb-4 block">
                ALTUM Legal
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-800 mb-6 leading-tight">
                Nuestros <span className="text-amber-700 italic">Servicios</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
                Defensa jurídica con ética, transparencia y compromiso real.
                Soluciones jurídicas claras, honestas y eficaces en todas las áreas del derecho.
              </p>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="space-y-16">
            {services.map((serviceCategory, index) => (
              <div key={serviceCategory.category} className="group">
                <div className="bg-white border border-stone-200 hover:border-amber-200 transition-all duration-300 overflow-hidden">
                  <div className="p-8 lg:p-12">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                      {/* Icon and Category */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-slate-800 text-white flex items-center justify-center group-hover:bg-amber-700 transition-colors duration-300 mb-4">
                          {serviceCategory.icon}
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-serif font-bold text-slate-800 group-hover:text-amber-700 transition-colors duration-300">
                          {serviceCategory.category}
                        </h2>
                        <p className="text-lg text-slate-600 mt-4 font-light leading-relaxed">
                          {serviceCategory.description}
                        </p>
                      </div>

                      {/* Services List */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-800 mb-6">
                          Servicios Incluidos:
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                          {serviceCategory.services.map((service, serviceIndex) => (
                            <div key={serviceIndex} className="flex items-start">
                              <div className="w-1.5 h-1.5 bg-amber-700 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                              <span className="text-slate-600 font-light leading-relaxed">
                                {service}
                              </span>
                            </div>
                          ))}
                        </div>
                        
                        {/* Service Detail Link */}
                        <a
                          href={`/services/${getServiceSlug(serviceCategory.category)}`}
                          className="inline-flex items-center text-amber-700 font-medium hover:text-amber-600 transition-colors duration-200 group"
                        >
                          <span>Ver detalles y especialistas</span>
                          <svg
                            className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
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
                </div>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="text-center mt-16 p-8 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
            <h3 className="text-2xl font-serif font-bold mb-4">
              ¿Necesita Asesoría Legal Especializada?
            </h3>
            <p className="text-lg mb-8 font-light opacity-90">
              En ALTUM Legal trabajamos como un solo equipo para brindar
              la mejor estrategia legal y alcanzar resultados de excelencia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-amber-700 text-white px-8 py-4 font-medium hover:bg-amber-600 transition-colors duration-300 inline-flex items-center justify-center">
                <span>Consulta Gratuita</span>
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <button className="border-2 border-amber-700 text-amber-700 px-8 py-4 font-medium hover:bg-amber-700 hover:text-white transition-colors duration-300 inline-flex items-center justify-center">
                <span>Contactar Ahora</span>
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}