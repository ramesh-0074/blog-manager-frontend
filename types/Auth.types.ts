export interface UsersResponse {
  data: {
    users: User[];
    pagination: {
      totalUsers: number;
      totalPages: number;
      currentPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
  message: string;
}

export type User = {
  email: string;
  _id: string;
  role: string;
  name: string;
  updatedAt?: string;
  createdAt?: string;
};

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
  hydrated: boolean;
  setHydrated: () => void;
}

export interface UsersData {
  data: {
    users: User[];
    pagination: {
      totalUsers: number;
      totalPages: number;
      currentPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
  message: string;
}

export interface UserManagementClientProps {
  initialData: UsersData;
  currentPage: number;
  limit: number;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      _id: string;
      name: string;
      email: string;
      role: string;
    };
    token: string;
  };
}

export interface UserDetailsResponse {
  success: boolean;
  data: {
    user: {
      _id: string;
      name: string;
      email: string;
      role: string;
      createdAt: string;
    };
  };
}

export interface UpdateProfileData {
  name: string;
  email: string;
}

export interface UsersListResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalUsers: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface UpdateRoleResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}
