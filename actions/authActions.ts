import { apiClient } from "@/lib/api-interceptor";
import {
  AuthResponse,
  LoginData,
  RegisterData,
  UpdateProfileData,
  UpdateRoleResponse,
  User,
  UserDetailsResponse,
  UsersListResponse,
} from "@/types/Auth.types";

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
