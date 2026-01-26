import fs from "fs";
import path from "path";
import z from "zod";
import { config } from "dotenv";

config({
  path: ".env",
});

const checkEnv = async () => {
  const chalk = (await import("chalk")).default;
  if (!fs.existsSync(path.resolve(".env"))) {
    console.log(chalk.red(`Không tìm thấy file môi trường .env`));
    process.exit(1);
  }
};
checkEnv();

const configSchema = z.object({
  PORT: z.coerce.number().default(4001),
  KAFKA_BROKER: z.string().default("localhost:9092"),
  KAFKA_CLIENT_ID: z.string().default("gps-service"),
  KAFKA_TOPIC: z.string().default("test-topic"),
  PRODUCTION: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .default("false"),
  DOCKER: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .default("false"),
  PRODUCTION_URL: z.string().optional(),
});

const configServer = configSchema.safeParse(process.env);

if (!configServer.success) {
  console.error(configServer.error.issues);
  throw new Error("Các giá trị khai báo trong file .env không hợp lệ");
}

const envConfig = configServer.data;

export const API_URL = envConfig.PRODUCTION
  ? envConfig.PRODUCTION_URL
  : `http://localhost:${envConfig.PORT}`;

export default envConfig;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof configSchema> {}
  }
}
