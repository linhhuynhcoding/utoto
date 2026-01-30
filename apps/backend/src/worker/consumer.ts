import { Kafka } from "kafkajs";
import prisma from "@/database";
import envConfig from "@/config";
import { startPaymentChecker } from "./payment-checker";

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

  // Start payment checker worker
  console.log("[Worker] Starting Payment Checker...");
  startPaymentChecker();
};

run().catch(console.error);
