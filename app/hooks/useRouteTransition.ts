'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

export function useRouteTransition() {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigate = useCallback((href: string) => {
    setIsTransitioning(true);
    
    // Start transition animation
    setTimeout(() => {
      router.push(href);
      
      // Reset transition state after navigation
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
    }, 300); // Delay to show transition effect
  }, [router]);

  return { navigate, isTransitioning };
}