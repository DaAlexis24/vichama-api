import z from 'zod';
import { env } from '../../../config/env.ts';
import debug from 'debug';
import { uuidSchema } from '../../entities/index.entity.ts';

const log = debug(`${env.PROJECT_NAME}:entity:playlist-song`);
log('Loaded playlistSong entities');

/**
 * @openapi
 *
 * components:
 *   schemas:
 *     Playlist:
 *       type: object
 *       required:
 *         - playlist_id
 *         - song_id
 *       properties:
 *         playlist_id:
 *           type: string
 *           format: uuid
 *           example: 00111749-3efe-4458-8904-0e80bb617943
 *         song_id:
 *           type: string
 *           format: uuid
 *           example: 00111749-3efe-4458-8904-0e80bb617943
 */

export const PlaylistSongSchema = z.object({
    playlist_id: uuidSchema,
    song_id: uuidSchema,
});

export type PlaylistSong = z.infer<typeof PlaylistSongSchema>;
