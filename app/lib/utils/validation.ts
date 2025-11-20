interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  area: string;
  message: string;
}

export function validateContactForm(data: ContactFormData): ValidationResult {
  const errors: Record<string, string> = {};

  // Name validation
  if (!data.name.trim()) {
    errors.name = 'El nombre es requerido';
  } else if (data.name.trim().length < 2) {
    errors.name = 'El nombre debe tener al menos 2 caracteres';
  } else if (data.name.trim().length > 100) {
    errors.name = 'El nombre no puede exceder 100 caracteres';
  }

  // Email validation - RFC 5322 compliant
  if (!data.email.trim()) {
    errors.email = 'El correo electrónico es requerido';
  } else {
    // Allows hyphens, plus signs, dots, and other valid characters
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(data.email)) {
      errors.email = 'Por favor ingrese un correo electrónico válido';
    }
  }

  // Phone validation (optional but if provided should be valid)
  if (data.phone.trim()) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = data.phone.replace(/[\s\-\(\)]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      errors.phone = 'Por favor ingrese un número de teléfono válido';
    }
  }

  // Message validation
  if (!data.message.trim()) {
    errors.message = 'El mensaje es requerido';
  } else if (data.message.trim().length < 10) {
    errors.message = 'El mensaje debe tener al menos 10 caracteres';
  } else if (data.message.trim().length > 2000) {
    errors.message = 'El mensaje no puede exceder 2000 caracteres';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}