import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Service interface
interface Service {
  id: string;
  name: string;
  parentId?: string;
  isParent: boolean;
  isActive: boolean;
  description?: string;
  shortDescription?: string;
  iconUrl?: string;
  order: number;
}

// Store state interface
interface ServicesState {
  // State
  services: Service[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  
  // Actions
  setServices: (services: Service[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchServices: (forceRefresh?: boolean) => Promise<void>;
  clearServices: () => void;
  getParentServices: () => Service[];
  getChildServices: (parentId: string) => Service[];
  getServiceById: (id: string) => Service | undefined;
  isDataStale: () => boolean;
}

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

export const useServicesStore = create<ServicesState>()(
  persist(
    (set, get) => ({
      // Initial state
      services: [],
      isLoading: false,
      error: null,
      lastFetched: null,

      // Actions
      setServices: (services: Service[]) => 
        set({ 
          services, 
          lastFetched: Date.now(),
          error: null 
        }),

      setLoading: (isLoading: boolean) => 
        set({ isLoading }),

      setError: (error: string | null) => 
        set({ error, isLoading: false }),

      fetchServices: async (forceRefresh = false) => {
        const state = get();
        
        // Check if we need to fetch (cache is stale or force refresh)
        if (!forceRefresh && !state.isDataStale() && state.services.length > 0) {
          return; // Use cached data
        }

        set({ isLoading: true, error: null });

        try {
          console.log('🔄 Fetching services from API...');
          const response = await fetch('/api/services?active=true');
          console.log('📡 API Response status:', response.status);
          
          if (!response.ok) {
            throw new Error(`API response not ok: ${response.status}`);
          }
          
          const data = await response.json();
          console.log('📦 API Response data:', data);

          if (data.success && data.data) {
            console.log('✅ Services found:', data.data.length);
            
            // Transform API data to store format
            const transformedServices: Service[] = data.data.map((service: any) => ({
              id: service.id,
              name: service.name,
              parentId: service.parentId,
              isParent: !service.parentId,
              isActive: service.isActive,
              description: service.description,
              shortDescription: service.shortDescription,
              iconUrl: service.iconUrl,
              order: service.order || 0
            }));

            console.log('🔄 Transformed services:', transformedServices);

            // Sort services: parents first, then by order
            const sortedServices = transformedServices.sort((a, b) => {
              if (a.isParent && !b.isParent) return -1;
              if (!a.isParent && b.isParent) return 1;
              return a.order - b.order;
            });

            console.log('📋 Final sorted services:', sortedServices);
            state.setServices(sortedServices);
          } else {
            console.error('❌ API returned unsuccessful response:', data);
            state.setError('Error al cargar servicios: ' + (data.error || 'respuesta no válida'));
          }
        } catch (error) {
          console.error('❌ Error fetching services:', error);
          state.setError('Error al cargar servicios: ' + (error instanceof Error ? error.message : 'error desconocido'));
        } finally {
          set({ isLoading: false });
        }
      },

      clearServices: () => 
        set({ 
          services: [], 
          error: null, 
          lastFetched: null 
        }),

      getParentServices: () =>
        get().services.filter((service: Service) => service.isParent),

      getChildServices: (parentId: string) =>
        get().services.filter((service: Service) => service.parentId === parentId),

      getServiceById: (id: string) =>
        get().services.find((service: Service) => service.id === id),

      isDataStale: () => {
        const { lastFetched } = get();
        if (!lastFetched) return true;
        return Date.now() - lastFetched > CACHE_DURATION;
      },
    }),
    {
      name: 'services-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist services data, not loading/error states
      partialize: (state: ServicesState) => ({
        services: state.services,
        lastFetched: state.lastFetched,
      }),
      // Handle hydration
      onRehydrateStorage: () => (state?: ServicesState) => {
        if (state) {
          // Reset loading and error states after hydration
          state.isLoading = false;
          state.error = null;
        }
      },
    }
  )
);

// Export for React import
import React from 'react';

// Helper hook for components that need services
export const useServices = () => {
  const store = useServicesStore();
  
  // Auto-fetch on first use if data is stale
  React.useEffect(() => {
    const shouldFetch = store.services.length === 0 || store.isDataStale();
    if (shouldFetch && !store.isLoading) {
      store.fetchServices();
    }
  }, []); // Empty dependency array - only run on mount

  return store;
};