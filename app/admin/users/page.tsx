'use client';

import { useState, useEffect } from 'react';
import { UserService } from '@/app/lib/application/services/UserService';
import { UserResponseDTO } from '@/app/lib/application/dtos/UserDTO';
import { Users, Search, Filter, MoreVertical, Edit, Trash2, Eye, UserPlus, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import RoleAssignmentModal from '@/app/components/admin/RoleAssignmentModal';
import { UserRole, ROLE_HIERARCHY, getRoleDisplayName } from '@/app/lib/auth/roles';
import { useUserRole } from '@/app/lib/hooks/useUserRole';

const USER_ROLES = Object.values(UserRole);

export default function UsersPage() {
  const [users, setUsers] = useState<UserResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserResponseDTO | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const { role: currentUserRole } = useUserRole();

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      
      // Use admin API directly instead of UserService
      const params = new URLSearchParams();
      if (selectedRole) params.set('role', selectedRole);
      if (selectedStatus === 'active') params.set('isActive', 'true');
      if (selectedStatus === 'inactive') params.set('isActive', 'false');
      if (searchTerm) params.set('searchTerm', searchTerm);
      params.set('page', page.toString());
      params.set('limit', '10');

      const response = await fetch(`/api/admin/users?${params}`);
      if (!response.ok) throw new Error('Error al obtener usuarios');
      
      const result = await response.json();
      
      if (result.success && result.data) {
        // Transform data to match expected structure
        const usersData = result.data.map((user: any) => ({
          id: user.id,
          email: user.email,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
          imageUrl: user.imageUrl,
          role: (user.role as UserRole) || UserRole.USER,
          permissions: [], // Add default permissions
          isActive: true, // Default to active for Clerk users
          createdAt: user.createdAt,
          lastSignInAt: user.lastSignInAt,
          department: user.department
        }));
        
        setUsers(usersData);
        setCurrentPage(1);
        setTotalPages(Math.ceil(usersData.length / 10));
      }
    } catch (error) {
      toast.error('Error al cargar usuarios');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, selectedRole, selectedStatus]);

  const handleEdit = (user: UserResponseDTO) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = (user: UserResponseDTO) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleView = (user: UserResponseDTO) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;

    try {
      // Note: Deleting Clerk users should be done through Clerk's API
      toast('La eliminación de usuarios debe realizarse desde el panel de Clerk');
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error('Error al eliminar usuario');
      console.error('Error deleting user:', error);
    }
  };

  const updateUserRole = async (userId: string, role: UserRole) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          role,
          department: undefined
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al actualizar rol');
      }
      
      toast.success('Rol actualizado exitosamente');
      setIsEditModalOpen(false);
      setSelectedUser(null);
      fetchUsers(currentPage);
    } catch (error) {
      toast.error('Error al actualizar rol');
      console.error('Error updating role:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-2 sm:p-3 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-blue-600 flex-shrink-0" />
          <h1 className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900 leading-tight">Gestión de Usuarios</h1>
        </div>
        <div className="text-xs sm:text-sm text-gray-500">
          Total: {users.length} usuarios
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-2 sm:p-3 lg:p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4">
          {/* Search */}
          <div className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder:text-slate-400 text-sm"
              />
            </div>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
            {/* Role Filter */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 text-xs sm:text-sm"
            >
              <option value="">Todos</option>
              {USER_ROLES.map(role => (
                <option key={role} value={role}>
                  {getRoleDisplayName(role)}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 text-xs sm:text-sm"
            >
              <option value="">Estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[360px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-2 sm:px-3 lg:px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-2 sm:px-3 lg:px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Rol
                </th>
                <th className="px-2 sm:px-3 lg:px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Estado
                </th>
                <th className="px-2 sm:px-3 lg:px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Último acceso
                </th>
                <th className="px-2 sm:px-3 lg:px-6 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-2 sm:px-3 lg:px-6 py-4 sm:py-6 text-center text-gray-500">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-xs sm:text-sm">Cargando...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-2 sm:px-3 lg:px-6 py-4 sm:py-6 text-center text-gray-500 text-xs sm:text-sm">
                    No se encontraron usuarios
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8 lg:h-10 lg:w-10">
                          <img
                            className="h-7 w-7 sm:h-8 sm:w-8 lg:h-10 lg:w-10 rounded-full object-cover"
                            src={user.imageUrl || '/images/default-avatar.png'}
                            alt={user.fullName}
                          />
                        </div>
                        <div className="ml-2 min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                            {user.fullName}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {user.email}
                          </div>
                          {/* Show role and status on mobile */}
                          <div className="flex items-center gap-1 mt-1 sm:hidden">
                            <span className={`inline-flex items-center px-1 py-0.5 rounded text-xs font-medium ${
                              user.role === UserRole.SUPERADMIN
                                ? 'bg-red-100 text-red-800'
                                : user.role === UserRole.ADMIN 
                                ? 'bg-purple-100 text-purple-800'
                                : user.role === UserRole.DEVELOPER
                                ? 'bg-blue-100 text-blue-800'
                                : user.role === UserRole.CONTENT_CREATOR
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {getRoleDisplayName(user.role as UserRole).substring(0, 5)}
                            </span>
                            <span className={`inline-flex items-center px-1 py-0.5 rounded text-xs font-medium ${
                              user.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.isActive ? '✓' : '✗'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 whitespace-nowrap hidden sm:table-cell">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.role === UserRole.SUPERADMIN
                          ? 'bg-red-100 text-red-800'
                          : user.role === UserRole.ADMIN 
                          ? 'bg-purple-100 text-purple-800'
                          : user.role === UserRole.DEVELOPER
                          ? 'bg-blue-100 text-blue-800'
                          : user.role === UserRole.CONTENT_CREATOR
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <Shield className="w-3 h-3 mr-1" />
                        {getRoleDisplayName(user.role as UserRole)}
                      </span>
                    </td>
                    <td className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 whitespace-nowrap hidden md:table-cell">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 whitespace-nowrap text-xs text-gray-500 hidden lg:table-cell">
                      {user.lastSignInAt ? formatDate(user.lastSignInAt) : 'Nunca'}
                    </td>
                    <td className="px-1 sm:px-2 lg:px-6 py-2 sm:py-3 whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-0.5 sm:space-x-1">
                        <button
                          onClick={() => handleView(user)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded touch-target"
                          title="Ver"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded touch-target disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Editar"
                          disabled={!ROLE_HIERARCHY[currentUserRole] || ROLE_HIERARCHY[currentUserRole] <= ROLE_HIERARCHY[user.role as UserRole]}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="text-red-600 hover:text-red-900 p-1 rounded touch-target"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-2 sm:px-3 lg:px-6 py-2 sm:py-3 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <p className="text-xs text-gray-700">
              {currentPage}/{totalPages}
            </p>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => fetchUsers(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed touch-target"
            >
              ←
            </button>
            <button
              onClick={() => fetchUsers(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed touch-target"
            >
              →
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedUser && (
        <RoleAssignmentModal
          user={{
            id: selectedUser.id,
            email: selectedUser.email,
            firstName: selectedUser.firstName || '',
            lastName: selectedUser.lastName || '',
            imageUrl: selectedUser.imageUrl || '',
            role: selectedUser.role as UserRole,
            department: selectedUser.department
          }}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onRoleUpdate={updateUserRole}
        />
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && selectedUser && (
        <DeleteUserModal
          user={selectedUser}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
        />
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedUser && (
        <ViewUserModal
          user={selectedUser}
          onClose={() => setIsViewModalOpen(false)}
        />
      )}
    </div>
  );
}

// Delete User Modal Component
function DeleteUserModal({
  user,
  onClose,
  onConfirm
}: {
  user: UserResponseDTO;
  onClose: () => void;
  onConfirm: () => void;
}) {
  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);
  return (
    <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
          Eliminar Usuario
        </h3>
        
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
          ¿Estás seguro de que deseas eliminar al usuario <strong>{user.fullName}</strong>?
          Esta acción no se puede deshacer.
        </p>

        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

// View User Modal Component
function ViewUserModal({
  user,
  onClose
}: {
  user: UserResponseDTO;
  onClose: () => void;
}) {
  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
          Detalles del Usuario
        </h3>
        
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <img
              className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 rounded-full object-cover flex-shrink-0"
              src={user.imageUrl || '/images/default-avatar.png'}
              alt={user.fullName}
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-sm sm:text-base lg:text-lg font-medium text-gray-900 truncate">{user.fullName}</h4>
              <p className="text-xs sm:text-sm text-gray-500 truncate">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-500">Rol</label>
              <p className="mt-1 text-xs sm:text-sm text-gray-900">{getRoleDisplayName(user.role as UserRole)}</p>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-500">Estado</label>
              <p className="mt-1 text-xs sm:text-sm text-gray-900">
                {user.isActive ? 'Activo' : 'Inactivo'}
              </p>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-500">Creado</label>
              <p className="mt-1 text-xs sm:text-sm text-gray-900">{formatDate(user.createdAt)}</p>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-500">Último acceso</label>
              <p className="mt-1 text-xs sm:text-sm text-gray-900">
                {user.lastSignInAt ? formatDate(user.lastSignInAt) : 'Nunca'}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-500">Permisos</label>
            <div className="mt-1 flex flex-wrap gap-1">
              {user.permissions.map(permission => (
                <span
                  key={permission}
                  className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4 sm:mt-6">
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}