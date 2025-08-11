/**
 * Servicio para gestión centralizada de timelines GSAP
 * Previene múltiples timelines activos y optimiza memoria
 * Siguiendo principios DDD
 */
import { gsap } from 'gsap';

export interface ManagedTimeline {
  id: string;
  timeline: gsap.core.Timeline;
  createdAt: number;
  componentId: string;
  type: 'hover' | 'collapse' | 'typewriter' | 'other';
}

export class GSAPTimelineManagerService {
  private timelines: Map<string, ManagedTimeline> = new Map();
  
  /**
   * Registra un nuevo timeline, matando cualquier timeline previo con el mismo ID
   */
  register(
    id: string,
    componentId: string,
    type: ManagedTimeline['type'] = 'other',
    timelineFactory?: () => gsap.core.Timeline
  ): gsap.core.Timeline {
    // Limpiar timeline existente si hay uno
    this.cleanup(id);
    
    // Crear nuevo timeline
    const timeline = timelineFactory ? timelineFactory() : gsap.timeline();
    
    // Registrar
    this.timelines.set(id, {
      id,
      timeline,
      createdAt: Date.now(),
      componentId,
      type
    });
    
    // Auto-cleanup cuando el timeline se completa
    timeline.eventCallback('onComplete', () => {
      this.cleanup(id);
    });
    
    console.log(`[TimelineManager] Registered timeline: ${id} (type: ${type})`);
    
    return timeline;
  }
  
  /**
   * Obtiene un timeline existente
   */
  get(id: string): gsap.core.Timeline | null {
    const managed = this.timelines.get(id);
    return managed ? managed.timeline : null;
  }
  
  /**
   * Limpia un timeline específico
   */
  cleanup(id: string): boolean {
    const managed = this.timelines.get(id);
    
    if (managed) {
      // Matar el timeline
      managed.timeline.kill();
      
      // Remover del registro
      this.timelines.delete(id);
      
      console.log(`[TimelineManager] Cleaned up timeline: ${id}`);
      return true;
    }
    
    return false;
  }
  
  /**
   * Limpia todos los timelines de un componente
   */
  cleanupByComponent(componentId: string): number {
    let count = 0;
    
    // Encontrar todos los timelines del componente
    const toCleanup: string[] = [];
    this.timelines.forEach((managed, id) => {
      if (managed.componentId === componentId) {
        toCleanup.push(id);
      }
    });
    
    // Limpiar cada uno
    toCleanup.forEach(id => {
      if (this.cleanup(id)) {
        count++;
      }
    });
    
    if (count > 0) {
      console.log(`[TimelineManager] Cleaned ${count} timelines for component: ${componentId}`);
    }
    
    return count;
  }
  
  /**
   * Limpia todos los timelines de un tipo específico
   */
  cleanupByType(type: ManagedTimeline['type']): number {
    let count = 0;
    
    const toCleanup: string[] = [];
    this.timelines.forEach((managed, id) => {
      if (managed.type === type) {
        toCleanup.push(id);
      }
    });
    
    toCleanup.forEach(id => {
      if (this.cleanup(id)) {
        count++;
      }
    });
    
    return count;
  }
  
  /**
   * Limpia todos los timelines activos
   */
  cleanupAll(): number {
    const count = this.timelines.size;
    
    this.timelines.forEach((managed) => {
      managed.timeline.kill();
    });
    
    this.timelines.clear();
    
    console.log(`[TimelineManager] Cleaned all ${count} timelines`);
    return count;
  }
  
  /**
   * Obtiene información de debug
   */
  getActiveTimelines(): Array<{
    id: string;
    componentId: string;
    type: string;
    age: number;
    isActive: boolean;
  }> {
    const now = Date.now();
    
    return Array.from(this.timelines.values()).map(managed => ({
      id: managed.id,
      componentId: managed.componentId,
      type: managed.type,
      age: now - managed.createdAt,
      isActive: managed.timeline.isActive()
    }));
  }
  
  /**
   * Verifica si hay un timeline activo
   */
  hasActiveTimeline(id: string): boolean {
    const managed = this.timelines.get(id);
    return managed ? managed.timeline.isActive() : false;
  }
  
  /**
   * Factory method para crear instancia
   */
  static create(): GSAPTimelineManagerService {
    return new GSAPTimelineManagerService();
  }
  
  /**
   * Singleton global para toda la aplicación
   */
  private static instance: GSAPTimelineManagerService | null = null;
  
  static getInstance(): GSAPTimelineManagerService {
    if (!this.instance) {
      this.instance = new GSAPTimelineManagerService();
    }
    return this.instance;
  }
}