import Fastify from "fastify";
import websocket from "@fastify/websocket";
import envConfig, { API_URL } from "@/config";
import { kafkaProducer } from "@/kafka/producer";
import { handleGpsWebSocket } from "@/handlers/websocket";

const fastify = Fastify({ logger: true });

const start = async () => {
  try {
    // Register WebSocket plugin
    await fastify.register(websocket);

    // Initial Kafka Producer connection
    await kafkaProducer.connect();

    // Define WebSocket route
    fastify.register(async (fastify) => {
      fastify.get("/gps", { websocket: true }, handleGpsWebSocket);
    });

    // Health check route
    fastify.get("/health", async () => {
      return { status: "ok", service: "gps-service" };
    });

    await fastify.listen({
      port: envConfig.PORT,
      host: envConfig.DOCKER ? "0.0.0.0" : "localhost",
    });

    console.log(`GPS Service is running at: ${API_URL}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
