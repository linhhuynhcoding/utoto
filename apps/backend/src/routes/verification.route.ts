import { FastifyInstance } from "fastify";
import { verifyDrivingLicense } from "@/controllers/verification.controller";
import { authenticate } from "@/middleware/auth.middleware";

export async function verificationRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/driving-license",
    {
      preHandler: [authenticate],
    },
    verifyDrivingLicense
  );
}
