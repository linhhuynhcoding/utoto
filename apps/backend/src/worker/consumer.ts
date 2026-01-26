import { Kafka } from "kafkajs";
import prisma from "@/database";
import { RedisCache } from "@/redis";
import envConfig from "@/config";
import { GpsEvent } from "./types";

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
        value: message.value?.toString(),
      });
      const event = GpsEvent.parse(message.value?.toString())

      const cache = await RedisCache.getInstance({
        url: envConfig.REDIS_URL
      })

      // process later
      // ...

      cache.saveLocation({
        licenseNumber: event.licenseNumber,
        lat: event.lat,
        lng: event.lng
      })
    },
  });
};

run().catch(console.error);
