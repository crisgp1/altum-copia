// Centralized contact information for ALTUM Legal
export const ALTUM_CONTACT = {
  phone: {
    main: '+52 33 3629 7531',
    whatsapp: '+52 33 1568 1688',
    whatsappNumber: '523315681688', // For wa.me links (without + and spaces)
  },
  address: {
    street: 'Av. Faro #2522',
    neighborhood: 'Bosques de la Victoria',
    zipCode: 'CP. 44538',
    city: 'Guadalajara',
    state: 'Jalisco',
    full: 'Av. Faro #2522, Bosques de la Victoria, CP. 44538. Guadalajara, Jalisco'
  },
  email: 'contacto@altumlegal.com',
  schedule: 'Lun - Vie: 09:00 - 18:00',
  website: 'https://altum-legal.mx'
};

// WhatsApp message templates
export const WHATSAPP_MESSAGES = {
  general: 'Hola, me interesa obtener asesoría legal. ¿Podrían ayudarme?',
  consultation: 'Hola, me gustaría agendar una consulta legal. ¿Cuál es su disponibilidad?',
  blog: 'Hola, acabo de leer un artículo en su blog de ALTUM Legal y me interesa obtener asesoría legal especializada. ¿Podrían ayudarme?'
};

// Generate WhatsApp URL with message
export const generateWhatsAppURL = (message: string = WHATSAPP_MESSAGES.general): string => {
  return `https://wa.me/${ALTUM_CONTACT.phone.whatsappNumber}?text=${encodeURIComponent(message)}`;
};

// Generate WhatsApp URL for blog articles with specific title
export const generateBlogWhatsAppURL = (articleTitle: string): string => {
  const message = `Hola, acabo de leer el artículo "${articleTitle}" en su blog de ALTUM Legal y me interesa obtener asesoría legal especializada sobre este tema. ¿Podrían ayudarme?`;
  return `https://wa.me/${ALTUM_CONTACT.phone.whatsappNumber}?text=${encodeURIComponent(message)}`;
};