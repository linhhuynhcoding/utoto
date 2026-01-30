import { FastifyReply, FastifyRequest } from "fastify";
import { PaymentService } from "@/services/payment.service";
import { CreatePaymentSchema } from "@utoto/shared";

const paymentService = new PaymentService();

/**
 * POST /payment/create
 * Create payment for a trip
 * Generates QR code and payment instructions
 */
export const createPayment = async (
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

    // Validate request body
    const body = CreatePaymentSchema.parse(request.body);

    // Create payment
    const payment = await paymentService.createPayment(body.trip_id);

    return reply.status(201).send({
      success: true,
      data: payment,
      message: "Payment created successfully",
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
      error instanceof Error ? error.message : "Failed to create payment";
    return reply.status(400).send({
      success: false,
      message,
    });
  }
};

/**
 * GET /payment/verify/:trip_id
 * Manually verify payment for a trip
 * Checks SePay API for transaction
 */
export const verifyPayment = async (
  request: FastifyRequest<{ Params: { trip_id: string } }>,
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

    const { trip_id } = request.params;

    // Verify payment
    const result = await paymentService.verifyPayment(trip_id);

    return reply.send({
      success: result.success,
      data: result,
      message: result.message,
    });
  } catch (error) {
    request.log.error(error);
    const message =
      error instanceof Error ? error.message : "Failed to verify payment";
    return reply.status(400).send({
      success: false,
      message,
    });
  }
};

/**
 * GET /payment/status/:payment_id
 * Get payment status (for polling)
 * Checks current status from DB and optionally from SePay
 */
export const getPaymentStatus = async (
  request: FastifyRequest<{ Params: { payment_id: string } }>,
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

    const payment_id = BigInt(request.params.payment_id);

    // Check payment status
    const result = await paymentService.checkPaymentStatus(payment_id);

    return reply.send({
      success: true,
      data: result,
    });
  } catch (error) {
    request.log.error(error);
    const message =
      error instanceof Error ? error.message : "Failed to get payment status";
    return reply.status(400).send({
      success: false,
      message,
    });
  }
};

/**
 * GET /payment/trip/:trip_id
 * Get payment details for a trip
 */
export const getPaymentByTripId = async (
  request: FastifyRequest<{ Params: { trip_id: string } }>,
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

    const { trip_id } = request.params;

    const payment = await paymentService.getPaymentByTripId(trip_id);

    if (!payment) {
      return reply.status(404).send({
        success: false,
        message: "Payment not found for this trip",
      });
    }

    return reply.send({
      success: true,
      data: payment,
    });
  } catch (error) {
    request.log.error(error);
    const message =
      error instanceof Error ? error.message : "Failed to get payment";
    return reply.status(400).send({
      success: false,
      message,
    });
  }
};
