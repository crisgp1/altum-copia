'use client';

import { useState, useEffect } from 'react';
import { ResponsiveBreakpoint } from '@/app/lib/domain/valueObjects/ResponsiveBreakpoint';

/**
 * Hook de presentación para la gestión del menú móvil en el panel de administración
 * 
 * Ubicación: Presentation Layer - Hooks
 * Responsabilidad: Gestionar el estado de UI del menú móvil
 * 
 * Este hook pertenece a la capa de presentación porque:
 * - Maneja estado de UI (isOpen, isMobile)
 * - Gestiona eventos del DOM (resize, scroll)
 * - No contiene lógica de negocio
 * - Es específico para la presentación del menú
 * 
 * Utiliza Value Objects del dominio para determinar breakpoints,
 * respetando la separación de capas en DDD.
 */
export function useMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si estamos en vista móvil usando el Value Object del dominio
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobile(ResponsiveBreakpoint.isMobile(window.innerWidth));
    };

    // Verificar inicial
    checkMobileView();

    // Listener para cambios de tamaño
    window.addEventListener('resize', checkMobileView);

    return () => {
      window.removeEventListener('resize', checkMobileView);
    };
  }, []);

  // Cerrar menú automáticamente cuando se cambia a desktop
  useEffect(() => {
    if (!isMobile && isOpen) {
      setIsOpen(false);
    }
  }, [isMobile, isOpen]);

  // Bloquear scroll del body cuando el menú está abierto en móvil
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const openMenu = () => {
    setIsOpen(true);
  };

  return {
    isOpen,
    isMobile,
    toggleMenu,
    closeMenu,
    openMenu
  };
}