import { FastifyInstance } from "fastify";
import {
  getCarSettings,
  createCar,
  getCarById,
  updateCar,
  deleteCar,
  searchCars,
  getCarCalendar,
} from "@/controllers/car.controller";

import { authenticate } from "@/middleware/auth.middleware";

export async function carRoutes(fastify: FastifyInstance) {
  fastify.get("/car-settings", getCarSettings);
  fastify.post("/", { preHandler: [authenticate] }, createCar);
  fastify.get("/search", searchCars);
  fastify.get<{ Params: { id: string } }>("/:id/calendar", getCarCalendar);
  fastify.get<{ Params: { id: string } }>("/:id", getCarById);
  fastify.put<{ Params: { id: string } }>(
    "/:id",
    { preHandler: [authenticate] },
    updateCar,
  );
  fastify.delete<{ Params: { id: string } }>(
    "/:id",
    { preHandler: [authenticate] },
    deleteCar,
  );
}
