import { z } from "zod";
import { config } from "dotenv";
import { join } from "path";

// Load environment variables based on NODE_ENV
const nodeEnv = process.env.NODE_ENV || "development";
const envFile = `.env.${nodeEnv}`;

// Load the environment file from the project root
config({ path: join(process.cwd(), "../../", envFile) });

const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.string().default("4000"),
  HOST: z.string().default("0.0.0.0"),
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  POSTGRES_URL: z
    .string()
    .url()
    .default("postgresql://postgres:postgres@localhost:5432/fullstack_app"),
  POSTGRES_HOST: z.string().default("localhost"),
  POSTGRES_PORT: z.string().default("5432"),
  POSTGRES_USER: z.string().default("postgres"),
  POSTGRES_PASSWORD: z.string().default("postgres"),
  POSTGRES_DB: z.string().default("fullstack_app"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export const getServerEnv = (env: NodeJS.ProcessEnv = process.env) =>
  serverEnvSchema.parse(env);

// Export a pre-parsed config object for easy access
export const serverConfig = getServerEnv();
