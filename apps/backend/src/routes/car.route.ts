import { FastifyInstance } from "fastify";
import {
  getCarSettings,
  createCar,
  getCarById,
  updateCar,
  deleteCar,
  searchCars,
} from "@/controllers/car.controller";

export async function carRoutes(fastify: FastifyInstance) {
  fastify.get("/car-settings", getCarSettings);
  fastify.post("/", createCar);
  fastify.get("/search", searchCars);
  fastify.get("/:id", getCarById);
  fastify.put("/:id", updateCar);
  fastify.delete("/:id", deleteCar);
}
