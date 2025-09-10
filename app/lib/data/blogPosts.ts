import { BlogPost, BlogPostProps, PostStatus } from '../domain/entities/BlogPost';

// Sample blog posts for ALTUM Legal - Sophisticated legal content
export const sampleBlogPosts: BlogPostProps[] = [
  {
    id: "post_1",
    title: "Nuevas Reformas al Código de Comercio: Impacto en las Fusiones y Adquisiciones",
    slug: "reformas-codigo-comercio-fusiones-adquisiciones-2024",
    excerpt: "Analizamos las recientes modificaciones al marco regulatorio comercial y su impacto directo en las operaciones de M&A en México durante 2024.",
    content: `
      <h2>Panorama Regulatorio Actual</h2>
      <p>Las reformas recientes al Código de Comercio han introducido cambios significativos que afectan directamente las operaciones de fusiones y adquisiciones en México. Estas modificaciones representan un paso hacia la modernización del marco jurídico empresarial.</p>
      
      <h3>Principales Modificaciones</h3>
      <ul>
        <li>Nuevos requisitos de divulgación en transacciones corporativas</li>
        <li>Procedimientos simplificados para fusiones de sociedades</li>
        <li>Mayor protección a accionistas minoritarios</li>
        <li>Requisitos adicionales de due diligence</li>
      </ul>
      
      <h3>Impacto en la Práctica Legal</h3>
      <p>Los despachos de abogados especialistas en derecho corporativo deben adaptar sus estrategias para cumplir con los nuevos requerimientos. Esto incluye la implementación de procesos más rigurosos de revisión documental y evaluación de riesgos.</p>
      
      <blockquote>"La adaptación a estas reformas no es opcional; es una necesidad imperativa para mantener la competitividad en el mercado legal corporativo." - ALTUM Legal</blockquote>
      
      <h3>Recomendaciones Estratégicas</h3>
      <p>Para las empresas que planean operaciones de M&A, recomendamos una revisión exhaustiva de sus estructuras corporativas actuales y la implementación de las nuevas mejores prácticas antes del cierre del año fiscal.</p>
    `,
    featuredImage: "/images/blog/legal-reform-2024.jpg",
    authorId: "author_1",
    categoryId: "derecho-corporativo",
    tags: ["Fusiones", "Adquisiciones", "Código de Comercio", "Reforma Legal", "M&A"],
    status: PostStatus.PUBLISHED,
    publishedAt: new Date("2024-01-15"),
    seoTitle: "Reformas Código de Comercio 2024: Guía Completa para M&A | ALTUM Legal",
    seoDescription: "Guía experta sobre las nuevas reformas al Código de Comercio y su impacto en fusiones y adquisiciones. Consultoría legal especializada en México.",
    viewCount: 2847,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-15")
  },
  {
    id: "post_2", 
    title: "Protección de Datos Personales en el Entorno Digital: Marco Legal 2024",
    slug: "proteccion-datos-personales-marco-legal-2024",
    excerpt: "Una guía completa sobre las obligaciones empresariales en materia de protección de datos personales y las mejores prácticas para el cumplimiento normativo.",
    content: `
      <h2>El Panorama Actual de la Protección de Datos</h2>
      <p>En un mundo cada vez más digitalizado, la protección de datos personales se ha convertido en una prioridad fundamental para las empresas mexicanas. La Ley Federal de Protección de Datos Personales en Posesión de los Particulares establece un marco robusto que requiere atención especializada.</p>
      
      <h3>Obligaciones Principales</h3>
      <p>Las empresas deben implementar medidas técnicas y organizacionales apropiadas para garantizar la seguridad de los datos personales:</p>
      
      <ul>
        <li>Elaboración de avisos de privacidad claros y accesibles</li>
        <li>Implementación de medidas de seguridad física y técnica</li>
        <li>Designación de un responsable de protección de datos</li>
        <li>Establecimiento de procedimientos para ejercicio de derechos ARCO</li>
      </ul>
      
      <h3>Sanciones y Consecuencias</h3>
      <p>El incumplimiento puede resultar en sanciones económicas significativas y daño reputacional. Las multas pueden alcanzar hasta el 2% de los ingresos anuales de la empresa.</p>
      
      <h3>Estrategias de Cumplimiento</h3>
      <p>Recomendamos una aproximación integral que incluya auditorías regulares, capacitación del personal y actualización constante de políticas internas.</p>
    `,
    featuredImage: "/images/blog/data-protection-2024.jpg",
    authorId: "author_2",
    categoryId: "derecho-digital",
    tags: ["Protección de Datos", "LFPDPPP", "Privacidad", "Compliance", "Tecnología"],
    status: PostStatus.PUBLISHED,
    publishedAt: new Date("2024-01-20"),
    seoTitle: "Protección de Datos Personales México 2024: Guía Legal Completa",
    seoDescription: "Guía experta sobre protección de datos personales en México. Cumplimiento normativo y mejores prácticas legales para empresas.",
    viewCount: 1923,
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-20")
  },
  {
    id: "post_3",
    title: "Contratos Internacionales: Cláusulas Esenciales y Jurisdicción Aplicable",
    slug: "contratos-internacionales-clausulas-jurisdiccion-2024",
    excerpt: "Análisis profundo de las cláusulas críticas en contratos internacionales y la determinación de la jurisdicción aplicable en disputas comerciales transfronterizas.",
    content: `
      <h2>La Complejidad de los Contratos Internacionales</h2>
      <p>Los contratos internacionales presentan desafíos únicos que requieren una comprensión profunda de múltiples sistemas legales y consideraciones culturales. La redacción precisa de cláusulas es fundamental para el éxito comercial.</p>
      
      <h3>Cláusulas Esenciales</h3>
      <h4>1. Ley Aplicable</h4>
      <p>La determinación de qué ley regirá el contrato es crucial. Debe considerarse:</p>
      <ul>
        <li>Naturaleza de la relación comercial</li>
        <li>Ubicación de las partes</li>
        <li>Lugar de ejecución del contrato</li>
        <li>Convenciones internacionales aplicables</li>
      </ul>
      
      <h4>2. Resolución de Disputas</h4>
      <p>Las opciones incluyen:</p>
      <ul>
        <li>Arbitraje internacional (ICC, LCIA, UNCITRAL)</li>
        <li>Mediación comercial</li>
        <li>Jurisdicción de tribunales específicos</li>
      </ul>
      
      <h3>Consideraciones Especiales</h3>
      <p>Los contratos internacionales deben contemplar factores como fluctuaciones cambiarias, restricciones de importación/exportación, y compliance con regulaciones locales.</p>
      
      <h3>Mejores Prácticas</h3>
      <p>Recomendamos una revisión exhaustiva con especialistas en derecho internacional para garantizar la protección adecuada de los intereses comerciales.</p>
    `,
    featuredImage: "/images/blog/international-contracts.jpg",
    authorId: "author_3",
    categoryId: "derecho-internacional",
    tags: ["Contratos Internacionales", "Arbitraje", "Derecho Internacional", "Comercio Exterior"],
    status: PostStatus.PUBLISHED,
    publishedAt: new Date("2024-01-25"),
    seoTitle: "Contratos Internacionales: Guía Legal Experta | ALTUM Legal",
    seoDescription: "Asesoría especializada en contratos internacionales. Cláusulas esenciales, jurisdicción y mejores prácticas legales.",
    viewCount: 1654,
    createdAt: new Date("2024-01-22"),
    updatedAt: new Date("2024-01-25")
  },
  {
    id: "post_4",
    title: "Aspectos Tributarios en Reestructuraciones Corporativas: Estrategias de Optimización",
    slug: "aspectos-tributarios-reestructuraciones-corporativas-2024",
    excerpt: "Guía especializada sobre las implicaciones fiscales en procesos de reestructuración corporativa y estrategias para la optimización tributaria legal.",
    content: `
      <h2>Reestructuraciones Corporativas y Optimización Fiscal</h2>
      <p>Las reestructuraciones corporativas ofrecen oportunidades significativas para la optimización tributaria, pero requieren una planificación cuidadosa para evitar consecuencias fiscales adversas.</p>
      
      <h3>Tipos de Reestructuración</h3>
      <h4>Fusiones</h4>
      <p>Las fusiones pueden estructurarse para diferir el reconocimiento de ganancias, pero deben cumplir requisitos específicos del SAT.</p>
      
      <h4>Escisiones</h4>
      <p>Permiten la división de activos y pasivos de manera eficiente desde el punto de vista fiscal, especialmente útiles para:</p>
      <ul>
        <li>Separación de líneas de negocio</li>
        <li>Preparación para venta de subsidiarias</li>
        <li>Optimización de estructura de capital</li>
      </ul>
      
      <h3>Consideraciones Fiscales Clave</h3>
      <ul>
        <li>Tratamiento de pérdidas fiscales</li>
        <li>Reconocimiento de ganancias/pérdidas</li>
        <li>Continuidad de bases gravables</li>
        <li>Impacto en CUFIN y CUFINRE</li>
      </ul>
      
      <h3>Estrategias de Planificación</h3>
      <p>Una planificación fiscal efectiva debe considerar tanto el impacto inmediato como las consecuencias a largo plazo de la reestructuración.</p>
    `,
    featuredImage: "/images/blog/tax-restructuring.jpg",
    authorId: "author_1",
    categoryId: "derecho-fiscal",
    tags: ["Fiscal", "Reestructuración", "SAT", "Optimización Tributaria", "Planificación"],
    status: PostStatus.PUBLISHED,
    publishedAt: new Date("2024-02-01"),
    seoTitle: "Reestructuraciones Corporativas: Aspectos Tributarios 2024 | ALTUM Legal",
    seoDescription: "Asesoría fiscal especializada en reestructuraciones corporativas. Estrategias de optimización tributaria legal en México.",
    viewCount: 1287,
    createdAt: new Date("2024-01-28"),
    updatedAt: new Date("2024-02-01")
  },
  {
    id: "post_5",
    title: "Propiedad Intelectual en la Era Digital: Protección de Marcas y Patentes",
    slug: "propiedad-intelectual-era-digital-marcas-patentes",
    excerpt: "Análisis de las estrategias de protección de propiedad intelectual en el entorno digital y los desafíos emergentes para marcas y patentes.",
    content: `
      <h2>Propiedad Intelectual en el Siglo XXI</h2>
      <p>La transformación digital ha redefinido el panorama de la propiedad intelectual, creando nuevas oportunidades y desafíos para la protección de activos intangibles.</p>
      
      <h3>Protección de Marcas Digitales</h3>
      <p>Las marcas en el entorno digital enfrentan amenazas únicas:</p>
      <ul>
        <li>Ciberocupación de dominios</li>
        <li>Uso no autorizado en redes sociales</li>
        <li>Falsificación en plataformas de e-commerce</li>
        <li>Infracción en aplicaciones móviles</li>
      </ul>
      
      <h3>Patentes de Software y Tecnología</h3>
      <p>La patentabilidad del software sigue siendo un área compleja que requiere estrategias específicas:</p>
      <ul>
        <li>Definición clara de la invención técnica</li>
        <li>Demostración de aplicación industrial</li>
        <li>Evaluación de prior art global</li>
      </ul>
      
      <h3>Estrategias de Enforcement</h3>
      <p>La protección efectiva requiere un enfoque multi-jurisdiccional y el uso de herramientas tecnológicas para monitoreo y enforcement.</p>
      
      <h3>Tendencias Emergentes</h3>
      <p>Inteligencia artificial, blockchain y NFTs están creando nuevas categorías de propiedad intelectual que requieren marcos legales adaptados.</p>
    `,
    featuredImage: "/images/blog/ip-digital-era.jpg",
    authorId: "author_2",
    categoryId: "propiedad-intelectual",
    tags: ["Propiedad Intelectual", "Marcas", "Patentes", "Digital", "Tecnología"],
    status: PostStatus.PUBLISHED,
    publishedAt: new Date("2024-02-05"),
    seoTitle: "Propiedad Intelectual Digital: Protección de Marcas y Patentes 2024",
    seoDescription: "Asesoría especializada en propiedad intelectual digital. Protección de marcas y patentes en la era tecnológica.",
    viewCount: 2156,
    createdAt: new Date("2024-02-02"),
    updatedAt: new Date("2024-02-05")
  },
  {
    id: "post_6",
    title: "Compliance Corporativo: Programas de Integridad y Prevención de Riesgos",
    slug: "compliance-corporativo-programas-integridad-prevencion-riesgos",
    excerpt: "Guía completa para el diseño e implementación de programas de compliance corporativo efectivos y la gestión proactiva de riesgos regulatorios.",
    content: `
      <h2>La Importancia del Compliance Corporativo</h2>
      <p>En un entorno regulatorio cada vez más complejo, los programas de compliance efectivos son esenciales para la sostenibilidad y reputación empresarial.</p>
      
      <h3>Elementos de un Programa Efectivo</h3>
      <h4>1. Liderazgo y Cultura</h4>
      <ul>
        <li>Compromiso visible de la alta dirección</li>
        <li>Código de ética y conducta</li>
        <li>Comunicación efectiva de valores</li>
      </ul>
      
      <h4>2. Evaluación de Riesgos</h4>
      <ul>
        <li>Identificación de riesgos específicos del sector</li>
        <li>Evaluación de controles existentes</li>
        <li>Mapeo de procesos críticos</li>
      </ul>
      
      <h4>3. Controles y Procedimientos</h4>
      <p>Implementación de controles específicos para:</p>
      <ul>
        <li>Prevención de lavado de dinero</li>
        <li>Anticorrupción y soborno</li>
        <li>Competencia económica</li>
        <li>Protección de datos</li>
      </ul>
      
      <h3>Monitoreo y Mejora Continua</h3>
      <p>Los programas de compliance requieren evaluación y actualización constante para mantener su efectividad.</p>
      
      <h3>Beneficios del Compliance Efectivo</h3>
      <ul>
        <li>Reducción de riesgos regulatorios</li>
        <li>Protección reputacional</li>
        <li>Ventaja competitiva</li>
        <li>Atenuantes en procedimientos sancionadores</li>
      </ul>
    `,
    featuredImage: "/images/blog/corporate-compliance.jpg",
    authorId: "author_3",
    categoryId: "compliance",
    tags: ["Compliance", "Integridad", "Riesgos", "Regulatorio", "Ética Empresarial"],
    status: PostStatus.PUBLISHED,
    publishedAt: new Date("2024-02-10"),
    seoTitle: "Compliance Corporativo: Programas de Integridad 2024 | ALTUM Legal",
    seoDescription: "Diseño e implementación de programas de compliance corporativo. Prevención de riesgos y cumplimiento regulatorio.",
    viewCount: 1834,
    createdAt: new Date("2024-02-07"),
    updatedAt: new Date("2024-02-10")
  }
];

// Sample categories for blog organization
export const blogCategories = [
  {
    id: "derecho-corporativo",
    name: "Derecho Corporativo",
    slug: "derecho-corporativo",
    description: "Fusiones, adquisiciones, estructuración corporativa y governance",
    color: "#B79F76"
  },
  {
    id: "derecho-fiscal",
    name: "Derecho Fiscal",
    slug: "derecho-fiscal", 
    description: "Planificación tributaria, auditorías fiscales y cumplimiento",
    color: "#152239"
  },
  {
    id: "derecho-digital",
    name: "Derecho Digital",
    slug: "derecho-digital",
    description: "Protección de datos, ciberseguridad y tecnología",
    color: "#8B7355"
  },
  {
    id: "derecho-internacional",
    name: "Derecho Internacional",
    slug: "derecho-internacional",
    description: "Contratos internacionales, arbitraje y comercio exterior",
    color: "#6B5B47"
  },
  {
    id: "propiedad-intelectual", 
    name: "Propiedad Intelectual",
    slug: "propiedad-intelectual",
    description: "Marcas, patentes, derechos de autor y secretos industriales",
    color: "#9C8A6B"
  },
  {
    id: "compliance",
    name: "Compliance",
    slug: "compliance",
    description: "Programas de integridad, prevención de riesgos y ética",
    color: "#7A6B5A"
  }
];

// Sample authors
export const blogAuthors = [
  {
    id: "author_1",
    name: "Dr. Ricardo Mendoza",
    position: "Socio Director - Derecho Corporativo",
    bio: "Especialista en fusiones y adquisiciones con más de 20 años de experiencia en transacciones complejas.",
    avatar: "/images/authors/ricardo-mendoza.jpg",
    expertise: ["M&A", "Derecho Corporativo", "Derecho Fiscal"]
  },
  {
    id: "author_2", 
    name: "Lic. Marina Vázquez",
    position: "Socia - Derecho Digital y PI",
    bio: "Experta en propiedad intelectual y protección de datos con enfoque en empresas tecnológicas.",
    avatar: "/images/authors/marina-vazquez.jpg",
    expertise: ["Propiedad Intelectual", "Protección de Datos", "Derecho Digital"]
  },
  {
    id: "author_3",
    name: "Dr. Carlos Hernández",
    position: "Socio - Derecho Internacional",
    bio: "Especialista en arbitraje internacional y contratos transfronterizos con certificaciones internacionales.",
    avatar: "/images/authors/carlos-hernandez.jpg", 
    expertise: ["Arbitraje", "Contratos Internacionales", "Compliance"]
  }
];

// Helper function to create BlogPost instances
export const createBlogPosts = (): BlogPost[] => {
  return sampleBlogPosts.map(post => new BlogPost(post));
};

// Function to generate categories dynamically from posts
export const generateCategoriesFromPosts = (posts: BlogPost[]) => {
  const categoryMap = new Map();
  const defaultColors = ['#B79F76', '#152239', '#8B7355', '#6B5B47', '#9C8A6B', '#7A6B5A', '#A68B5B', '#5D4E3A'];
  let colorIndex = 0;
  
  posts.forEach(post => {
    if (post.categoryId && !categoryMap.has(post.categoryId)) {
      // Create category object with friendly name
      const categoryName = post.categoryId
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      categoryMap.set(post.categoryId, {
        id: post.categoryId,
        name: categoryName,
        slug: post.categoryId,
        description: `Artículos de ${categoryName.toLowerCase()}`,
        color: defaultColors[colorIndex % defaultColors.length],
        postCount: 0
      });
      colorIndex++;
    }
  });
  
  // Count posts per category
  posts.forEach(post => {
    if (post.categoryId && categoryMap.has(post.categoryId)) {
      const category = categoryMap.get(post.categoryId);
      category.postCount = (category.postCount || 0) + 1;
    }
  });
  
  return Array.from(categoryMap.values()).sort((a, b) => a.name.localeCompare(b.name));
};

// Reading time calculation utility
export const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

// Format date for blog posts
export const formatBlogDate = (date: Date): string => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  }).format(date);
};