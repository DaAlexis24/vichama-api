import * as z from 'zod';
import { ZodError } from 'zod';

const EnvSchema = z.object({
    PORT: z.coerce.number(),
    NODE_ENV: z.enum(['dev', 'production', 'test']).default('dev'),
    DEBUG: z.string().optional(),
    PROJECT_NAME: z.string(),
    DATABASE_URL: z.string().optional(),
    PGUSER: z.string().optional(),
    PGPASSWORD: z.string().optional(),
    PGHOST: z.string().optional(),
    PGPORT: z.coerce.number().optional(),
    PGDATABASE: z.string().optional(),
}).superRefine((env, ctx) => {
    if (
        env.DATABASE_URL ||
        (env.PGUSER &&
            env.PGPASSWORD &&
            env.PGHOST &&
            env.PGPORT &&
            env.PGDATABASE)
    ) {
        return;
    }

    ctx.addIssue({
        code: 'custom',
        message:
            'Set DATABASE_URL or all PGUSER, PGPASSWORD, PGHOST, PGPORT and PGDATABASE variables.',
        path: ['DATABASE_URL'],
    });
});

export type Env = z.infer<typeof EnvSchema>;

export let env: Env;

try {
    env = EnvSchema.parse(process.env); // throw Error
} catch (error) {
    console.log(error as ZodError);
    process.exit(1);
}
