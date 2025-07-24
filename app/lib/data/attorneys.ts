import { Attorney } from '../types/Attorney';

export const attorneys: Attorney[] = [
  {
    id: '1',
    name: 'Dr. María Elena Vásquez',
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
    isPartner: true
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
    isPartner: true
  },
  {
    id: '3',
    name: 'Dra. Ana Sofia Herrera',
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
    isPartner: true
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
    isPartner: false
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
    isPartner: false
  }
];