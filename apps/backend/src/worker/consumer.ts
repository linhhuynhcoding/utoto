import { Kafka } from "kafkajs";
import prisma from "@/database";
import { RedisCache } from "@/redis";
import { GpsEventSchema } from "@utoto/shared";

import envConfig from "@/config";

const kafka = new Kafka({
  clientId: "my-app",
  brokers: envConfig.KAFKA_BROKERS,
});

const consumer = kafka.consumer({ groupId: "test-group" });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "test-topic", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      // console.log({
      //   value: message.value!.toString(),
      // });
      const raw = JSON.parse(message.value!.toString());

      const event = GpsEventSchema.parse(raw);
      console.log("event", event);

      const cache = await RedisCache.getInstance({
        url: envConfig.REDIS_URL,
      });

      if (
        !event.licenseNumber ||
        (!event.last_position &&
          (event.lat === undefined || event.lng === undefined))
      ) {
        // If it's a state change or position update, we need either last_position or lat/lng
        if (raw.type !== "change_state") {
          console.warn("Invalid GPS data received:", event);
          return;
        }
      }

      // Behavior labeling logic
      let behavior = "NORMAL";
      if (event.speed && event.speed > 80) {
        behavior = "SPEEDING";
      }
      // You could add HARD_BRAKING logic here by comparing with previous speed from cache

      cache.saveLocation({
        licenseNumber: event.licenseNumber!,
        lat: event.lat ?? event.last_position[0],
        lng: event.lng ?? event.last_position[1],
        speed: event.speed,
        total_distance: event.total_distance,
        state: event.state,
        timestamp: event.timestamp,
        behavior: behavior,
      });

      // Record to database
      if (event.carId) {
        await prisma.gps_events.create({
          data: {
            car_id: event.carId,
            license_number: event.licenseNumber!,
            lat: event.lat ?? event.last_position[0],
            lng: event.lng ?? event.last_position[1],
            speed: event.speed,
            distance: event.distance,
            total_distance: event.total_distance,
            state: event.state,
            behavior: behavior,
            timestamp: event.timestamp ? new Date(event.timestamp) : new Date(),
          },
        });
      }
    },
  });
};

run().catch(console.error);
