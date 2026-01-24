import { FastifyInstance } from "fastify";
import {
  createTrip,
  getTripById,
  updateTrip,
  deleteTrip,
  searchTrips,
} from "../controllers/trip.controller";

export async function tripRoutes(fastify: FastifyInstance) {
  fastify.post("/", createTrip);
  fastify.get("/:id", getTripById);
  fastify.patch("/:id", updateTrip);
  fastify.delete("/:id", deleteTrip);
  fastify.get("/", searchTrips);
}
