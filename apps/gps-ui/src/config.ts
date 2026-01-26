import { z } from "zod";

const configSchema = z.object({
  API_URL: z.string().default("http://localhost:4000"),
  WS_URL: z.string().default("ws://localhost:4001/gps"),
});

const env = {
  API_URL: import.meta.env.VITE_API_URL,
  WS_URL: import.meta.env.VITE_WS_URL,
};

const parsed = configSchema.safeParse(env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.format());
}

export const config = parsed.success
  ? parsed.data
  : {
      API_URL: "http://localhost:4000",
      WS_URL: "ws://localhost:4001/gps",
    };
