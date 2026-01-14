import { FastifyInstance } from "fastify";
import { check } from "../controllers/health.controller";

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get("/health", check);
}
