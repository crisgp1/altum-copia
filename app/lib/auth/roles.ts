export enum UserRole {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  CONTENT_CREATOR = 'content_creator',
  DEVELOPER = 'developer',
  USER = 'user'
}

export interface UserMetadata {
  role: UserRole;
  permissions: string[];
  createdBy?: string;
  department?: string;
  lastLogin?: string;
}

export interface UserPublicMetadata {
  role: UserRole;
  displayName?: string;
  department?: string;
}

export interface UserPrivateMetadata {
  permissions: string[];
  createdBy?: string;
  lastLogin?: string;
  notes?: string;
}

export const ROLE_PERMISSIONS = {
  [UserRole.SUPERADMIN]: [
    'manage_users',
    'manage_roles',
    'manage_content',
    'create_content',
    'edit_content',
    'delete_content',
    'publish_content',
    'manage_system',
    'view_analytics',
    'manage_media',
    'system_admin',
    'database_access',
    'api_management'
  ],
  [UserRole.ADMIN]: [
    'manage_users',
    'manage_content',
    'create_content',
    'edit_content',
    'delete_content',
    'publish_content',
    'view_analytics',
    'manage_media'
  ],
  [UserRole.CONTENT_CREATOR]: [
    'create_content',
    'edit_own_content',
    'publish_content',
    'manage_media'
  ],
  [UserRole.DEVELOPER]: [
    'view_analytics',
    'manage_content',
    'create_content',
    'edit_content',
    'system_admin',
    'database_access',
    'api_management',
    'debug_access',
    'deploy_code'
  ],
  [UserRole.USER]: [
    'view_content'
  ]
};

export const ROLE_HIERARCHY = {
  [UserRole.SUPERADMIN]: 5,
  [UserRole.ADMIN]: 4,
  [UserRole.DEVELOPER]: 3,
  [UserRole.CONTENT_CREATOR]: 2,
  [UserRole.USER]: 1
};

export function hasPermission(userRole: UserRole, permission: string): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
}

export function canManageUser(managerRole: UserRole, targetRole: UserRole): boolean {
  return ROLE_HIERARCHY[managerRole] > ROLE_HIERARCHY[targetRole];
}

export function getRoleDisplayName(role: UserRole): string {
  const displayNames = {
    [UserRole.SUPERADMIN]: 'Super Administrador',
    [UserRole.ADMIN]: 'Administrador',
    [UserRole.DEVELOPER]: 'Desarrollador',
    [UserRole.CONTENT_CREATOR]: 'Creador de Contenido',
    [UserRole.USER]: 'Usuario'
  };
  return displayNames[role];
}