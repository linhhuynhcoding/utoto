import Fastify from "fastify";
import cors from "@fastify/cors";
import envConfig, { API_URL } from "../config";
import { healthRoutes } from "../routes/health.route";

const fastify = Fastify({ logger: true });

// Run the server!
const start = async () => {
  try {
    const whitelist = ["*"];
    fastify.register(cors, {
      origin: whitelist, // Cho phép tất cả các domain gọi API
      credentials: true, // Cho phép trình duyệt gửi cookie đến server
    });
    await fastify.listen({
      port: envConfig.PORT,
      host: envConfig.DOCKER ? "0.0.0.0" : "localhost",
    });
    await fastify.register(healthRoutes, {
      prefix: "/health",
    });
    console.log(`Server đang chạy: ${API_URL}`);
  } catch (err) {
    console.log(err);
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
