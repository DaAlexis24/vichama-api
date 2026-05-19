import { env } from '../../../config/env.ts';
import debug from 'debug';
import z from 'zod';

const log = debug(`${env.PROJECT_NAME}:entity:song`);
log('Loaded module');

export const SongSchema = z.object({
    id: z.uuidv4(),
    title: z.string().max(255),
    artist: z.string().max(255),
    duration_seconds: z.number().int().positive(),
    image_url: z.url(),
    audio_url: z.url(),
    created_at: z.iso.datetime(),
    updated_at: z.iso.datetime(),
});

export type Song = z.infer<typeof SongSchema>;

export const SongCreateSchema = SongSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
});
export const SongUpdateSchema = SongSchema.partial().omit({ id: true });

export type SongCreateDTO = z.infer<typeof SongCreateSchema>;
export type SongUpdateDTO = z.infer<typeof SongUpdateSchema>;
