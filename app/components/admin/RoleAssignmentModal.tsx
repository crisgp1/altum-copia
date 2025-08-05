'use client';

import { useState } from 'react';
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
  const { role: currentUserRole } = useUserRole();

  if (!isOpen) return null;

  const availableRoles = Object.values(UserRole).filter(role => {
    // Current user can only assign roles lower than their own
    return ROLE_HIERARCHY[currentUserRole] > ROLE_HIERARCHY[role];
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onRoleUpdate(user.id, selectedRole);
      onClose();
    } catch (error) {
      console.error('Error updating role:', error);
    } finally {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">
              Asignar Rol de Desarrollador
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 bg-stone-50">
          <div className="flex items-center space-x-4">
            <img
              src={user.imageUrl}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-slate-600">{user.email}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-slate-500 mr-2">Rol actual:</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRoleColor(user.role)}`}>
                  {getRoleDisplayName(user.role)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Role Selection */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-4">
              Seleccionar Nuevo Rol
            </label>
            <div className="space-y-3">
              {availableRoles.map((role) => (
                <label
                  key={role}
                  className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${
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
                    className="mt-1 mr-4 text-amber-600 focus:ring-amber-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-900">
                        {getRoleDisplayName(role)}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRoleColor(role)}`}>
                        {role.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">
                      {getRoleDescription(role)}
                    </p>
                    <div className="text-xs text-slate-500">
                      <strong>Permisos:</strong>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {ROLE_PERMISSIONS[role].map((permission) => (
                          <span
                            key={permission}
                            className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs"
                          >
                            {permission.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Developer-specific Info */}
          {selectedRole === UserRole.DEVELOPER && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Rol de Desarrollador
                  </h4>
                  <p className="text-sm text-blue-800 mb-3">
                    Este rol otorga acceso a herramientas de desarrollo y sistemas críticos:
                  </p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Acceso a base de datos y APIs</li>
                    <li>• Herramientas de debug y monitoreo</li>
                    <li>• Gestión de despliegues</li>
                    <li>• Administración del sistema</li>
                    <li>• Analytics y métricas avanzadas</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-slate-600 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || selectedRole === user.role}
              className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {selectedRole === user.role ? 'Sin Cambios' : 'Asignar Rol'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}