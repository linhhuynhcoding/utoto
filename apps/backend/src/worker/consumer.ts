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
      console.log({
        value: message.value,
      });
      const raw = JSON.parse(message.value!.toString());

      const event = GpsEventSchema.parse(raw)

      const cache = await RedisCache.getInstance({
        url: envConfig.REDIS_URL
      })

      // process later
      // ...
      if (!event.licenseNumber || !event.last_position) {
        console.warn("Invalid GPS data received:", event);
        return;
      };

      cache.saveLocation({
        licenseNumber: event.licenseNumber!,
        lat: event.last_position[0],
        lng: event.last_position[1]
      })
    },
  });
};

run().catch(console.error);
