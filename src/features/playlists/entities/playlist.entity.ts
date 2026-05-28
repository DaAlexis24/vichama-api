import z from 'zod';
import { env } from '../../../config/env.ts';
import debug from 'debug';
import { uuidSchema } from '../../entities/index.entity.ts';
import { SongSchema } from '../../songs/entities/song.entities.ts';

const log = debug(`${env.PROJECT_NAME}:entity:playlist`);
log('Loaded playlist entities');

/**
 * @openapi
 *
 * components:
 *   schemas:
 *     Playlist:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - cover
 *         - created_at
 *         - updated_at
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 00111749-3efe-4458-8904-0e80bb617943
 *         name:
 *           type: string
 *           example: Sample Playlist
 *         description:
 *           type: string
 *           example: Esta es una playlist de prueba para los get
 *         cover:
 *           type: string
 *           example: https://res.cloudinary.com/dtfjsgavh/image/upload/v1776607130/mundaka-eterno.webp
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Created playlist date
 *           example: 2026-05-20T23:44:07.274Z
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Updated playlist date
 *           example: 2026-05-20T20:44:07.274Z
 *
 *     CreatePlaylistDTO:
 *       type: object
 *       required:
 *         - name
 *         - cover
 *         - description
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *           example: Chill Vibes
 *         cover:
 *           type: string
 *           format: uri
 *           example: https://res.cloudinary.com/dtfjsgavh/image/upload/v1776607130/cover.webp
 *         description:
 *           type: string
 *           maxLength: 1000
 *           example: Playlist para escuchar música tranquila
 *
 *     UpdatePlaylistDTO:
 *       type: object
 *       description: Partial update payload for a playlist.
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *         cover:
 *           type: string
 *           format: uri
 *         description:
 *           type: string
 *           maxLength: 1000
 *
 *     PlaylistWithSongs:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - cover
 *         - created_at
 *         - updated_at
 *         - songs
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 00111749-3efe-4458-8904-0e80bb617943
 *         name:
 *           type: string
 *           example: Chill Vibes
 *         description:
 *           type: string
 *           example: Playlist para escuchar música tranquila
 *         cover:
 *           type: string
 *           format: uri
 *           example: https://res.cloudinary.com/dtfjsgavh/image/upload/v1776607130/cover.webp
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: 2026-05-20T23:44:07.274Z
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: 2026-05-20T20:44:07.274Z
 *         songs:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - song
 *               - added_at
 *             properties:
 *               song:
 *                 $ref: '#/components/schemas/Song'
 *               added_at:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-05-24T18:32:00.000Z
 */

export const PlaylistSchema = z.object({
    id: uuidSchema,
    name: z.string().max(255),
    description: z.string().optional(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
});

export const CreatePlaylistSchema = z.object({
    name: z.string().min(1, { message: 'El nombre es obligatorio' }).max(255),
    cover: z.string(),
    description: z.string().max(1000),
});

export const UpdatePlaylistSchema = CreatePlaylistSchema.partial();

export const PlaylistWithSongsSchema = PlaylistSchema.extend({
    songs: z.array(
        z.object({
            song: SongSchema,
            added_at: z.coerce.date(),
        }),
    ),
});

export type Playlist = z.infer<typeof PlaylistSchema>;
export type CreatePlaylistDTO = z.infer<typeof CreatePlaylistSchema>;
export type UpdatePlaylistDTO = z.infer<typeof UpdatePlaylistSchema>;
export type PlaylistWithSongs = z.infer<typeof PlaylistWithSongsSchema>;
