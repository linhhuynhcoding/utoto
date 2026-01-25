import { FastifyInstance } from "fastify";
import { gpsSSEHandler } from "@/controllers/gps.controller";

export async function gpsRoutes(fastify: FastifyInstance) {
  fastify.get("/sse", {
    sse: true,
  }, gpsSSEHandler)
}
