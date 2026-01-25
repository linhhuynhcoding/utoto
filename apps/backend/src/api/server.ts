import Fastify from "fastify";
import cors from "@fastify/cors";
import { authRoutes } from "../routes/auth.route";
import { carRoutes } from "../routes/car.route";
import { locationRoutes } from "../routes/location.route";
import { healthRoutes } from "../routes/health.route";
import { tripRoutes } from "../routes/trip.route";
import envConfig, { API_URL } from "@/config";
import mediaRoutes from "@/routes/media.route";
import staticRoutes from "@/routes/static.route";
import path from "path";
import { createFolder } from "@/utils/helpers";
import fastifyHelmet from "@fastify/helmet";
import fastifySSE from "@fastify/sse";
import { gpsRoutes } from "@/routes/gps.route";

// Serialize BigInt
// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const fastify = Fastify({ logger: true });

// Run the server!
const start = async () => {
  try {
    createFolder(path.resolve(envConfig.UPLOAD_FOLDER));
    const whitelist = [envConfig.CLIENT_URL];
    fastify.register(cors, {
      origin: whitelist, // Cho phép tất cả các domain gọi API
      credentials: true, // Cho phép trình duyệt gửi cookie đến server
    });
    fastify.register(fastifyHelmet, {
      crossOriginResourcePolicy: {
        policy: "cross-origin",
      },
    });
    await fastify.register(fastifySSE, {
      logLevel: "debug"
    });    
    await fastify.register(authRoutes, {
      prefix: "/auth",
    });
    await fastify.register(carRoutes, {
      prefix: "/car",
    });
    await fastify.register(locationRoutes, {
      prefix: "/location",
    });
    await fastify.register(mediaRoutes, {
      prefix: "/media",
    });
    await fastify.register(staticRoutes, {
      prefix: "/static",
    });
    await fastify.register(healthRoutes, {
      prefix: "/health",
    });
    await fastify.register(tripRoutes, {
      prefix: "/trip",
    });
    await fastify.register(gpsRoutes, {
      prefix: "/gps",
    });
    await fastify.listen({
      port: envConfig.PORT,
      host: envConfig.DOCKER ? "0.0.0.0" : "localhost",
    });
    console.log(`Server đang chạy: ${API_URL}`);
  } catch (err) {
    console.log(err);
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
