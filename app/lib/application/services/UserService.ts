import { 
  UserResponseDTO, 
  UpdateUserRoleDTO, 
  PaginatedUsersDTO,
  UserStatsDTO 
} from '@/app/lib/application/dtos/UserDTO';

export interface IUserService {
  getAllUsers(filters?: any, pagination?: any): Promise<PaginatedUsersDTO>;
  getUserById(id: string): Promise<UserResponseDTO>;
  updateUserRole(id: string, data: UpdateUserRoleDTO): Promise<UserResponseDTO>;
  deleteUser(id: string): Promise<void>;
  getUserStats(): Promise<UserStatsDTO>;
  searchUsers(query: string): Promise<UserResponseDTO[]>;
}

export class UserService implements IUserService {
  private baseUrl = '/api/users';

  async getAllUsers(filters?: any, pagination?: any): Promise<PaginatedUsersDTO> {
    const params = new URLSearchParams();
    if (filters?.role) params.set('role', filters.role);
    if (filters?.isActive !== undefined) params.set('isActive', filters.isActive.toString());
    if (filters?.searchTerm) params.set('searchTerm', filters.searchTerm);
    if (pagination?.page) params.set('page', pagination.page.toString());
    if (pagination?.limit) params.set('limit', pagination.limit.toString());
    if (pagination?.sortBy) params.set('sortBy', pagination.sortBy);
    if (pagination?.sortOrder) params.set('sortOrder', pagination.sortOrder);

    const response = await fetch(`${this.baseUrl}?${params}`);
    if (!response.ok) throw new Error('Error al obtener usuarios');
    return response.json();
  }

  async getUserById(id: string): Promise<UserResponseDTO> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) throw new Error('Error al obtener usuario');
    return response.json();
  }

  async updateUserRole(id: string, data: UpdateUserRoleDTO): Promise<UserResponseDTO> {
    const response = await fetch(`${this.baseUrl}/${id}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al actualizar rol de usuario');
    }
    return response.json();
  }

  async deleteUser(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al eliminar usuario');
    }
  }

  async getUserStats(): Promise<UserStatsDTO> {
    const response = await fetch(`${this.baseUrl}/stats`);
    if (!response.ok) throw new Error('Error al obtener estadísticas de usuarios');
    return response.json();
  }

  async searchUsers(query: string): Promise<UserResponseDTO[]> {
    const params = new URLSearchParams({ q: query });
    const response = await fetch(`${this.baseUrl}/search?${params}`);
    if (!response.ok) throw new Error('Error al buscar usuarios');
    return response.json();
  }
}