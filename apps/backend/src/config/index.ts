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
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  CORS_ORIGIN: z.string().default("*"),
  KAFKA_BROKERS: z.string().transform((val) => val.split(",")),
  FPT_AI_API_KEY: z.string(),
  UPLOAD_FOLDER: z.string(),
  CLIENT_URL: z.string(),
  PRODUCTION: z.enum(["true", "false"]).transform((val) => val === "true"),
  DOCKER: z.enum(["true", "false"]).transform((val) => val === "true"),
  PRODUCTION_URL: z.string(),
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
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof configSchema> {}
  }
}
