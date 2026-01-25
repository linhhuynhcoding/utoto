import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "@/database";
import {
  CarSettingsResponse,
  CarBrand,
  Feature,
  CreateCarSchema,
  UpdateCarSchema,
  CarFilterSchema,
} from "@utoto/shared";
import { CarService } from "@/services/car.service";

const carService = new CarService();

export const getCarSettings = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const [brands, features] = await Promise.all([
      prisma.brands.findMany({
        include: {
          car_models: true,
        },
      }),
      prisma.features.findMany(),
    ]);

    const mappedBrands: CarBrand[] = brands.map((b: any) => ({
      id: b.brand_id.toString(),
      name: b.brand_name,
      logo: b.logo,
      models: b.car_models.map((m: any) => ({
        id: m.model_id.toString(),
        name: m.model_name,
      })),
    }));

    const mappedFeatures: Feature[] = features.map((f: any) => ({
      id: f.id,
      name: f.name,
      logo: f.logo,
    }));

    const response: CarSettingsResponse = {
      success: true,
      data: {
        brands: mappedBrands,
        features: mappedFeatures,
      },
    };

    return reply.status(200).send(response);
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createCar = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const body = CreateCarSchema.parse(request.body);
    // TODO: Get ownerId from auth middleware
    const ownerId = (request as any).user?.id;
    if (!ownerId) {
      return reply.status(401).send({ success: false, message: "Unauthorized" });
    }

    const car = await carService.createCar(ownerId, body);
    return reply.status(201).send({ success: true, data: car });
  } catch (error) {
    request.log.error(error);
    return reply.status(400).send({
      success: false,
      message: error instanceof Error ? error.message : "Bad Request",
    });
  }
};

export const getCarById = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  try {
    const car = await carService.getCarById(request.params.id);
    if (!car)
      return reply
        .status(404)
        .send({ success: false, message: "Car not found" });
    return reply.send({ success: true, data: car });
  } catch (error) {
    request.log.error(error);
    return reply
      .status(500)
      .send({ success: false, message: "Internal server error" });
  }
};

export const updateCar = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  try {
    const body = UpdateCarSchema.parse(request.body);
    const car = await carService.updateCar(request.params.id, body);
    return reply.send({ success: true, data: car });
  } catch (error) {
    request.log.error(error);
    return reply.status(400).send({
      success: false,
      message: error instanceof Error ? error.message : "Bad Request",
    });
  }
};

export const deleteCar = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  try {
    await carService.deleteCar(request.params.id);
    return reply.send({ success: true, message: "Car deleted successfully" });
  } catch (error) {
    request.log.error(error);
    return reply
      .status(500)
      .send({ success: false, message: "Internal server error" });
  }
};

export const searchCars = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const query = CarFilterSchema.parse(request.query);
    const result = await carService.searchCars(query);
    return reply.send({ success: true, ...result });
  } catch (error) {
    request.log.error(error);
    return reply.status(400).send({
      success: false,
      message: error instanceof Error ? error.message : "Bad Request",
    });
  }
};

export const getCarCalendar = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  try {
    const calendar = await carService.getCarCalendar(request.params.id);
    return reply.send({ success: true, data: calendar });
  } catch (error) {
    request.log.error(error);
    return reply
      .status(500)
      .send({ success: false, message: "Internal server error" });
  }
};
