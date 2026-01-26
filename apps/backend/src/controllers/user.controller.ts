import { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "@/services/user.service";
import { UpdateProfileSchema } from "@utoto/shared";
import { uploadAvatar } from "@/controllers/media.controller";

const userService = new UserService();

/**
 * GET /user/profile
 * Get profile userss
 */
export const getProfile = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const userId = (request as any).user?.id;
    if (!userId) {
      return reply.status(401).send({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await userService.getUserProfile(userId);
    return reply.send({
      success: true,
      data: user,
    });
  } catch (error) {
    request.log.error(error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return reply.status(500).send({
      success: false,
      message,
    });
  }
};

/**
 * GET /user/:id
 * Get public user information by ID
 */
export const getUserById = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  try {
    const { id } = request.params;
    const user = await userService.getPublicUserInfo(id);
    return reply.send({
      success: true,
      data: user,
    });
  } catch (error) {
    request.log.error(error);
    const message = error instanceof Error ? error.message : "User not found";
    return reply.status(404).send({
      success: false,
      message,
    });
  }
};

/**
 * PUT /user/profile
 * Update authenticated user's profile
 */
export const updateProfile = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const userId = (request as any).user?.id;
    if (!userId) {
      return reply.status(401).send({
        success: false,
        message: "Unauthorized",
      });
    }

    // Validate request body with Zod
    const body = UpdateProfileSchema.parse(request.body);

    const user = await userService.updateProfile(userId, body);
    return reply.send({
      success: true,
      data: user,
      message: "Profile updated successfully",
    });
  } catch (error) {
    request.log.error(error);

    // Handle Zod validation errors
    if ((error as any).name === "ZodError") {
      return reply.status(400).send({
        success: false,
        message: "Validation error",
        errors: (error as any).errors,
      });
    }

    const message =
      error instanceof Error ? error.message : "Failed to update profile";
    return reply.status(400).send({
      success: false,
      message,
    });
  }
};

/**
 * POST /user/upload-avatar
 * Upload avatar và tự động update vào profile
 * Upload file + Update DB
 */
export const uploadAndUpdateAvatar = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const userId = (request as any).user?.id;
    if (!userId) {
      return reply.status(401).send({
        success: false,
        message: "Unauthorized",
      });
    }

    // Step 1: Upload file
    const data = await request.file();
    if (!data) {
      return reply.status(400).send({
        success: false,
        message: "Không tìm thấy file",
      });
    }

    const { url, filename } = await uploadAvatar(data);

    // Step 2: Auto update profile với avatar URL
    const user = await userService.updateProfile(userId, { avatar: url });

    return reply.send({
      success: true,
      message: "Upload và cập nhật avatar thành công",
      data: {
        user,
        avatar: {
          url,
          filename,
        },
      },
    });
  } catch (error) {
    request.log.error(error);
    const message =
      error instanceof Error ? error.message : "Upload avatar thất bại";
    return reply.status(400).send({
      success: false,
      message,
    });
  }
};
