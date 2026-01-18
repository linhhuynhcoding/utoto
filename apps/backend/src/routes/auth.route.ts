import { FastifyInstance } from "fastify";
import { googleCallback } from "@/controllers/auth.controller";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/google/callback", googleCallback);
}
