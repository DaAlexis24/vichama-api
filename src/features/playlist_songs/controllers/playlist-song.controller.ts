import debug from 'debug';
import { env } from '../../../config/env.ts';
import type { PlaylistSongsRepo } from '../repo/playlist-song.repo.ts';
import type { NextFunction, Response, Request } from 'express';
import { PlaylistSongSchema } from '../entities/playlist-song.entity.ts';
import { InternalServerError } from '../../../errors/http-error.ts';

const log = debug(`${env.PROJECT_NAME}:controller:playlists-songs`);
log('Loading Playlist Songs Controller...');

export class PlaylistSongsController {
    #repo: PlaylistSongsRepo;
    constructor(repo: PlaylistSongsRepo) {
        this.#repo = repo;
    }

    async addSongToPlaylist(req: Request, res: Response, next: NextFunction) {
        try {
            const { playlist_id } = req.params;
            const { song_id } = PlaylistSongSchema.pick({
                song_id: true,
            }).parse(req.body);

            log('Add song %s into playlist %s', song_id, playlist_id);

            const playlist = await this.#repo.addSongToPlaylist(
                playlist_id as string,
                song_id,
            );
            return res.status(201).json(playlist);
        } catch (error) {
            const internalError = new InternalServerError(
                'Failed to add song into playlist',
                { cause: error },
            );
            log('Error creating review: %s', internalError.message);
            next(internalError);
        }
    }
}
