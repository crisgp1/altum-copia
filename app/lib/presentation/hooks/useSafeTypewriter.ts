'use client';

import { useRef, useCallback, useEffect } from 'react';
import { TypewriterSyncService } from '@/app/lib/domain/services/TypewriterSyncService';
import { ConcurrencyControlService } from '@/app/lib/domain/services/ConcurrencyControlService';

interface UseSafeTypewriterProps {
  text: string;
  htmlText?: string;
  cardAnimationDuration: number;
  delayPercentage?: number;
  charDuration?: number;
  componentId: string; // ID único para el componente
}

/**
 * Hook mejorado que previene race conditions en el typewriter
 */
export const useSafeTypewriter = ({
  text,
  htmlText,
  cardAnimationDuration,
  delayPercentage = 0.3,
  charDuration = 0.04,
  componentId
}: UseSafeTypewriterProps) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const concurrencyServiceRef = useRef<ConcurrencyControlService | null>(null);
  
  // Inicializar el servicio de concurrencia
  if (!concurrencyServiceRef.current) {
    concurrencyServiceRef.current = ConcurrencyControlService.create();
  }

  const concurrencyService = concurrencyServiceRef.current;
  const lockKey = `typewriter-${componentId}`;

  const startAnimation = useCallback(async () => {
    const callId = Math.random().toString(36).substr(2, 9);
    console.log(`[SAFE-TYPEWRITER-${callId}] Attempting to start animation`, {
      hasContainer: !!containerRef.current,
      text: text.substring(0, 20) + '...',
      componentId
    });

    if (!containerRef.current || !text) {
      console.log(`[SAFE-TYPEWRITER-${callId}] Missing requirements, aborting`);
      return;
    }

    // RESUELVE BUG #3: Usar lock para prevenir race conditions
    const result = await concurrencyService.executeWithLock(
      lockKey,
      callId,
      () => {
        console.log(`[SAFE-TYPEWRITER-${callId}] Lock acquired, starting animation`);
        
        // Limpiar animación previa
        if (timelineRef.current) {
          timelineRef.current.kill();
          timelineRef.current = null;
        }
        TypewriterSyncService.cleanup(containerRef.current, null);

        // Crear nueva animación
        timelineRef.current = TypewriterSyncService.createSyncedTypewriter({
          text,
          htmlText,
          container: containerRef.current!,
          cardAnimationDuration,
          delayPercentage,
          charDuration,
          onComplete: () => {
            console.log(`[SAFE-TYPEWRITER-${callId}] Animation completed`);
            // El lock se libera automáticamente
          }
        });

        return timelineRef.current;
      },
      {
        onLocked: () => {
          console.log(`[SAFE-TYPEWRITER-${callId}] Animation already in progress, skipping`);
        },
        timeout: 100 // Esperar máximo 100ms si está bloqueado
      }
    );

    if (!result) {
      console.log(`[SAFE-TYPEWRITER-${callId}] Could not acquire lock or timeout`);
    }
  }, [text, htmlText, cardAnimationDuration, delayPercentage, charDuration, componentId, concurrencyService, lockKey]);

  const stopAnimation = useCallback(() => {
    // No necesita lock porque solo limpia
    TypewriterSyncService.cleanup(containerRef.current, timelineRef.current);
    timelineRef.current = null;
    
    // Liberar cualquier lock pendiente
    concurrencyService.releaseLock(lockKey, 'stop-animation');
  }, [concurrencyService, lockKey]);

  const resetAnimation = useCallback(() => {
    stopAnimation();
    // Pequeño delay para evitar problemas de renderizado
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    }, 10);
  }, [stopAnimation]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      // Limpiar el servicio de concurrencia
      if (concurrencyServiceRef.current) {
        concurrencyServiceRef.current.clear();
      }
    };
  }, []);

  return {
    containerRef,
    startAnimation,
    stopAnimation,
    resetAnimation,
    isAnimating: concurrencyService.isLocked(lockKey)
  };
};