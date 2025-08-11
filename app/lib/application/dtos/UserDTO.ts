export interface UserResponseDTO {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  imageUrl?: string;
  role: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastSignInAt?: string;
}

export interface UpdateUserRoleDTO {
  role: string;
  permissions: string[];
}

export interface PaginatedUsersDTO {
  users: UserResponseDTO[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface UserStatsDTO {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  usersByRole: Record<string, number>;
}