import { env } from '../../../config/env.ts';
import debug from 'debug';
import z from 'zod';
import { urlSchema, uuidSchema } from '../../entities/index.entity.ts';

const log = debug(`${env.PROJECT_NAME}:entity:song`);
log('Loaded songs entities');

/**
 * @openapi
 *
 * components:
 *   schemas:
 *     Song:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - artist
 *         - image_url
 *         - audio_url
 *         - created_at
 *         - updated_at
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 9f583402-a91d-434e-929d-c741acf70939
 *         title:
 *           type: string
 *           example: Eterno
 *         artist:
 *           type: string
 *           example: Mundaka
 *         image_url:
 *           type: string
 *           example: https://res.cloudinary.com/dtfjsgavh/image/upload/v1776607130/mundaka-eterno.webp
 *         audio_url:
 *           type: string
 *           example: https://res.cloudinary.com/dtfjsgavh/video/upload/v1776607932/mundaka-eterno.mp3
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Created song date
 *           example: 2026-05-20T23:44:07.274Z
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Updated data song date
 *           example: 2026-05-20T20:44:07.274Z
 *
 */

/**
 * @openapi
 *
 * components:
 *   schemas:
 *     SongCreateDTO:
 *       type: object
 *       required: [title, artist, image_url, audio_url]
 *       properties:
 *         title:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *           example: Eterno
 *         artist:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *           example: Mundaka
 *         image_url:
 *           type: string
 *           example: https://res.cloudinary.com/dtfjsgavh/image/upload/v1776607130/mundaka-eterno.webp
 *         audio_url:
 *           type: string
 *           example: https://res.cloudinary.com/dtfjsgavh/image/upload/v1776607130/mundaka-eterno.mp3
 *
 *     SongUpdateDTO:
 *       type: object
 *       additionalProperties: false
 *       description: Partial update payload for a song.
 *       properties:
 *         title:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *         artist:
 *           type: integer
 *           minLength: 1
 *           maxLength: 255
 *         image_url:
 *           type: string
 *         audio_url:
 *           type: string
 */

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
