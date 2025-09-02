'use client';

import { useState, useEffect } from 'react';
import { UserRole, getRoleDisplayName, ROLE_PERMISSIONS, ROLE_HIERARCHY } from '@/app/lib/auth/roles';
import { useUserRole } from '@/app/lib/hooks/useUserRole';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  role: UserRole;
  department?: string;
}

interface RoleAssignmentModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onRoleUpdate: (userId: string, newRole: UserRole) => void;
}

export default function RoleAssignmentModal({
  user,
  isOpen,
  onClose,
  onRoleUpdate
}: RoleAssignmentModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.role);
  const [isLoading, setIsLoading] = useState(false);

  // Update selectedRole when user prop changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedRole(user.role);
      setIsLoading(false);
    }
  }, [user.role, isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);
  const { role: currentUserRole } = useUserRole();

  if (!isOpen) return null;

  const availableRoles = Object.values(UserRole).filter(role => {
    // Superadmins can assign any role
    if (currentUserRole === UserRole.SUPERADMIN) {
      return true;
    }
    // Only superadmins can assign superadmin role
    if (role === UserRole.SUPERADMIN) {
      return false;
    }
    // Other users can only assign roles lower than or equal to their own
    return ROLE_HIERARCHY[currentUserRole] >= ROLE_HIERARCHY[role];
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't submit if role hasn't changed
    if (selectedRole === user.role) {
      return;
    }
    
    setIsLoading(true);

    try {
      await onRoleUpdate(user.id, selectedRole);
      // Small delay to ensure the update is processed
      setTimeout(() => {
        onClose();
      }, 100);
    } catch (error) {
      console.error('Error updating role:', error);
      setIsLoading(false);
    }
  };

  const getRoleColor = (role: UserRole) => {
    const colors = {
      [UserRole.SUPERADMIN]: 'text-red-600 bg-red-50 border-red-200',
      [UserRole.ADMIN]: 'text-purple-600 bg-purple-50 border-purple-200',
      [UserRole.DEVELOPER]: 'text-blue-600 bg-blue-50 border-blue-200',
      [UserRole.CONTENT_CREATOR]: 'text-green-600 bg-green-50 border-green-200',
      [UserRole.USER]: 'text-gray-600 bg-gray-50 border-gray-200'
    };
    return colors[role];
  };

  const getRoleDescription = (role: UserRole) => {
    const descriptions = {
      [UserRole.SUPERADMIN]: 'Acceso completo al sistema, gestión de usuarios y configuración',
      [UserRole.ADMIN]: 'Gestión de contenido y usuarios, acceso a analytics',
      [UserRole.DEVELOPER]: 'Acceso a sistema, base de datos, APIs y herramientas de desarrollo',
      [UserRole.CONTENT_CREATOR]: 'Creación y edición de contenido, gestión de medios',
      [UserRole.USER]: 'Acceso básico de lectura'
    };
    return descriptions[role];
  };

  return (
    <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-3 lg:p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-xs sm:max-w-md lg:max-w-2xl max-h-[95vh] overflow-y-auto mx-2 sm:mx-0">
        {/* Header */}
        <div className="px-3 sm:px-4 lg:px-6 py-3 border-b border-stone-200">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg lg:text-2xl font-bold text-slate-900 pr-2 truncate">
              Asignar Rol
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1 flex-shrink-0 touch-target"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="px-3 sm:px-4 lg:px-6 py-3 bg-stone-50">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <img
              src={user.imageUrl}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-full object-cover flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-slate-900 truncate">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 truncate">{user.email}</p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-slate-500 mr-1 flex-shrink-0">Rol:</span>
                <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full border ${getRoleColor(user.role)}`}>
                  {getRoleDisplayName(user.role)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Role Selection */}
        <form onSubmit={handleSubmit} className="p-3 sm:p-4 lg:p-6">
          <div className="mb-3 sm:mb-4 lg:mb-6">
            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2 sm:mb-3">
              Seleccionar Nuevo Rol
            </label>
            <div className="space-y-2">
              {availableRoles.map((role) => (
                <label
                  key={role}
                  className={`flex items-start p-2 sm:p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedRole === role
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={selectedRole === role}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="mt-1 mr-2 text-amber-600 focus:ring-amber-500 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-900 text-xs sm:text-sm truncate">
                        {getRoleDisplayName(role)}
                      </span>
                      <span className={`px-1 sm:px-1.5 py-0.5 text-xs font-medium rounded border ${getRoleColor(role)} ml-1 flex-shrink-0`}>
                        {role.substring(0, 3).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-1 sm:mb-2 line-clamp-2">
                      {getRoleDescription(role)}
                    </p>
                    <div className="text-xs text-slate-500">
                      <strong>Permisos:</strong>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {ROLE_PERMISSIONS[role].slice(0, 2).map((permission) => (
                          <span
                            key={permission}
                            className="px-1 py-0.5 bg-slate-100 text-slate-600 rounded text-xs"
                          >
                            {permission.replace('_', ' ').substring(0, 8)}
                          </span>
                        ))}
                        {ROLE_PERMISSIONS[role].length > 2 && (
                          <span className="px-1 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                            +{ROLE_PERMISSIONS[role].length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Developer-specific Info */}
          {selectedRole === UserRole.DEVELOPER && (
            <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <svg className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="min-w-0">
                  <h4 className="font-semibold text-blue-900 mb-1 text-xs sm:text-sm">
                    Rol de Desarrollador
                  </h4>
                  <p className="text-xs text-blue-800 mb-2">
                    Acceso a herramientas de desarrollo:
                  </p>
                  <ul className="text-xs text-blue-800 space-y-0.5">
                    <li>• Base de datos y APIs</li>
                    <li>• Debug y monitoreo</li>
                    <li>• Gestión de despliegues</li>
                    <li className="hidden sm:list-item">• Administración del sistema</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-3 border-t border-stone-200">
            <button
              type="submit"
              disabled={isLoading || selectedRole === user.role}
              className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-sm touch-target"
            >
              {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {selectedRole === user.role ? 'Sin Cambios' : 'Asignar Rol'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full px-4 py-2 text-slate-600 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors text-sm touch-target"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}