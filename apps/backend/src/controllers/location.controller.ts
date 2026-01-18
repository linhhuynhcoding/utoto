import { FastifyReply, FastifyRequest } from "fastify";
import { LocationService } from "@/services/location.service";

const locationService = new LocationService();

export const getProvinces = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const provinces = await locationService.getProvinces();
    return reply.send({ success: true, data: provinces });
  } catch (error) {
    request.log.error(error);
    return reply
      .status(500)
      .send({ success: false, message: "Internal server error" });
  }
};

export const getDistricts = async (
  request: FastifyRequest<{ Params: { provinceCode: string } }>,
  reply: FastifyReply,
) => {
  try {
    const districts = await locationService.getDistricts(
      request.params.provinceCode,
    );
    return reply.send({ success: true, data: districts });
  } catch (error) {
    request.log.error(error);
    return reply
      .status(500)
      .send({ success: false, message: "Internal server error" });
  }
};

export const getWards = async (
  request: FastifyRequest<{ Params: { districtCode: string } }>,
  reply: FastifyReply,
) => {
  try {
    const wards = await locationService.getWards(request.params.districtCode);
    return reply.send({ success: true, data: wards });
  } catch (error) {
    request.log.error(error);
    return reply
      .status(500)
      .send({ success: false, message: "Internal server error" });
  }
};
