import z from 'zod';
import { env } from '../../../config/env.ts';
import debug from 'debug';
import { uuidSchema } from '../../entities/index.entity.ts';

const log = debug(`${env.PROJECT_NAME}:entity:playlist-song`);
log('Loaded playlistSong entities');

export const PlaylistSongSchema = z.object({
    playlist_id: uuidSchema,
    song_id: uuidSchema,
});

export type PlaylistSongInput = z.infer<typeof PlaylistSongSchema>;
