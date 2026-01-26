import api from "./api";
import { UserResponse, UpdateProfile, PublicUserInfo } from "@utoto/shared";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

class UserService {
  /**
   * GET /user/profile - Get authenticated user's profile
   */
  async getProfile(): Promise<UserResponse> {
    const response = await api.get<any, ApiResponse<UserResponse>>("/user/profile");
    return response.data;
  }

  /**
   * GET /user/:id - Get public user info by ID
   */
  async getUserById(userId: string): Promise<PublicUserInfo> {
    const response = await api.get<any, ApiResponse<PublicUserInfo>>(`/user/${userId}`);
    return response.data;
  }

  /**
   * PUT /user/profile - Update authenticated user's profile
   */
  async updateProfile(data: UpdateProfile): Promise<UserResponse> {
    const response = await api.put<any, ApiResponse<UserResponse>>("/user/profile", data);
    return response.data;
  }

  /**
   * POST /user/upload-avatar - Upload avatar and auto update profile
   */
  async uploadAvatar(file: File): Promise<{ user: UserResponse; avatar: { url: string; filename: string } }> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<any, ApiResponse<{ user: UserResponse; avatar: { url: string; filename: string } }>>(
      "/user/upload-avatar",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }
}

export const userService = new UserService();
export default userService;
