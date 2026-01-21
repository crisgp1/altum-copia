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
    'access_admin',      // Acceso al panel admin
    'manage_users',      // Gestionar usuarios
    'manage_roles',      // Asignar roles
    'manage_attorneys',  // Gestionar abogados
    'manage_services',   // Gestionar servicios
    'manage_blog',       // Ver/editar todos los posts
    'create_content',    // Crear posts
    'edit_content',      // Editar cualquier post
    'delete_content',    // Eliminar posts
    'publish_content',   // Publicar posts
    'manage_media',      // Gestionar medios
    'manage_legal',      // Configuración legal
    'manage_system',     // Configuración del sistema
    'view_analytics',    // Ver estadísticas
    'system_admin',      // Admin del sistema
    'database_access',   // Acceso a BD
    'api_management'     // Gestión de APIs
  ],
  [UserRole.ADMIN]: [
    'access_admin',
    'manage_users',
    'manage_attorneys',
    'manage_services',
    'manage_blog',
    'create_content',
    'edit_content',
    'delete_content',
    'publish_content',
    'manage_media',
    'manage_legal',
    'view_analytics'
  ],
  [UserRole.CONTENT_CREATOR]: [
    'access_admin',
    'manage_blog',       // Ver posts del blog
    'create_content',    // Crear posts
    'edit_own_content',  // Editar sus propios posts
    'publish_content',   // Publicar posts
    'manage_media'       // Subir/gestionar medios
  ],
  [UserRole.DEVELOPER]: [
    'access_admin',
    'manage_blog',
    'create_content',
    'edit_content',
    'manage_media',
    'manage_system',
    'view_analytics',
    'system_admin',
    'database_access',
    'api_management',
    'debug_access',
    'deploy_code'
  ],
  [UserRole.USER]: [
    'view_content'       // Solo ver contenido público (SIN access_admin)
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