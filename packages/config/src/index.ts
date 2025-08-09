import { z } from 'zod';

const serverEnvSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.string().optional(),
    HOST: z.string().optional(),
    NEXT_PUBLIC_API_URL: z.string().url().optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export const getServerEnv = (env: NodeJS.ProcessEnv = process.env) =>
    serverEnvSchema.parse(env);


