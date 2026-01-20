import { FastifyInstance } from "fastify";
import {
  getProvinces,
  getDistricts,
  getWards,
} from "@/controllers/location.controller";

export async function locationRoutes(fastify: FastifyInstance) {
  fastify.get("/provinces", getProvinces);
  fastify.get("/districts/:provinceCode", getDistricts);
  fastify.get("/wards/:districtCode", getWards);
}
