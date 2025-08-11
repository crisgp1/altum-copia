/**
 * Servicio para gestión segura de timeouts en componentes React
 * Previene memory leaks y timeouts huérfanos siguiendo DDD
 */

export interface ManagedTimeout {
  id: NodeJS.Timeout;
  purpose: string;
  createdAt: number;
}

export class TimeoutManagementService {
  private timeouts: Map<string, ManagedTimeout> = new Map();

  /**
   * Registra un nuevo timeout con identificador único
   */
  register(key: string, callback: () => void, delay: number, purpose: string = 'general'): void {
    // Limpiar timeout existente si hay uno con la misma key
    this.clear(key);

    const id = setTimeout(() => {
      callback();
      // Auto-limpieza después de ejecutar
      this.timeouts.delete(key);
    }, delay);

    this.timeouts.set(key, {
      id,
      purpose,
      createdAt: Date.now()
    });
  }

  /**
   * Limpia un timeout específico
   */
  clear(key: string): boolean {
    const timeout = this.timeouts.get(key);
    if (timeout) {
      clearTimeout(timeout.id);
      this.timeouts.delete(key);
      return true;
    }
    return false;
  }

  /**
   * Limpia todos los timeouts registrados
   */
  clearAll(): number {
    const count = this.timeouts.size;
    this.timeouts.forEach((timeout) => {
      clearTimeout(timeout.id);
    });
    this.timeouts.clear();
    return count;
  }

  /**
   * Verifica si existe un timeout activo
   */
  has(key: string): boolean {
    return this.timeouts.has(key);
  }

  /**
   * Obtiene información de debug sobre timeouts activos
   */
  getActiveTimeouts(): Array<{ key: string; purpose: string; age: number }> {
    const now = Date.now();
    return Array.from(this.timeouts.entries()).map(([key, timeout]) => ({
      key,
      purpose: timeout.purpose,
      age: now - timeout.createdAt
    }));
  }

  /**
   * Factory method para crear una instancia por componente
   */
  static create(): TimeoutManagementService {
    return new TimeoutManagementService();
  }
}