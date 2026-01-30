import {
  UserResponse,
  PublicUserInfo,
  UpdateProfile,
  TripStats,
} from "@utoto/shared";
import { UserRepository } from "@/repositories/user.repository";

export class UserService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  /**
   * Get user's own profile (authenticated user)
   */
  async getUserProfile(userId: string): Promise<UserResponse> {
    const user = await this.repository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  /**
   * Get public user info by ID (for displaying other users)
   */
  async getPublicUserInfo(userId: string): Promise<PublicUserInfo> {
    const user = await this.repository.findPublicInfoById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  /**
   * Update user profile
   * Business logic: validate data, check permissions, etc.
   */
  async updateProfile(
    userId: string,
    data: UpdateProfile,
  ): Promise<UserResponse> {
    // Check if user exists
    const exists = await this.repository.existsById(userId);
    if (!exists) {
      throw new Error("User not found");
    }

    // Additional business logic validations can go here
    // For example: check if phone number is already used by another user

    return await this.repository.updateProfile(userId, data);
  }

  /**
   * Get trip statistics for user
   * Returns total trips, completed, ongoing, cancelled
   */
  async getUserTripStats(userId: string): Promise<TripStats> {
    // Check if user exists
    const exists = await this.repository.existsById(userId);
    if (!exists) {
      throw new Error("User not found");
    }

    return await this.repository.getTripStats(userId);
  }
}
