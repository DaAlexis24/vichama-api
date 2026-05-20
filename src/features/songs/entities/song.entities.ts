import { env } from '../../../config/env.ts';
import debug from 'debug';
import z from 'zod';
import { urlSchema, uuidSchema } from '../../index.entity.ts';

const log = debug(`${env.PROJECT_NAME}:entity:song`);
log('Loaded songs entities');

export const SongSchema = z.object({
    id: uuidSchema,
    title: z.string().max(255),
    artist: z.string().max(255),
    image_url: z.url(),
    audio_url: z.url(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
});

export const CreateSongSchema = z.object({
    title: z.string().min(1, { message: 'El título es obligatorio' }).max(255),
    artist: z
        .string()
        .min(1, { message: 'El artista es obligatorio' })
        .max(255),
    image_url: urlSchema,
    audio_url: urlSchema,
});

export const UpdateSongSchema = CreateSongSchema.partial();

export type Song = z.infer<typeof SongSchema>;
export type CreateSongDTO = z.infer<typeof CreateSongSchema>;
export type UpdateSongDTO = z.infer<typeof UpdateSongSchema>;
