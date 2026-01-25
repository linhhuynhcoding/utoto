import { Kafka } from "kafkajs";
import prisma from "@/database";

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
      // Example: Do something with Prisma here
      // await prisma.user.findMany();
    },
  });
};

run().catch(console.error);
