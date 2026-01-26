import { z } from "zod";

const configSchema = z.object({
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_AUTHORIZED_REDIRECT_URI: z.string(),
  API_URL: z.string(),
});

const configProject = configSchema.safeParse({
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  GOOGLE_AUTHORIZED_REDIRECT_URI: import.meta.env
    .VITE_GOOGLE_AUTHORIZED_REDIRECT_URI,
  API_URL: import.meta.env.VITE_API_URL,
});

if (!configProject.success) {
  console.error(configProject.error);
  throw new Error("Các khai báo biến môi trường không hợp lệ");
}

const envConfig = configProject.data;

console.log(`env: ${envConfig}`)

export default envConfig;
