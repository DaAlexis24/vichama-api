import * as z from 'zod';
import { ZodError } from 'zod';

const EnvSchema = z.object({
    PORT: z.coerce.number(),
    NODE_ENV: z.enum(['dev', 'production', 'test']).default('dev'),
    DEBUG: z.string().optional(),
    PROJECT_NAME: z.string(),
    PGUSER: z.string(),
    PGPASSWORD: z.string(),
    PGHOST: z.string(),
    PGPORT: z.coerce.number(),
    PGDATABASE: z.string(),
});

export type Env = z.infer<typeof EnvSchema>;

export let env: Env;

try {
    env = EnvSchema.parse(process.env); // throw Error
} catch (error) {
    console.log(error as ZodError);
    process.exit(1);
}
