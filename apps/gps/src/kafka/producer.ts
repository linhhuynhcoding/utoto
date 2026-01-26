import { Kafka, Producer } from "kafkajs";
import envConfig from "@/config";

class KafkaProducer {
  private static instance: KafkaProducer;
  private producer: Producer;

  private constructor() {
    const kafka = new Kafka({
      clientId: envConfig.KAFKA_CLIENT_ID,
      brokers: [envConfig.KAFKA_BROKER],
    });

    this.producer = kafka.producer();
  }

  public static getInstance(): KafkaProducer {
    if (!KafkaProducer.instance) {
      KafkaProducer.instance = new KafkaProducer();
    }
    return KafkaProducer.instance;
  }

  public async connect() {
    try {
      await this.producer.connect();
      console.log("Kafka Producer connected successfully");
    } catch (error) {
      console.error("Error connecting Kafka Producer:", error);
    }
  }

  public async disconnect() {
    await this.producer.disconnect();
  }

  public async publishGpsEvent(data: any) {
    try {
      await this.producer.send({
        topic: envConfig.KAFKA_TOPIC,
        messages: [{ value: JSON.stringify(data) }],
      });
      console.log(
        `Published GPS event for ${data.licenseNumber} to topic ${envConfig.KAFKA_TOPIC}`,
      );
    } catch (error) {
      console.error("Error publishing GPS event:", error);
    }
  }
}

export const kafkaProducer = KafkaProducer.getInstance();
