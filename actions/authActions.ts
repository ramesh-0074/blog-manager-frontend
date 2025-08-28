import { apiClient } from "@/lib/api-interceptor";
import { User } from "@/store/authStore";

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

export const authAPI = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    return apiClient.post("/auth/register", data);
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    return apiClient.post("/auth/login", data);
  },

  getUserDetails: async (): Promise<UserDetailsResponse> => {
    return apiClient.get("/auth/user-details");
  },

  updateProfile: async (
    data: UpdateProfileData
  ): Promise<{ success: boolean; message: string; data: { user: User } }> => {
    return apiClient.put("/auth/profile", data);
  },
  getAllUsers: async (
    params?: Record<string, string>
  ): Promise<UsersListResponse> => {
    const queryString = params ? new URLSearchParams(params).toString() : "";
    return apiClient.get(`/auth/users${queryString ? `?${queryString}` : ""}`);
  },

  updateUserRole: async (
    userId: string,
    role: "user" | "admin"
  ): Promise<UpdateRoleResponse> => {
    return apiClient.put(`/auth/users/${userId}/role`, { role });
  },

  deleteUser: async (
    userId: string
  ): Promise<{ success: boolean; message: string }> => {
    return apiClient.delete(`/auth/users/${userId}`);
  },
};
