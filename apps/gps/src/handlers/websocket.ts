import { FastifyRequest } from "fastify";
import { kafkaProducer } from "@/kafka/producer";
import WebSocket from "ws";
import {GpsEventSchema} from "@utoto/shared";

export const handleGpsWebSocket = (socket: WebSocket, req: FastifyRequest) => {
  console.log("New WebSocket connection established");

  socket.on("message", async (message: Buffer) => {
    try {
      const data = JSON.parse(message.toString());
      console.log("Received GPS data:", data);
      
      
      const validation = GpsEventSchema.safeParse(data.data);
      if (!validation.success) {
        console.warn("Invalid GPS data received:", validation.error.format());
        socket.send(JSON.stringify({ error: "Invalid GPS data format" }));
        return;
      }

      await kafkaProducer.publishGpsEvent(validation.data);

      // socket.send(
      //   JSON.stringify({
      //     status: "ok",
      //     received: validation.data.licenseNumber,
      //   }),
      // );
    } catch (error) {
      console.error("Error processing WebSocket message:", error);
      socket.send(JSON.stringify({ error: "Failed to process message" }));
    }
  });

  socket.on("close", () => {
    console.log("WebSocket connection closed");
  });

  socket.on("error", (error: Error) => {
    console.error("WebSocket error:", error);
  });
};
