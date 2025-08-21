export interface AttorneyProps {
  id?: string;
  nombre: string;
  cargo: string;
  especializaciones: string[];
  serviciosQueAtiende: string[];
  experienciaAnios: number;
  educacion: string[];
  idiomas: string[];
  correo: string;
  telefono: string;
  biografia: string;
  logros: string[];
  casosDestacados: string[];
  imagenUrl?: string;
  linkedIn?: string;
  esSocio: boolean;
  descripcionCorta: string;
  activo: boolean;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

export class Attorney {
  private readonly props: AttorneyProps;

  constructor(props: AttorneyProps) {
    this.validateProps(props);
    this.props = {
      ...props,
      fechaCreacion: props.fechaCreacion || new Date(),
      fechaActualizacion: props.fechaActualizacion || new Date(),
      activo: props.activo ?? true,
      esSocio: props.esSocio ?? false,
      serviciosQueAtiende: props.serviciosQueAtiende || [],
      especializaciones: props.especializaciones || [],
      educacion: props.educacion || [],
      idiomas: props.idiomas || [],
      logros: props.logros || [],
      casosDestacados: props.casosDestacados || []
    };
  }

  private validateProps(props: AttorneyProps): void {
    if (!props.nombre || props.nombre.trim().length === 0) {
      throw new Error('El nombre es requerido');
    }
    if (props.nombre.length > 100) {
      throw new Error('El nombre no puede exceder 100 caracteres');
    }
    if (!props.cargo || props.cargo.trim().length === 0) {
      throw new Error('El cargo es requerido');
    }
    if (props.cargo.length > 100) {
      throw new Error('El cargo no puede exceder 100 caracteres');
    }
    if (props.experienciaAnios < 0 || props.experienciaAnios > 60) {
      throw new Error('Los años de experiencia deben estar entre 0 y 60');
    }
    if (!this.isValidEmail(props.correo)) {
      throw new Error('El correo electrónico no es válido');
    }
    if (!this.isValidPhone(props.telefono)) {
      throw new Error('El número de teléfono no es válido');
    }
    if (!props.biografia || props.biografia.length > 2000) {
      throw new Error('La biografía es requerida y no puede exceder 2000 caracteres');
    }
    if (!props.descripcionCorta || props.descripcionCorta.length > 200) {
      throw new Error('La descripción corta es requerida y no puede exceder 200 caracteres');
    }
    if (props.linkedIn && !this.isValidLinkedInUrl(props.linkedIn)) {
      throw new Error('La URL de LinkedIn no es válida');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  }

  private isValidLinkedInUrl(url: string): boolean {
    const linkedInRegex = /^https?:\/\/(www\.)?linkedin\.com\/.*$/;
    return linkedInRegex.test(url);
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get nombre(): string {
    return this.props.nombre;
  }

  get cargo(): string {
    return this.props.cargo;
  }

  get especializaciones(): string[] {
    return [...(this.props.especializaciones || [])];
  }

  get serviciosQueAtiende(): string[] {
    return [...(this.props.serviciosQueAtiende || [])];
  }

  get experienciaAnios(): number {
    return this.props.experienciaAnios;
  }

  get educacion(): string[] {
    return [...(this.props.educacion || [])];
  }

  get idiomas(): string[] {
    return [...(this.props.idiomas || [])];
  }

  get correo(): string {
    return this.props.correo;
  }

  get telefono(): string {
    return this.props.telefono;
  }

  get biografia(): string {
    return this.props.biografia;
  }

  get logros(): string[] {
    return [...(this.props.logros || [])];
  }

  get casosDestacados(): string[] {
    return [...(this.props.casosDestacados || [])];
  }

  get imagenUrl(): string | undefined {
    return this.props.imagenUrl;
  }

  get linkedIn(): string | undefined {
    return this.props.linkedIn;
  }

  get esSocio(): boolean {
    return this.props.esSocio;
  }

  get descripcionCorta(): string {
    return this.props.descripcionCorta;
  }

  get activo(): boolean {
    return this.props.activo;
  }

  get fechaCreacion(): Date | undefined {
    return this.props.fechaCreacion;
  }

  get fechaActualizacion(): Date | undefined {
    return this.props.fechaActualizacion;
  }

  public toJSON(): AttorneyProps {
    return { ...this.props };
  }

  public getPublicInfo(): Omit<AttorneyProps, 'activo' | 'fechaCreacion' | 'fechaActualizacion'> {
    const { activo, fechaCreacion, fechaActualizacion, ...publicInfo } = this.props;
    return publicInfo;
  }

  public static create(props: Omit<AttorneyProps, 'id'>): Attorney {
    return new Attorney(props);
  }

  public update(props: Partial<AttorneyProps>): Attorney {
    return new Attorney({
      ...this.props,
      ...props,
      fechaActualizacion: new Date()
    });
  }
}