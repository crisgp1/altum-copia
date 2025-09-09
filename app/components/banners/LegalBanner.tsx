'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, X, FileText, Shield } from 'lucide-react';
import Link from 'next/link';

interface BannerData {
  type: 'terms' | 'privacy';
  title: string;
  bannerText: string;
  lastUpdated: string;
}

export default function LegalBanner() {
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [dismissedBanners, setDismissedBanners] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchActiveBanners();
    loadDismissedBanners();
  }, []);

  const fetchActiveBanners = async () => {
    try {
      const response = await fetch('/api/legal-content/banners');
      if (response.ok) {
        const data = await response.json();
        setBanners(data);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDismissedBanners = () => {
    const dismissed = localStorage.getItem('dismissedLegalBanners');
    if (dismissed) {
      setDismissedBanners(new Set(JSON.parse(dismissed)));
    }
  };

  const dismissBanner = (bannerType: string) => {
    const newDismissed = new Set(dismissedBanners);
    newDismissed.add(bannerType);
    setDismissedBanners(newDismissed);
    localStorage.setItem('dismissedLegalBanners', JSON.stringify(Array.from(newDismissed)));
  };

  const activeBanners = banners.filter(banner => !dismissedBanners.has(banner.type));

  if (isLoading || activeBanners.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {activeBanners.map((banner, index) => (
        <div 
          key={banner.type}
          className={`${
            banner.type === 'terms' 
              ? 'bg-blue-50 border-blue-200 border-l-blue-500' 
              : 'bg-amber-50 border-amber-200 border-l-amber-500'
          } border border-l-4 p-4 relative`}
          role="alert"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              {banner.type === 'terms' ? (
                <FileText className={`h-5 w-5 ${banner.type === 'terms' ? 'text-blue-600' : 'text-amber-600'}`} />
              ) : (
                <Shield className={`h-5 w-5 ${banner.type === 'terms' ? 'text-blue-600' : 'text-amber-600'}`} />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className={`text-sm font-medium ${
                  banner.type === 'terms' ? 'text-blue-800' : 'text-amber-800'
                }`}>
                  {banner.title}
                </h4>
                
                <button
                  type="button"
                  className={`ml-4 inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
                    banner.type === 'terms' 
                      ? 'text-blue-500 hover:bg-blue-100 focus:ring-blue-600' 
                      : 'text-amber-500 hover:bg-amber-100 focus:ring-amber-600'
                  }`}
                  onClick={() => dismissBanner(banner.type)}
                  aria-label="Cerrar banner"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="mt-2">
                <p className={`text-sm ${
                  banner.type === 'terms' ? 'text-blue-700' : 'text-amber-700'
                }`}>
                  {banner.bannerText}
                </p>
                
                <div className="mt-3 flex items-center space-x-4">
                  <Link
                    href={`/${banner.type}`}
                    className={`text-sm font-medium underline hover:no-underline transition-all duration-200 ${
                      banner.type === 'terms' 
                        ? 'text-blue-600 hover:text-blue-800' 
                        : 'text-amber-600 hover:text-amber-800'
                    }`}
                  >
                    Leer {banner.type === 'terms' ? 'Términos y Condiciones' : 'Política de Privacidad'}
                  </Link>
                  
                  <span className={`text-xs ${
                    banner.type === 'terms' ? 'text-blue-500' : 'text-amber-500'
                  }`}>
                    Actualizado: {new Date(banner.lastUpdated).toLocaleDateString('es-MX')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}