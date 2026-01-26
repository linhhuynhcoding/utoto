import Fastify from "fastify";
import cors from "@fastify/cors";
import { authRoutes } from "../routes/auth.route";
import { carRoutes } from "../routes/car.route";
import { locationRoutes } from "../routes/location.route";
import { healthRoutes } from "../routes/health.route";
import { userRoutes } from "../routes/user.route";
import { tripRoutes } from "../routes/trip.route";
import envConfig, { API_URL } from "@/config";
import mediaRoutes from "@/routes/media.route";
import staticRoutes from "@/routes/static.route";
import { verificationRoutes } from "@/routes/verification.route";
import path from "path";
import { createFolder } from "@/utils/helpers";
import fastifyHelmet from "@fastify/helmet";
import fastifySSE from "@fastify/sse";
import { gpsRoutes } from "@/routes/gps.route";
import { RedisCache } from "@/redis";

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
    fastify.register(cors, {
      origin: [envConfig.CORS_ORIGIN], 
      credentials: true, 
    });
    fastify.register(require("@fastify/multipart"), {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
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
    await fastify.register(userRoutes, {
      prefix: "/user",
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
    await fastify.register(verificationRoutes, {
      prefix: "/verification",
    });
    await fastify.register(gpsRoutes, {
      prefix: "/gps",
    });
    await fastify.listen({
      port: envConfig.PORT,
      host: envConfig.DOCKER ? "0.0.0.0" : "localhost",
    });
    console.log(`Server đang chạy: ${API_URL}`);

    // trigger connect redis
    const _ = await RedisCache.getInstance({
            url: envConfig.REDIS_URL
          })
          
  } catch (err) {
    console.log(err);
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
