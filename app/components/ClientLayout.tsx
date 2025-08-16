'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import Preloader from '@/app/components/Preloader';
import RouteTransitionLoader from '@/app/components/RouteTransitionLoader';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [isRouteChanging, setIsRouteChanging] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check if this is the first visit in this session
    const hasVisited = sessionStorage.getItem('hasVisitedSession');
    
    if (hasVisited) {
      // If already visited in this session, skip preloader
      setIsLoading(false);
      setShowContent(true);
    } else {
      // First visit in this session, show preloader
      sessionStorage.setItem('hasVisitedSession', 'true');
    }
  }, []);

  // Handle route changes
  useEffect(() => {
    // Skip on initial mount and first pathname set
    if (!showContent) return;
    
    // Store previous pathname to detect actual navigation
    const previousPath = sessionStorage.getItem('currentPath');
    if (previousPath && previousPath !== pathname) {
      setIsRouteChanging(true);
      
      const timer = setTimeout(() => {
        setIsRouteChanging(false);
      }, 1200); // Duration of route transition

      return () => clearTimeout(timer);
    }
    
    // Update current path
    sessionStorage.setItem('currentPath', pathname);
  }, [pathname, showContent]);

  const handleLoadComplete = () => {
    setIsLoading(false);
    // Slight delay to ensure smooth transition
    setTimeout(() => {
      setShowContent(true);
    }, 100);
  };

  return (
    <>
      {isLoading && <Preloader onLoadComplete={handleLoadComplete} />}
      <RouteTransitionLoader isLoading={isRouteChanging} />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid #fbbf24',
          },
          success: {
            iconTheme: {
              primary: '#fbbf24',
              secondary: '#1e293b',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#1e293b',
            },
          },
        }}
      />
      <div 
        className={`transition-opacity duration-1000 ${
          showContent ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {children}
      </div>
    </>
  );
}