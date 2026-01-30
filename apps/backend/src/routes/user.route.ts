import { FastifyInstance } from "fastify";
import {
  getProfile,
  getUserById,
  updateProfile,
  uploadAndUpdateAvatar,
  getTripStats,
} from "@/controllers/user.controller";
import { authenticate } from "@/middleware/auth.middleware";

export async function userRoutes(fastify: FastifyInstance) {

  // Get authenticated user's profile (requires authentication)
  fastify.get("/profile", { preHandler: [authenticate] }, getProfile);

  // Update profile (requires authentication)
  fastify.put("/profile", { preHandler: [authenticate] }, updateProfile);

  // Upload avatar and auto update profile
  fastify.post(
    "/upload-avatar",
    { preHandler: [authenticate] },
    uploadAndUpdateAvatar,
  );

  // Get trip statistics (requires authentication)
  fastify.get("/trips/stats", { preHandler: [authenticate] }, getTripStats);

  // Get public user info by ID (no authentication required)
  fastify.get<{ Params: { id: string } }>("/:id", getUserById);
}
