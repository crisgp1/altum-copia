export interface UserProps {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  role: string;
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastSignInAt?: Date;
}

export class User {
  private readonly props: UserProps;

  constructor(props: UserProps) {
    this.validateProps(props);
    this.props = { ...props };
  }

  private validateProps(props: UserProps): void {
    if (!props.id || props.id.trim().length === 0) {
      throw new Error('User ID is required');
    }
    if (!props.email || props.email.trim().length === 0) {
      throw new Error('Email is required');
    }
    if (!this.isValidEmail(props.email)) {
      throw new Error('Invalid email format');
    }
    if (!props.role || props.role.trim().length === 0) {
      throw new Error('Role is required');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  get id(): string {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }

  get firstName(): string | undefined {
    return this.props.firstName;
  }

  get lastName(): string | undefined {
    return this.props.lastName;
  }

  get fullName(): string {
    const first = this.props.firstName || '';
    const last = this.props.lastName || '';
    return `${first} ${last}`.trim() || this.props.email;
  }

  get imageUrl(): string | undefined {
    return this.props.imageUrl;
  }

  get role(): string {
    return this.props.role;
  }

  get permissions(): string[] {
    return [...this.props.permissions];
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get lastSignInAt(): Date | undefined {
    return this.props.lastSignInAt;
  }

  public hasPermission(permission: string): boolean {
    return this.props.permissions.includes(permission);
  }

  public isAdmin(): boolean {
    return this.props.role === 'admin' || this.props.role === 'superadmin';
  }

  public isSuperAdmin(): boolean {
    return this.props.role === 'superadmin';
  }

  public updateRole(newRole: string, newPermissions: string[]): User {
    return new User({
      ...this.props,
      role: newRole,
      permissions: newPermissions,
      updatedAt: new Date()
    });
  }

  public activate(): User {
    return new User({
      ...this.props,
      isActive: true,
      updatedAt: new Date()
    });
  }

  public deactivate(): User {
    return new User({
      ...this.props,
      isActive: false,
      updatedAt: new Date()
    });
  }

  public toJSON(): UserProps {
    return { ...this.props };
  }

  public static create(props: Omit<UserProps, 'createdAt' | 'updatedAt'>): User {
    return new User({
      ...props,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
}