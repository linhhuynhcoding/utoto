import Fastify from "fastify";
import cors from "@fastify/cors";
import { healthRoutes } from "../routes/health.route";
import { authRoutes } from "../routes/auth.route";
import envConfig, { API_URL } from "@/config";

const fastify = Fastify({ logger: true });

// Run the server!
const start = async () => {
  try {
    const whitelist = ["*"];
    fastify.register(cors, {
      origin: whitelist, // Cho phép tất cả các domain gọi API
      credentials: true, // Cho phép trình duyệt gửi cookie đến server
    });
    await fastify.register(authRoutes, {
      prefix: "/auth",
    });
    await fastify.register(healthRoutes, {
      prefix: "/health",
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
