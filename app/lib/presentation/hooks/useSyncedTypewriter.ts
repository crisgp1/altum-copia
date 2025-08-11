'use client';

import { useRef, useCallback, useEffect } from 'react';
import { TypewriterSyncService } from '@/app/lib/domain/services/TypewriterSyncService';

interface UseSyncedTypewriterProps {
  text: string;
  htmlText?: string; // HTML formateado opcional
  cardAnimationDuration: number; // En segundos
  delayPercentage?: number;
  charDuration?: number;
}

export const useSyncedTypewriter = ({
  text,
  htmlText,
  cardAnimationDuration,
  delayPercentage = 0.3,
  charDuration = 0.04
}: UseSyncedTypewriterProps) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isActiveRef = useRef<boolean>(false);

  const startAnimation = useCallback(() => {
    const callId = Math.random().toString(36).substr(2, 9);
    console.log(`[HOOK-${callId}] useSyncedTypewriter.startAnimation called`, {
      hasContainer: !!containerRef.current,
      text,
      isActive: isActiveRef.current
    });
    
    if (!containerRef.current || !text || isActiveRef.current) return;

    // Marcar como activo
    isActiveRef.current = true;

    // Limpiar animación previa INMEDIATAMENTE
    if (timelineRef.current) {
      console.log('🛑 STOPPING previous timeline before starting new one');
      timelineRef.current.kill();
      timelineRef.current = null;
    }
    TypewriterSyncService.cleanup(containerRef.current, null); // Solo limpiar container

    // Crear nueva animación sincronizada
    console.log('🔥 About to create TypewriterSyncService animation');
    timelineRef.current = TypewriterSyncService.createSyncedTypewriter({
      text,
      htmlText,
      container: containerRef.current,
      cardAnimationDuration,
      delayPercentage,
      charDuration,
      onComplete: () => {
        console.log('🎊 Hook onComplete called');
        isActiveRef.current = false;
      }
    });
    console.log('📦 Timeline created:', !!timelineRef.current);
  }, [text, htmlText, cardAnimationDuration, delayPercentage, charDuration]);

  const stopAnimation = useCallback(() => {
    isActiveRef.current = false;
    TypewriterSyncService.cleanup(containerRef.current, timelineRef.current);
    timelineRef.current = null;
  }, []);

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
      isActiveRef.current = false;
    };
  }, []);

  return {
    containerRef,
    startAnimation,
    stopAnimation,
    resetAnimation,
    isActive: isActiveRef.current
  };
};