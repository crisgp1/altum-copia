import { Attorney } from '../types/Attorney';

export const attorneys: Attorney[] = [
  {
    id: '1',
    name: 'Lic. María Vásquez',
    position: 'Socia Fundadora',
    specialization: ['Derecho Corporativo', 'Fusiones y Adquisiciones', 'Derecho Mercantil'],
    experience: 28,
    education: [
      'Licenciatura en Derecho - Universidad Nacional Autónoma de México',
      'Maestría en Derecho Corporativo - Universidad Iberoamericana',
      'Doctorado en Derecho Empresarial - Universidad Panamericana'
    ],
    languages: ['Español', 'Inglés', 'Francés'],
    email: 'mvasquez@altumlegal.mx',
    phone: '+52 55 1234-5678',
    bio: 'Reconocida especialista en derecho corporativo con más de 25 años de experiencia. Ha liderado operaciones de fusiones y adquisiciones por más de $2 billones de pesos. Considerada una de las mejores abogadas corporativas de México.',
    achievements: [
      'Reconocida como "Mejor Abogada Corporativa 2023" por Legal 500',
      'Miembro del Consejo Directivo de la Barra Mexicana de Abogados',
      'Profesora invitada en Harvard Law School',
      'Autora de 15 publicaciones especializadas en derecho corporativo'
    ],
    cases: [
      'Fusión estratégica entre Grupo Modelo y AB InBev - $20.1 billones USD',
      'Adquisición de Cemex por parte de LafargeHolcim - $15.8 billones USD',
      'Reestructuración corporativa de Televisa - $8.2 billones USD'
    ],
    linkedIn: 'https://linkedin.com/in/mariaelenavasquez',
    isPartner: true,
    image: '/images/attorneys/attorney1.png',
    shortDescription: 'Abogada corporativa con 28 años de experiencia'
  },
  {
    id: '2',
    name: 'Lic. Roberto Mendoza',
    position: 'Socio Director',
    specialization: ['Litigios Complejos', 'Derecho Penal Empresarial', 'Arbitraje'],
    experience: 22,
    education: [
      'Licenciatura en Derecho - Universidad de las Américas',
      'Maestría en Litigación - Universidad Anáhuac',
      'Certificación en Arbitraje Internacional - ICC París'
    ],
    languages: ['Español', 'Inglés', 'Portugués'],
    email: 'rmendoza@altumlegal.mx',
    phone: '+52 55 1234-5679',
    bio: 'Litigante de élite especializado en casos complejos de alto perfil. Ha ganado el 94% de sus casos en los últimos 10 años. Experto en arbitraje internacional y mediación comercial.',
    achievements: [
      'Ganador del Premio Nacional de Litigación 2022',
      'Árbitro certificado por la Cámara de Comercio Internacional',
      'Conferencista en más de 50 eventos internacionales',
      'Autor del libro "Estrategias Avanzadas en Litigación Comercial"'
    ],
    cases: [
      'Defensa exitosa de Grupo Carso en disputa comercial - $500M MXN',
      'Arbitraje internacional Pemex vs Shell - $1.2B USD',
      'Litigio laboral masivo América Móvil - 15,000 empleados'
    ],
    linkedIn: 'https://linkedin.com/in/robertomendoza',
    isPartner: true,
    image: '/images/attorneys/attorney2.png',
    shortDescription: 'Litigante especializado con 22 años de experiencia'
  },
  {
    id: '3',
    name: 'Lic. Ana Herrera',
    position: 'Socia Senior',
    specialization: ['Derecho Fiscal', 'Planeación Tributaria', 'Defensa Fiscal'],
    experience: 18,
    education: [
      'Licenciatura en Derecho - ITAM',
      'Maestría en Derecho Fiscal - Universidad de Guadalajara',
      'Doctorado en Tributación Internacional - Universidad Complutense Madrid'
    ],
    languages: ['Español', 'Inglés', 'Alemán'],
    email: 'aherrera@altumlegal.mx',
    phone: '+52 55 1234-5680',
    bio: 'Experta reconocida en derecho fiscal y planeación tributaria. Ha ayudado a empresas a ahorrar más de $5 billones de pesos en optimización fiscal legal. Consultora del SAT en reformas fiscales.',
    achievements: [
      'Consultora oficial del Servicio de Administración Tributaria',
      'Miembro del Colegio de Contadores Públicos',
      'Reconocimiento a la Excelencia Profesional 2023',
      'Especialista certificada en precios de transferencia'
    ],
    cases: [
      'Planeación fiscal Grupo Bimbo - Ahorro $800M MXN anuales',
      'Defensa fiscal exitosa Walmart México - $2.1B MXN',
      'Reestructura tributaria Grupo Salinas - $450M MXN'
    ],
    linkedIn: 'https://linkedin.com/in/anasofiaherrera',
    isPartner: true,
    image: '/images/attorneys/attorney3.png',
    shortDescription: 'Experta en derecho fiscal con 18 años de experiencia'
  },
  {
    id: '4',
    name: 'Lic. Carlos Ruiz',
    position: 'Asociado Senior',
    specialization: ['Propiedad Intelectual', 'Derecho Tecnológico', 'Protección de Datos'],
    experience: 12,
    education: [
      'Licenciatura en Derecho - Universidad Iberoamericana',
      'Maestría en Propiedad Intelectual - UNAM',
      'Certificación en Derecho Digital - MIT'
    ],
    languages: ['Español', 'Inglés', 'Japonés'],
    email: 'cruiz@altumlegal.mx',
    phone: '+52 55 1234-5681',
    bio: 'Especialista de nueva generación en propiedad intelectual y derecho tecnológico. Ha registrado más de 500 marcas y patentes. Experto en regulación de startups y fintech.',
    achievements: [
      'Certificado en Derecho Digital por MIT',
      'Asesor legal de 15 startups unicornio mexicanas',
      'Conferencista TEDx sobre Propiedad Intelectual',
      'Miembro de la Asociación Internacional de Derecho Tecnológico'
    ],
    cases: [
      'Registro y protección de marca Kavak - Valoración $8.7B USD',
      'Defensa de patentes Clip vs competidores - 25 patentes',
      'Estructura legal completa Konfío - Regulación fintech'
    ],
    linkedIn: 'https://linkedin.com/in/carlosruiz',
    isPartner: false,
    image: '/images/attorneys/attorney4.png',
    shortDescription: 'Especialista en propiedad intelectual y derecho tecnológico'
  },
  {
    id: '5',
    name: 'Lic. Patricia Morales',
    position: 'Asociada Senior',
    specialization: ['Derecho Laboral', 'Seguridad Social', 'Relaciones Industriales'],
    experience: 15,
    education: [
      'Licenciatura en Derecho - Universidad La Salle',
      'Maestría en Derecho Laboral - Universidad del Valle de México',
      'Especialización en Seguridad Social - IMSS'
    ],
    languages: ['Español', 'Inglés'],
    email: 'pmorales@altumlegal.mx',
    phone: '+52 55 1234-5682',
    bio: 'Especialista en derecho laboral con amplia experiencia en relaciones industriales. Ha manejado más de 2,000 casos laborales con 96% de éxito. Experta en reestructuras corporativas.',
    achievements: [
      'Certificación en Mediación Laboral por STPS',
      'Consultora de la Secretaría del Trabajo',
      'Premio Nacional de Derecho Laboral 2021',
      'Autora de "Manual de Relaciones Industriales"'
    ],
    cases: [
      'Reestructura laboral FEMSA - 45,000 empleados',
      'Negociación colectiva Grupo México - 12 sindicatos',
      'Auditoría laboral completa Grupo Elektra - Cumplimiento 100%'
    ],
    linkedIn: 'https://linkedin.com/in/patriciamorales',
    isPartner: false,
    image: '/images/attorneys/attorney1.png',
    shortDescription: 'Especialista en derecho laboral con 15 años de experiencia'
  },
  {
    id: '6',
    name: 'Lic. Eduardo Silva',
    position: 'Asociado',
    specialization: ['Derecho Inmobiliario', 'Contratos', 'Derecho Civil'],
    experience: 8,
    education: [
      'Licenciatura en Derecho - Universidad Panamericana',
      'Especialización en Derecho Inmobiliario - UNAM'
    ],
    languages: ['Español', 'Inglés'],
    email: 'esilva@altumlegal.mx',
    phone: '+52 55 1234-5683',
    bio: 'Especialista en derecho inmobiliario con experiencia en desarrollos comerciales y residenciales. Ha participado en transacciones inmobiliarias por más de $800 millones de pesos.',
    achievements: [
      'Especialista certificado en derecho inmobiliario',
      'Asesor de 20+ desarrollos inmobiliarios',
      'Experto en contratos de compraventa'
    ],
    cases: [
      'Desarrollo Torres del Pedregal - $350M MXN',
      'Complejo comercial Santa Fe - $280M MXN',
      'Proyecto residencial Polanco - $150M MXN'
    ],
    linkedIn: 'https://linkedin.com/in/eduardosilva',
    isPartner: false,
    image: '/images/attorneys/attorney2.png',
    shortDescription: 'Especialista en derecho inmobiliario con 8 años de experiencia'
  },
  {
    id: '7',
    name: 'Dra. Sofía Martínez',
    position: 'Socia',
    specialization: ['Derecho Ambiental', 'Compliance', 'Regulación'],
    experience: 16,
    education: [
      'Licenciatura en Derecho - Universidad Iberoamericana',
      'Maestría en Derecho Ambiental - El Colegio de México',
      'Doctorado en Derecho Regulatorio - Universidad de Barcelona'
    ],
    languages: ['Español', 'Inglés', 'Catalán'],
    email: 'smartinez@altumlegal.mx',
    phone: '+52 55 1234-5684',
    bio: 'Experta en derecho ambiental y compliance regulatorio. Ha liderado casos de impacto ambiental para grandes corporaciones mexicanas.',
    achievements: [
      'Doctora en Derecho Regulatorio',
      'Consultora SEMARNAT',
      'Experta en compliance ambiental',
      'Autora de "Derecho Ambiental Mexicano"'
    ],
    cases: [
      'Proyecto eólico Oaxaca - 500MW',
      'Evaluación ambiental Pemex - $2B USD',
      'Compliance Grupo México - Certificación ISO'
    ],
    linkedIn: 'https://linkedin.com/in/sofiamartinez',
    isPartner: true,
    image: '/images/attorneys/attorney3.png',
    shortDescription: 'Experta en derecho ambiental con 16 años de experiencia'
  },
  {
    id: '8',
    name: 'Lic. Fernando Castillo',
    position: 'Asociado Senior',
    specialization: ['Derecho Bancario', 'Fintech', 'Regulación Financiera'],
    experience: 11,
    education: [
      'Licenciatura en Derecho - ITAM',
      'Maestría en Derecho Bancario - Universidad Anáhuac'
    ],
    languages: ['Español', 'Inglés'],
    email: 'fcastillo@altumlegal.mx',
    phone: '+52 55 1234-5685',
    bio: 'Especialista en derecho bancario y regulación fintech. Ha asesorado a más de 30 instituciones financieras en México.',
    achievements: [
      'Experto en regulación fintech',
      'Asesor de 30+ instituciones financieras',
      'Certificado en compliance bancario'
    ],
    cases: [
      'Licencia fintech Kueski - $500M USD valuation',
      'Regulación bancaria BBVA México - Compliance',
      'Estructura legal Albo - Neobank licensing'
    ],
    linkedIn: 'https://linkedin.com/in/fernandocastillo',
    isPartner: false,
    image: '/images/attorneys/attorney4.png',
    shortDescription: 'Especialista en derecho bancario y fintech con 11 años de experiencia'
  },
  {
    id: '9',
    name: 'Dra. Valentina López',
    position: 'Socia',
    specialization: ['Derecho de Competencia', 'Antimonopolio', 'Regulación'],
    experience: 19,
    education: [
      'Licenciatura en Derecho - Universidad de Guadalajara',
      'Maestría en Derecho de Competencia - Universidad Complutense Madrid',
      'Doctorado en Antimonopolio - Georgetown University'
    ],
    languages: ['Español', 'Inglés', 'Italiano'],
    email: 'vlopez@altumlegal.mx',
    phone: '+52 55 1234-5686',
    bio: 'Experta en derecho de competencia económica y antimonopolio. Ha representado a grandes corporaciones ante COFECE.',
    achievements: [
      'Doctora en Antimonopolio por Georgetown',
      'Ex-consultora COFECE',
      'Experta en fusiones y adquisiciones',
      'Reconocimiento Nacional de Competencia Económica 2022'
    ],
    cases: [
      'Fusión Walmart-Bodega Aurrera - Aprobación COFECE',
      'Defensa antimonopolio Grupo Carso - $1.5B USD',
      'Concentración América Móvil-Nextel - Regulación'
    ],
    linkedIn: 'https://linkedin.com/in/valentinalopez',
    isPartner: true,
    image: '/images/attorneys/attorney1.png',
    shortDescription: 'Experta en derecho de competencia con 19 años de experiencia'
  },
  {
    id: '10',
    name: 'Lic. Diego Moreno',
    position: 'Asociado',
    specialization: ['Derecho Penal', 'Compliance Penal', 'Investigaciones'],
    experience: 7,
    education: [
      'Licenciatura en Derecho - Universidad La Salle',
      'Especialización en Derecho Penal - UNAM'
    ],
    languages: ['Español', 'Inglés'],
    email: 'dmoreno@altumlegal.mx',
    phone: '+52 55 1234-5687',
    bio: 'Especialista en derecho penal empresarial y compliance. Ha defendido casos de alto perfil en el ámbito corporativo.',
    achievements: [
      'Especialista en derecho penal empresarial',
      'Certificado en compliance penal',
      'Defensor en 50+ casos penales corporativos'
    ],
    cases: [
      'Defensa penal Grupo Elektra - Lavado de dinero',
      'Compliance penal Cemex - Programa anticorrupción',
      'Investigación interna Televisa - Due diligence'
    ],
    linkedIn: 'https://linkedin.com/in/diegomoreno',
    isPartner: false,
    image: '/images/attorneys/attorney2.png',
    shortDescription: 'Especialista en derecho penal empresarial con 7 años de experiencia'
  },
  {
    id: '11',
    name: 'Lic. Isabella Vega',
    position: 'Asociada Senior',
    specialization: ['Derecho de Salud', 'Regulación Farmacéutica', 'Biotecnología'],
    experience: 13,
    education: [
      'Licenciatura en Derecho - Universidad Iberoamericana',
      'Maestría en Derecho Sanitario - Universidad Complutense Madrid'
    ],
    languages: ['Español', 'Inglés', 'Francés'],
    email: 'ivega@altumlegal.mx',
    phone: '+52 55 1234-5688',
    bio: 'Especialista en derecho sanitario y regulación farmacéutica. Ha asesorado a las principales farmacéuticas del país.',
    achievements: [
      'Experta en regulación COFEPRIS',
      'Asesora de 15+ farmacéuticas',
      'Especialista en biotecnología'
    ],
    cases: [
      'Registro sanitario Pfizer México - COVID vaccines',
      'Regulación biotecnología Roche - Productos oncológicos',
      'Compliance COFEPRIS Novartis - Medicamentos especializados'
    ],
    linkedIn: 'https://linkedin.com/in/isabellavega',
    isPartner: false,
    image: '/images/attorneys/attorney3.png',
    shortDescription: 'Especialista en derecho de salud con 13 años de experiencia'
  }
];