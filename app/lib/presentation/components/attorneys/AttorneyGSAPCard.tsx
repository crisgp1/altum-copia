'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import { Attorney } from '@/app/lib/types/Attorney';
import { useAutoAdjustingVerticalText } from '../../hooks/useAutoAdjustingVerticalText';
import { useSafeTypewriter } from '../../hooks/useSafeTypewriter';
import { AnimationConfigService } from '@/app/lib/domain/services/AnimationConfigService';
import { AttorneyTextFormattingService } from '@/app/lib/domain/services/AttorneyTextFormattingService';
import { AttorneyTextLayoutService } from '@/app/lib/domain/services/AttorneyTextLayoutService';
import { SafeGSAPService } from '@/app/lib/domain/services/SafeGSAPService';

interface AttorneyGSAPCardProps {
  attorney: Attorney;
  index: number;
  isActive: boolean;
  onCardHover: (index: number | null) => void;
  onClick: (attorney: Attorney) => void;
  totalCards: number;
  hoveredIndex: number | null;
}

export const AttorneyGSAPCard: React.FC<AttorneyGSAPCardProps> = ({
  attorney,
  index,
  isActive,
  onCardHover,
  onClick,
  totalCards,
  hoveredIndex
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const verticalTextRef = useRef<HTMLDivElement>(null);
  const expandedContentRef = useRef<HTMLDivElement>(null);
  const backgroundOverlayRef = useRef<HTMLDivElement>(null);
  const bottomRightTextRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-adjusting vertical text hook
  const { textStyles, displayText, isTextTruncated } = useAutoAdjustingVerticalText({
    text: attorney.name.toUpperCase(),
    containerRef: cardRef,
    leftPosition: 20
  });

  // Formatear texto usando el nuevo servicio DDD con resaltado
  const { formattedHTML } = AttorneyTextFormattingService.getFormattedTextForCard(attorney);
  
  // Extraer texto plano para compatibilidad
  const plainText = formattedHTML.replace(/<[^>]*>/g, '');
  
  // Obtener layout premium usando el servicio de diseño
  const layoutConfig = AttorneyTextLayoutService.getCompleteLayout(plainText);
  
  // RESUELVE BUG #3: Hook seguro que previene race conditions
  const {
    containerRef: typewriterRef,
    startAnimation: startTypewriter,
    stopAnimation: stopTypewriter,
    resetAnimation: resetTypewriter,
    isAnimating
  } = useSafeTypewriter({
    text: plainText,
    htmlText: layoutConfig.mainText.formattedHTML, // HTML con layout estructurado
    cardAnimationDuration: 0, // SIN sincronización con la tarjeta
    delayPercentage: 0.0, // SIN DELAY - completamente independiente
    charDuration: 0.1, // Rápido y simple
    componentId: `attorney-card-${attorney.id}-${index}` // ID único para el lock
  });


  // Calculate card width based on state - using AnimationConfigService
  const getCardWidth = () => {
    // Use percentage-based calculations to avoid hydration issues
    const baseWidth = 100 / totalCards; // 25% each for 4 cards
    const expandPercentage = AnimationConfigService.getCardExpandPercentage();
    
    if (hoveredIndex === null) {
      return `calc(${baseWidth}% - 7.5px)`; // Equal distribution: 25% each for 4 cards
    } else if (index === hoveredIndex) {
      return `calc(${baseWidth + (expandPercentage * baseWidth / 100)}% - 7.5px)`; // Expanded card
    } else {
      // Other 3 cards share remaining space
      const expandedExtraWidth = expandPercentage * baseWidth / 100;
      const remainingWidth = 100 - (baseWidth + expandedExtraWidth);
      return `calc(${remainingWidth / (totalCards - 1)}% - 7.5px)`;
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Limpieza de timeout solamente
    };
  }, []);

  useEffect(() => {
    // RESUELVE BUG #2: Validación segura de todas las referencias
    SafeGSAPService.safeBatchSet([
      {
        element: expandedContentRef.current,
        properties: { 
          opacity: 0,
          x: -40,
          display: 'none'
        }
      },
      {
        element: verticalTextRef.current,
        properties: {
          opacity: 1
        }
      },
      {
        element: backgroundOverlayRef.current,
        properties: {
          opacity: 0.3
        }
      },
      {
        element: bottomRightTextRef.current,
        properties: {
          opacity: 0,
          display: 'none'
        }
      }
    ]);
  }, []);

  // Animate width changes
  useEffect(() => {
    console.log('useEffect triggered - isActive:', isActive, 'index:', index, 'hoveredIndex:', hoveredIndex);
    if (!cardRef.current) return;

    // Kill any existing animations on this card first to ensure clean transitions
    gsap.killTweensOf([verticalTextRef.current, expandedContentRef.current, backgroundOverlayRef.current, bottomRightTextRef.current, cardRef.current]);

    // Usar hoveredIndex directamente en lugar de isActive
    if (hoveredIndex === index) {
      console.log('Card is hovered IMMEDIATELY, index:', index, 'attorney:', attorney.name);
      
      // Reset typewriter antes de empezar - sin dependencia
      if (typewriterRef.current) {
        typewriterRef.current.innerHTML = '';
      }

      // ANIMACIÓN SIMPLE Y RÁPIDA - Con validación segura de refs
      const tl = gsap.timeline();
      
      // Solo animar si todas las referencias son válidas
      SafeGSAPService.withValidRefs(
        [cardRef, verticalTextRef, expandedContentRef, backgroundOverlayRef, bottomRightTextRef],
        () => {
          // 1. PRIMERO: Hacer desaparecer completamente el nombre vertical
          tl.to(verticalTextRef.current, {
            opacity: 0,
            duration: 0.2,
            ease: "power2.in"
          })
          // 2. DESPUÉS: Expandir la tarjeta
          .to(cardRef.current, {
            width: getCardWidth(),
            duration: 0.6,
            ease: "power3.out"
          }, 0.1) // Empezar un poco después de que el nombre desaparezca
          // 3. MOSTRAR contenido expandido solo después de que el nombre esté oculto
          .set(expandedContentRef.current, { display: 'block' }, 0.2)
          .to(expandedContentRef.current, {
            opacity: 1,
            x: 0,
            duration: 0.4,
            ease: "power3.out"
          }, 0.2) // Solo después de que el nombre esté completamente oculto
          // 4. Oscurecer fondo
          .to(backgroundOverlayRef.current, {
            opacity: 0.7,
            duration: 0.3,
            ease: "power2.out"
          }, 0.2)
          // 5. Mostrar texto inferior
          .set(bottomRightTextRef.current, { display: 'block' }, 0.5)
          .to(bottomRightTextRef.current, {
            opacity: 1,
            duration: 0.2,
            ease: "power2.out"
          }, 0.5);
        },
        () => {
          console.warn(`[CARD-${index}] Some refs are not ready, skipping animation`);
        }
      );

      // Iniciar typewriter - simple
      tl.call(() => {
        console.log(`[CARD-${index}] 🎯 Starting typewriter`);
        
        if (typewriterRef.current && hoveredIndex === index) {
          console.log(`[CARD-${index}] ✅ Starting typewriter`);
          // Llamar startTypewriter directamente sin dependencia
          startTypewriter();
        }
        
      }, [], 0.8); // Iniciar exactamente a los 0.8 segundos del hover
      
    } else {
      // Stop typewriter effect first - sin dependencia
      if (typewriterRef.current) {
        typewriterRef.current.innerHTML = '';
      }
      
      // ANIMACIÓN DE COLAPSO UNIFICADA - Con validación segura
      const collapseTl = gsap.timeline();
      
      collapseTl.call(() => {
        console.log('Stopping typewriter on collapse');
      });
      
      // Solo animar si las referencias son válidas
      SafeGSAPService.withValidRefs(
        [cardRef, verticalTextRef, expandedContentRef, backgroundOverlayRef, bottomRightTextRef],
        () => {
          // 1. PRIMERO: Ocultar completamente el contenido expandido y CTA
          collapseTl.to([expandedContentRef.current, bottomRightTextRef.current], {
            opacity: 0,
            duration: 0.2,
            ease: "power2.in"
          })
          .set([expandedContentRef.current, bottomRightTextRef.current], { display: 'none' }, 0.2)
          // 2. DESPUÉS: Colapsar la tarjeta
          .to(cardRef.current, {
            width: getCardWidth(),
            duration: 0.6,
            ease: "power3.out"
          }, 0.1)
          // 3. FINALMENTE: Mostrar el nombre vertical con delay para persistencia
          .to(verticalTextRef.current, {
            opacity: 1,
            duration: 0.3,
            ease: "power2.out"
          }, 0.8) // Delay más largo para que el texto permanezca visible más tiempo
          // 4. Aclarar fondo
          .to(backgroundOverlayRef.current, {
            opacity: 0.3,
            duration: 0.3,
            ease: "power2.out"
          }, 0.2);
        }
      );
    }
    
  }, [hoveredIndex, index, totalCards]); // Dependencias mínimas para respuesta instantánea

  const handleMouseEnter = () => {
    console.log('Mouse enter on card:', index);
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    // Always trigger hover state directly for card-to-card transitions
    onCardHover(index);
  };

  const handleMouseLeave = () => {
    // Add delay before collapsing to make hover state persistent
    timeoutRef.current = setTimeout(() => {
      console.log(`[CARD-${index}] 🚪 Mouse left with delay, stopping typewriter`);
      stopTypewriter(); // Detener animación con delay
      onCardHover(null);
    }, 300); // 300ms delay before collapse
  };

  return (
    <div
      ref={cardRef}
      className="relative h-full overflow-hidden cursor-pointer"
      style={{
        width: getCardWidth(),
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        minWidth: 0,
        flexShrink: 0,
        border: 'none',
        outline: 'none',
        transition: 'width 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)',
        minHeight: 'clamp(400px, 50vh, 550px)' // Ensure minimum height on mobile
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(attorney)}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={attorney.image}
          alt={attorney.name}
          fill
          className="object-cover"
          priority={index < 3}
        />
      </div>

      {/* Background Overlay for text readability */}
      <div 
        ref={backgroundOverlayRef}
        className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-black/40"
      />

      {/* Content Container */}
      <div className="relative h-full flex items-center">
        {/* Vertical Text (collapsed state) - auto-adjusting centered */}
        <div
          ref={verticalTextRef}
          style={textStyles}
        >
          <h3 className="text-white font-medium drop-shadow-lg">
            {attorney.name.toUpperCase()}
          </h3>
        </div>

        {/* Expanded Content - MOBILE RESPONSIVE LAYOUT with gradient backdrop */}
        <div
          ref={expandedContentRef}
          className={`${layoutConfig.mainText.containerClasses} px-2 sm:px-4 md:px-6`}
          style={{
            display: 'none',
            ...layoutConfig.mainText.containerStyles,
            maxWidth: 'min(90%, 280px)', // Mobile responsive max-width
            minWidth: 'min(60%, 150px)', // Mobile responsive min-width
            right: 'clamp(8px, 2vw, 16px)', // Responsive right positioning
            bottom: 'clamp(60px, 15vh, 120px)', // Move description text more to top
            // Soft black gradient background for better text readability
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.1) 100%)',
            borderRadius: '8px',
            backdropFilter: 'blur(2px)', // Subtle blur effect
            WebkitBackdropFilter: 'blur(2px)', // Safari support
            padding: 'clamp(8px, 2vw, 12px)' // Internal padding for the gradient box
          }}
        >
          <div
            ref={typewriterRef}
            style={{
              ...layoutConfig.mainText.textStyles,
              fontSize: 'clamp(10px, 2.5vw, 14px)', // Mobile responsive font size
              lineHeight: 'clamp(1.3, 1.5, 1.6)', // Mobile responsive line height
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              textAlign: 'right'
            }}
          ></div>
        </div>
      </div>

      {/* Call-to-Action con diseño responsive */}
      <div
        ref={bottomRightTextRef}
        className={`${layoutConfig.actionText.containerClasses} z-30 opacity-0 px-2 sm:px-4`}
        style={{
          display: 'none',
          ...layoutConfig.actionText.containerStyles,
          maxWidth: 'min(85%, 200px)', // Mobile responsive max-width
          right: 'clamp(8px, 2vw, 16px)', // Responsive right positioning
          bottom: 'clamp(4px, 1vh, 8px)' // Responsive bottom positioning
        }}
      >
        <p style={{
          ...layoutConfig.actionText.textStyles,
          fontSize: 'clamp(8px, 2vw, 11px)', // Mobile responsive font size
          wordBreak: 'break-word',
          overflowWrap: 'break-word'
        }}>
          Haz click aquí para ver más
        </p>
      </div>
    </div>
  );
};