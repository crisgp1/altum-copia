// Citation formats and templates for academic references
export interface CitationTemplate {
  id: string;
  name: string;
  description: string;
  template: string; // Template with placeholders like {author}, {title}, {date}, etc.
  example: string;
}

export interface CitationData {
  author: string;
  title: string;
  siteName: string;
  publishDate: string;
  accessDate: string;
  url: string;
  year: number;
}

export interface BlogPostCitation {
  format: string; // Format ID (apa, harvard, mla, chicago)
  citation: string; // Pre-generated citation text
  isCustom: boolean; // Whether this is a custom citation or auto-generated
}

export interface ArticleReference {
  text: string;
  category: string; // academicas, periodisticas, gubernamentales, etc.
}

export interface CitationConfig {
  enabled: boolean;
  customAuthor?: string; // Override default author
  customTitle?: string; // Override default title
  customDate?: string; // Override default date
  citations: BlogPostCitation[]; // Array of citations for different formats
  references?: ArticleReference[]; // Array of article references/sources
}

// Default citation templates
export const DEFAULT_CITATION_TEMPLATES: CitationTemplate[] = [
  {
    id: 'apa',
    name: 'APA',
    description: 'American Psychological Association',
    template: '{author} ({year}). {title}. *{siteName}*. Recuperado el {accessDate}, de {url}',
    example: 'ALTUM Legal (2025). La reforma judicial mexicana de 2025. *ALTUM Legal*. Recuperado el 10 de septiembre de 2025, de https://altum-legal.mx/blog/reforma-judicial'
  },
  {
    id: 'harvard',
    name: 'Harvard',
    description: 'Harvard Reference System',
    template: '{author} ({year}) \'{title}\', *{siteName}*, {publishDate}. Disponible en: {url} (Consultado: {accessDate}).',
    example: 'ALTUM Legal (2025) \'La reforma judicial mexicana de 2025\', *ALTUM Legal*, 10 de septiembre de 2025. Disponible en: https://altum-legal.mx/blog/reforma-judicial (Consultado: 10 de septiembre de 2025).'
  },
  {
    id: 'mla',
    name: 'MLA',
    description: 'Modern Language Association',
    template: '{author}. "{title}." *{siteName}*, {publishDate}, {url}. Consultado el {accessDate}.',
    example: 'ALTUM Legal. "La reforma judicial mexicana de 2025." *ALTUM Legal*, 10 de septiembre de 2025, https://altum-legal.mx/blog/reforma-judicial. Consultado el 10 de septiembre de 2025.'
  },
  {
    id: 'chicago',
    name: 'Chicago',
    description: 'Chicago Manual of Style',
    template: '{author}. "{title}." {siteName}. {publishDate}. {url}.',
    example: 'ALTUM Legal. "La reforma judicial mexicana de 2025." ALTUM Legal. 10 de septiembre de 2025. https://altum-legal.mx/blog/reforma-judicial.'
  }
];

// Utility function to generate citation from template
export const generateCitationFromTemplate = (
  template: CitationTemplate,
  data: CitationData
): string => {
  return template.template
    .replace(/{author}/g, data.author)
    .replace(/{title}/g, data.title)
    .replace(/{siteName}/g, data.siteName)
    .replace(/{publishDate}/g, data.publishDate)
    .replace(/{accessDate}/g, data.accessDate)
    .replace(/{url}/g, data.url)
    .replace(/{year}/g, data.year.toString());
};

// Function to generate all default citations for a blog post
export const generateDefaultCitations = (
  title: string,
  publishedAt: Date,
  url: string,
  author: string = 'ALTUM Legal'
): BlogPostCitation[] => {
  const currentDate = new Date();
  const publishDate = new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(publishedAt);
  
  const accessDate = new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(currentDate);

  const citationData: CitationData = {
    author,
    title,
    siteName: 'ALTUM Legal',
    publishDate,
    accessDate,
    url,
    year: publishedAt.getFullYear()
  };

  return DEFAULT_CITATION_TEMPLATES.map(template => ({
    format: template.id,
    citation: generateCitationFromTemplate(template, citationData),
    isCustom: false
  }));
};