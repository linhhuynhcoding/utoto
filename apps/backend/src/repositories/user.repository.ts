import prisma from "@/database";
import {
  UserResponse,
  PublicUserInfo,
  UpdateProfile,
} from "@utoto/shared";

export class UserRepository {
  /**
   * Map database user to UserResponse DTO
   */
  private mapToResponse(user: any): UserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone_number: user.phone_number,
      phone_code: user.phone_code,
      dob: user.dob ? user.dob.toISOString() : null,
      avatar: user.avatar,
      isVerified: user.isVerified,
      driver_license_code: user.driver_license_code,
      driver_license_name: user.driver_license_name,
      driver_license_dob: user.driver_license_dob,
      address: user.locations
        ? {
            id: user.locations.id.toString(),
            street: user.locations.street,
            short_address: user.locations.short_address,
            ward_id: user.locations.ward_id,
            district_id: user.locations.district_id,
            province_id: user.locations.province_id,
            lat: user.locations.lat,
            lon: user.locations.lon,
          }
        : null,
    };
  }

  /**
   * Map database user to PublicUserInfo DTO
   */
  private mapToPublicInfo(user: any): PublicUserInfo {
    return {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      isVerified: user.isVerified,
    };
  }

  /**
   * Find user by ID with full details (for authenticated user's own profile)
   */
  async findById(id: string): Promise<UserResponse | null> {
    const user = await prisma.users.findUnique({
      where: { id },
      include: {
        locations: true,
      },
    });

    if (!user) return null;
    return this.mapToResponse(user);
  }

  /**
   * Find user by ID (public info only)
   */
  async findPublicInfoById(id: string): Promise<PublicUserInfo | null> {
    const user = await prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        avatar: true,
        isVerified: true,
      },
    });

    if (!user) return null;
    return this.mapToPublicInfo(user);
  }

  /**
   * Update user basic profile information
   */
  async updateProfile(
    userId: string,
    data: UpdateProfile,
  ): Promise<UserResponse> {
    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.phone_number !== undefined)
      updateData.phone_number = data.phone_number;
    if (data.phone_code !== undefined) updateData.phone_code = data.phone_code;
    if (data.avatar !== undefined) updateData.avatar = data.avatar;
    if (data.dob !== undefined) updateData.dob = new Date(data.dob);

    const user = await prisma.users.update({
      where: { id: userId },
      data: updateData,
      include: {
        locations: true,
      },
    });

    return this.mapToResponse(user);
  }

  /**
   * Check if user exists by ID
   */
  async existsById(id: string): Promise<boolean> {
    const count = await prisma.users.count({
      where: { id },
    });
    return count > 0;
  }

  /**
   * Get trip statistics for a user (as renter)
   */
  async getTripStats(userId: string) {
    const [total, completed, ongoing, cancelled] = await Promise.all([
      // Total trips
      prisma.trips.count({
        where: { renter_id: userId },
      }),
      // Completed trips
      prisma.trips.count({
        where: { 
          renter_id: userId,
          status: 'COMPLETED'
        },
      }),
      // Ongoing trips (in progress)
      prisma.trips.count({
        where: { 
          renter_id: userId,
          status: { in: ['PENDING', 'ONGOING', 'IN_PROGRESS'] }
        },
      }),
      // Cancelled trips
      prisma.trips.count({
        where: { 
          renter_id: userId,
          status: { in: ['CANCELLED', 'REJECTED'] }
        },
      }),
    ]);

    return {
      totalTrips: total,
      completedTrips: completed,
      ongoingTrips: ongoing,
      cancelledTrips: cancelled,
    };
  }
}
