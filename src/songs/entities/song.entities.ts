import { env } from '../../config/env.ts';
import debug from 'debug';
import z from 'zod';

const log = debug(`${env.PROJECT_NAME}:entity:song`);
log('Loaded module');

export const SongSchema = z.object({
    id: z.uuidv4(),
    title: z.string(),
    artist: z.string(),
    duration_seconds: z.number(),
    image_url: z.url(),
    audio_url: z.url(),
});

export type Song = z.infer<typeof SongSchema>;

export const SongCreateSchema = SongSchema.omit({ id: true });
export const SongUpdateSchema = SongSchema.partial().omit({ id: true });

export type AnimalCreateDTO = z.infer<typeof SongCreateSchema>;
export type AnimalUpdateDTO = z.infer<typeof SongUpdateSchema>;
