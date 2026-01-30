import { FastifyInstance } from "fastify";
import {
  createPayment,
  verifyPayment,
  getPaymentStatus,
  getPaymentByTripId,
} from "@/controllers/payment.controller";
import { authenticate } from "@/middleware/auth.middleware";

export async function paymentRoutes(fastify: FastifyInstance) {
  // Create payment for trip (requires authentication)
  fastify.post("/create", { preHandler: [authenticate] }, createPayment);

  // Verify payment manually (requires authentication)
  fastify.get<{ Params: { trip_id: string } }>(
    "/verify/:trip_id",
    { preHandler: [authenticate] },
    verifyPayment,
  );

  // Get payment status for polling (requires authentication)
  fastify.get<{ Params: { payment_id: string } }>(
    "/status/:payment_id",
    { preHandler: [authenticate] },
    getPaymentStatus,
  );

  // Get payment by trip_id (requires authentication)
  fastify.get<{ Params: { trip_id: string } }>(
    "/trip/:trip_id",
    { preHandler: [authenticate] },
    getPaymentByTripId,
  );
}
