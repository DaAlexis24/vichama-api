import z from 'zod';
import { env } from '../../../config/env.ts';
import debug from 'debug';
import { uuidSchema } from '../../index.entity.ts';
import { SongSchema } from '../../songs/entities/song.entities.ts';

const log = debug(`${env.PROJECT_NAME}:entity:playlist`);
log('Loaded playlist entities');

export const PlaylistSchema = z.object({
    id: uuidSchema,
    name: z.string().max(255),
    description: z.string().optional(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
});

export const CreatePlaylistSchema = z.object({
    name: z.string().min(1, { message: 'El nombre es obligatorio' }).max(255),
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
