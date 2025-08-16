/**
 * Value Object para representar breakpoints responsivos
 * 
 * Ubicación: Domain Layer - Value Objects
 * Responsabilidad: Encapsular la lógica de breakpoints y validación
 * 
 * Este Value Object encapsula:
 * - Los valores de breakpoints estándar
 * - Validación de breakpoints válidos
 * - Lógica para determinar el breakpoint actual
 */
export class ResponsiveBreakpoint {
  private static readonly BREAKPOINTS = {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
  } as const;

  constructor(private readonly _name: keyof typeof ResponsiveBreakpoint.BREAKPOINTS) {
    this.validateBreakpoint(_name);
  }

  private validateBreakpoint(name: string): void {
    if (!(name in ResponsiveBreakpoint.BREAKPOINTS)) {
      throw new Error(`Invalid breakpoint: ${name}. Valid breakpoints are: ${Object.keys(ResponsiveBreakpoint.BREAKPOINTS).join(', ')}`);
    }
  }

  get name(): string {
    return this._name;
  }

  get value(): number {
    return ResponsiveBreakpoint.BREAKPOINTS[this._name];
  }

  /**
   * Determina si el ancho dado corresponde a este breakpoint o mayor
   */
  public matches(width: number): boolean {
    return width >= this.value;
  }

  /**
   * Determina el breakpoint actual basado en el ancho de ventana
   */
  public static getCurrentBreakpoint(width: number): ResponsiveBreakpoint {
    const breakpoints = Object.entries(ResponsiveBreakpoint.BREAKPOINTS)
      .sort(([, a], [, b]) => b - a); // Ordenar de mayor a menor

    for (const [name, value] of breakpoints) {
      if (width >= value) {
        return new ResponsiveBreakpoint(name as keyof typeof ResponsiveBreakpoint.BREAKPOINTS);
      }
    }

    return new ResponsiveBreakpoint('xs'); // fallback
  }

  /**
   * Verifica si estamos en vista móvil (menor a lg)
   */
  public static isMobile(width: number): boolean {
    return width < ResponsiveBreakpoint.BREAKPOINTS.lg;
  }

  /**
   * Verifica si estamos en vista tablet (md a lg)
   */
  public static isTablet(width: number): boolean {
    return width >= ResponsiveBreakpoint.BREAKPOINTS.md && width < ResponsiveBreakpoint.BREAKPOINTS.lg;
  }

  /**
   * Verifica si estamos en vista desktop (lg o mayor)
   */
  public static isDesktop(width: number): boolean {
    return width >= ResponsiveBreakpoint.BREAKPOINTS.lg;
  }

  /**
   * Obtiene todas las clases CSS para un elemento responsivo
   */
  public static getResponsiveClasses(config: {
    base?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
  }): string {
    const classes: string[] = [];
    
    if (config.base) classes.push(config.base);
    if (config.sm) classes.push(`sm:${config.sm}`);
    if (config.md) classes.push(`md:${config.md}`);
    if (config.lg) classes.push(`lg:${config.lg}`);
    if (config.xl) classes.push(`xl:${config.xl}`);
    if (config['2xl']) classes.push(`2xl:${config['2xl']}`);
    
    return classes.join(' ');
  }

  public equals(other: ResponsiveBreakpoint): boolean {
    return this._name === other._name;
  }

  public toString(): string {
    return `${this._name} (${this.value}px)`;
  }
}