import { FastifyReply, FastifyRequest } from "fastify";
import { TripService } from "@/services/trip.service";
import {
  CreateTripSchema,
  UpdateTripSchema,
  TripFilterSchema,
} from "@utoto/shared";

const tripService = new TripService();

export const createTrip = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const body = CreateTripSchema.parse(request.body);
    const trip = await tripService.createTrip(body);
    return reply.status(201).send({ success: true, data: trip });
  } catch (error) {
    request.log.error(error);
    return reply.status(400).send({
      success: false,
      message: error instanceof Error ? error.message : "Bad Request",
    });
  }
};

export const getTripById = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  try {
    const trip = await tripService.getTripById(request.params.id);
    if (!trip) {
      return reply
        .status(404)
        .send({ success: false, message: "Trip not found" });
    }
    return reply.send({ success: true, data: trip });
  } catch (error) {
    request.log.error(error);
    return reply
      .status(500)
      .send({ success: false, message: "Internal server error" });
  }
};

export const updateTrip = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  try {
    const body = UpdateTripSchema.parse(request.body);
    const trip = await tripService.updateTrip(request.params.id, body);
    return reply.send({ success: true, data: trip });
  } catch (error) {
    request.log.error(error);
    return reply.status(400).send({
      success: false,
      message: error instanceof Error ? error.message : "Bad Request",
    });
  }
};

export const deleteTrip = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  try {
    await tripService.deleteTrip(request.params.id);
    return reply.send({ success: true, message: "Trip deleted successfully" });
  } catch (error) {
    request.log.error(error);
    return reply
      .status(500)
      .send({ success: false, message: "Internal server error" });
  }
};

export const searchTrips = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const query = TripFilterSchema.parse(request.query);
    const result = await tripService.searchTrips(query);
    return reply.send({ success: true, ...result });
  } catch (error) {
    request.log.error(error);
    return reply.status(400).send({
      success: false,
      message: error instanceof Error ? error.message : "Bad Request",
    });
  }
};
