/**
 * Servicio para control de concurrencia y prevención de race conditions
 * Implementa patrones de mutex y locks siguiendo principios DDD
 */

export interface LockInfo {
  id: string;
  acquiredAt: number;
  owner: string;
}

export interface ConcurrentOperation<T> {
  id: string;
  execute: () => T | Promise<T>;
  onLocked?: () => void;
  onComplete?: (result: T) => void;
  onError?: (error: Error) => void;
}

export class ConcurrencyControlService {
  private locks: Map<string, LockInfo> = new Map();
  private operationQueue: Map<string, ConcurrentOperation<any>[]> = new Map();

  /**
   * Adquiere un lock exclusivo para una operación
   * Retorna true si se adquirió el lock, false si ya estaba bloqueado
   */
  acquireLock(key: string, owner: string): boolean {
    const existingLock = this.locks.get(key);
    
    if (existingLock) {
      // Ya existe un lock - verificar si es del mismo owner
      if (existingLock.owner === owner) {
        console.warn(`[ConcurrencyControl] Owner ${owner} already has lock for ${key}`);
        return true;
      }
      return false;
    }

    // Adquirir nuevo lock
    this.locks.set(key, {
      id: `${key}-${Date.now()}`,
      acquiredAt: Date.now(),
      owner
    });
    
    return true;
  }

  /**
   * Libera un lock existente
   */
  releaseLock(key: string, owner: string): boolean {
    const lock = this.locks.get(key);
    
    if (!lock) {
      return false;
    }

    if (lock.owner !== owner) {
      console.warn(`[ConcurrencyControl] ${owner} cannot release lock owned by ${lock.owner}`);
      return false;
    }

    this.locks.delete(key);
    
    // Procesar operaciones en cola si las hay
    this.processQueue(key);
    
    return true;
  }

  /**
   * Ejecuta una operación con protección contra race conditions
   */
  async executeWithLock<T>(
    key: string,
    owner: string,
    operation: () => T | Promise<T>,
    options?: {
      timeout?: number;
      onLocked?: () => void;
      onTimeout?: () => void;
    }
  ): Promise<T | null> {
    const lockAcquired = this.acquireLock(key, owner);
    
    if (!lockAcquired) {
      options?.onLocked?.();
      
      // Si hay timeout, esperar y reintentar
      if (options?.timeout) {
        return new Promise((resolve) => {
          const timeoutId = setTimeout(() => {
            options.onTimeout?.();
            resolve(null);
          }, options.timeout);

          // Agregar a la cola para ejecutar cuando se libere el lock
          const queuedOp: ConcurrentOperation<T> = {
            id: `${owner}-${Date.now()}`,
            execute: operation,
            onComplete: (result) => {
              clearTimeout(timeoutId);
              resolve(result);
            }
          };

          this.addToQueue(key, queuedOp);
        });
      }
      
      return null;
    }

    try {
      // Ejecutar la operación con el lock adquirido
      const result = await operation();
      return result;
    } catch (error) {
      console.error(`[ConcurrencyControl] Error in locked operation:`, error);
      throw error;
    } finally {
      // Siempre liberar el lock
      this.releaseLock(key, owner);
    }
  }

  /**
   * Verifica si existe un lock activo
   */
  isLocked(key: string): boolean {
    return this.locks.has(key);
  }

  /**
   * Obtiene información sobre un lock
   */
  getLockInfo(key: string): LockInfo | null {
    return this.locks.get(key) || null;
  }

  /**
   * Agrega una operación a la cola
   */
  private addToQueue(key: string, operation: ConcurrentOperation<any>): void {
    const queue = this.operationQueue.get(key) || [];
    queue.push(operation);
    this.operationQueue.set(key, queue);
  }

  /**
   * Procesa operaciones en cola cuando se libera un lock
   */
  private async processQueue(key: string): Promise<void> {
    const queue = this.operationQueue.get(key);
    
    if (!queue || queue.length === 0) {
      return;
    }

    // Tomar la primera operación en cola
    const nextOperation = queue.shift();
    
    if (nextOperation) {
      try {
        const result = await nextOperation.execute();
        nextOperation.onComplete?.(result);
      } catch (error) {
        nextOperation.onError?.(error as Error);
      }
    }

    // Limpiar la cola si está vacía
    if (queue.length === 0) {
      this.operationQueue.delete(key);
    }
  }

  /**
   * Limpia todos los locks y colas
   */
  clear(): void {
    this.locks.clear();
    this.operationQueue.clear();
  }

  /**
   * Factory method para crear una instancia por componente
   */
  static create(): ConcurrencyControlService {
    return new ConcurrencyControlService();
  }
}