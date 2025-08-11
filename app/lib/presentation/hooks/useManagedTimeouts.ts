'use client';

import { useRef, useEffect, useCallback } from 'react';
import { TimeoutManagementService } from '@/app/lib/domain/services/TimeoutManagementService';

/**
 * Hook personalizado para gestión segura de timeouts
 * Garantiza limpieza automática al desmontar el componente
 */
export const useManagedTimeouts = () => {
  const timeoutServiceRef = useRef<TimeoutManagementService | null>(null);

  // Inicializar el servicio solo una vez
  if (!timeoutServiceRef.current) {
    timeoutServiceRef.current = TimeoutManagementService.create();
  }

  const timeoutService = timeoutServiceRef.current;

  // Registrar un timeout gestionado
  const setManagedTimeout = useCallback((
    key: string,
    callback: () => void,
    delay: number,
    purpose?: string
  ) => {
    timeoutService.register(key, callback, delay, purpose);
  }, [timeoutService]);

  // Limpiar un timeout específico
  const clearManagedTimeout = useCallback((key: string) => {
    return timeoutService.clear(key);
  }, [timeoutService]);

  // Verificar si existe un timeout
  const hasTimeout = useCallback((key: string) => {
    return timeoutService.has(key);
  }, [timeoutService]);

  // Limpieza automática al desmontar
  useEffect(() => {
    const service = timeoutServiceRef.current;
    
    return () => {
      if (service) {
        const cleared = service.clearAll();
        if (cleared > 0) {
          console.log(`[useManagedTimeouts] Cleaned up ${cleared} active timeouts`);
        }
      }
    };
  }, []); // Solo se ejecuta al montar/desmontar

  return {
    setManagedTimeout,
    clearManagedTimeout,
    hasTimeout,
    // Exponer el servicio para casos avanzados
    timeoutService
  };
};