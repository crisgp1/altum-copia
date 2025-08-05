'use client';

import { useState, useEffect } from 'react';
import { UserRole, getRoleDisplayName, ROLE_PERMISSIONS } from '@/app/lib/auth/roles';
import { useUserRole } from '@/app/lib/hooks/useUserRole';
import RoleAssignmentModal from '@/app/components/admin/RoleAssignmentModal';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  role: UserRole;
  createdAt: Date;
  lastSignInAt?: Date;
  department?: string;
}

export default function DeveloperRoleAssignment() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  
  const { hasPermission } = useUserRole();

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter]);

  const loadUsers = async () => {
    try {
      // Mock data - replace with real API call
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'john.developer@altum.com',
          firstName: 'John',
          lastName: 'Smith',
          imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          role: UserRole.DEVELOPER,
          createdAt: new Date('2024-01-15'),
          lastSignInAt: new Date('2024-01-20'),
          department: 'Development'
        },
        {
          id: '2',
          email: 'maria.garcia@altum.com',
          firstName: 'María',
          lastName: 'García',
          imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b372?w=150&h=150&fit=crop&crop=face',
          role: UserRole.CONTENT_CREATOR,
          createdAt: new Date('2024-01-10'),
          lastSignInAt: new Date('2024-01-19'),
          department: 'Content'
        },
        {
          id: '3',
          email: 'carlos.admin@altum.com',
          firstName: 'Carlos',
          lastName: 'López',
          imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          role: UserRole.ADMIN,
          createdAt: new Date('2024-01-05'),
          lastSignInAt: new Date('2024-01-21'),
          department: 'Administration'
        },
        {
          id: '4',
          email: 'ana.user@altum.com',
          firstName: 'Ana',
          lastName: 'Martínez',
          imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          role: UserRole.USER,
          createdAt: new Date('2024-01-18'),
          lastSignInAt: new Date('2024-01-20'),
          department: 'Legal'
        }
      ];
      
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleRoleUpdate = async (userId: string, newRole: UserRole) => {
    try {
      // Update user role via API
      const updatedUsers = users.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      );
      setUsers(updatedUsers);
      
      // Show success message
      alert(`Rol actualizado exitosamente a ${getRoleDisplayName(newRole)}`);
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Error al actualizar el rol');
    }
  };

  const openRoleModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const getRoleColor = (role: UserRole) => {
    const colors = {
      [UserRole.SUPERADMIN]: 'bg-red-100 text-red-800',
      [UserRole.ADMIN]: 'bg-purple-100 text-purple-800',
      [UserRole.DEVELOPER]: 'bg-blue-100 text-blue-800',
      [UserRole.CONTENT_CREATOR]: 'bg-green-100 text-green-800',
      [UserRole.USER]: 'bg-gray-100 text-gray-800'
    };
    return colors[role];
  };

  const getRoleStats = () => {
    const stats = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<UserRole, number>);

    return {
      total: users.length,
      developers: stats[UserRole.DEVELOPER] || 0,
      admins: stats[UserRole.ADMIN] || 0,
      contentCreators: stats[UserRole.CONTENT_CREATOR] || 0,
      users: stats[UserRole.USER] || 0
    };
  };

  const stats = getRoleStats();

  if (!hasPermission('manage_users')) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-4">
          Sin permisos de acceso
        </h1>
        <p className="text-slate-600">
          No tienes permisos para gestionar roles de usuario.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Asignación de Roles de Desarrollador
          </h1>
          <p className="text-slate-600 mt-1">
            Gestiona roles y permisos de acceso para desarrolladores y equipo técnico
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-500">Total de usuarios</div>
          <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Desarrolladores</p>
              <p className="text-3xl font-bold text-blue-600">{stats.developers}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Administradores</p>
              <p className="text-3xl font-bold text-purple-600">{stats.admins}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Creadores</p>
              <p className="text-3xl font-bold text-green-600">{stats.contentCreators}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Usuarios</p>
              <p className="text-3xl font-bold text-gray-600">{stats.users}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar usuarios por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="all">Todos los roles</option>
              <option value={UserRole.DEVELOPER}>Desarrolladores</option>
              <option value={UserRole.ADMIN}>Administradores</option>
              <option value={UserRole.CONTENT_CREATOR}>Creadores de Contenido</option>
              <option value={UserRole.USER}>Usuarios</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="text-slate-600 mt-4">Cargando usuarios...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-slate-900">Usuario</th>
                  <th className="text-left py-4 px-6 font-medium text-slate-900">Rol Actual</th>
                  <th className="text-left py-4 px-6 font-medium text-slate-900">Departamento</th>
                  <th className="text-left py-4 px-6 font-medium text-slate-900">Último Acceso</th>
                  <th className="text-left py-4 px-6 font-medium text-slate-900">Permisos</th>
                  <th className="text-left py-4 px-6 font-medium text-slate-900">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-stone-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <img
                          src={user.imageUrl}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="w-10 h-10 rounded-full object-cover mr-4"
                        />
                        <div>
                          <h3 className="font-medium text-slate-900">
                            {user.firstName} {user.lastName}
                          </h3>
                          <p className="text-sm text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                        {getRoleDisplayName(user.role)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {user.department || 'No asignado'}
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {user.lastSignInAt 
                        ? user.lastSignInAt.toLocaleDateString('es-ES')
                        : 'Nunca'
                      }
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {ROLE_PERMISSIONS[user.role].slice(0, 2).map((permission) => (
                          <span
                            key={permission}
                            className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs"
                          >
                            {permission.replace('_', ' ')}
                          </span>
                        ))}
                        {ROLE_PERMISSIONS[user.role].length > 2 && (
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                            +{ROLE_PERMISSIONS[user.role].length - 2} más
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => openRoleModal(user)}
                        className="px-4 py-2 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors duration-200"
                      >
                        Cambiar Rol
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  No se encontraron usuarios
                </h3>
                <p className="text-slate-600">
                  Ajusta los filtros de búsqueda para encontrar usuarios.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Role Assignment Modal */}
      {selectedUser && (
        <RoleAssignmentModal
          user={selectedUser}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
          onRoleUpdate={handleRoleUpdate}
        />
      )}
    </div>
  );
}