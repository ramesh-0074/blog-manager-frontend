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
      users: User[]
      pagination: {
        totalUsers: number
        totalPages: number
        currentPage: number
        hasNextPage: boolean
        hasPrevPage: boolean
      }
    }
    message: string
  }
  
  export interface UserManagementClientProps {
    initialData: UsersData
    currentPage: number
    limit: number
  }