import { defineConfig } from 'drizzle-kit';
import { serverConfig } from '@fsapp/config';

export default defineConfig({
    schema: './src/db/schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: serverConfig.POSTGRES_URL,
    },
});