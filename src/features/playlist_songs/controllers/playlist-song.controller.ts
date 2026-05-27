import debug from 'debug';
import { env } from '../../../config/env.ts';
import type { PlaylistSongsRepo } from '../repo/playlist-song.repo.ts';
import type { NextFunction, Response, Request } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import {
    InternalServerError,
    NotFoundError,
} from '../../../errors/http-error.ts';

const log = debug(`${env.PROJECT_NAME}:controller:playlists-songs`);
log('Loading Playlist Songs Controller...');

export class PlaylistSongsController {
    #repo: PlaylistSongsRepo;
    constructor(repo: PlaylistSongsRepo) {
        this.#repo = repo;
    }

    async addSongToPlaylist(req: Request, res: Response, next: NextFunction) {
        try {
            const { playlist_id, song_id } = req.params;

            log('Add song %s into playlist %s', song_id, playlist_id);

            const playlist = await this.#repo.addSongToPlaylist(
                playlist_id as string,
                song_id as string,
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

    async removeSongToPlaylist(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { playlist_id, song_id } = req.params;

            log('Delete song %s from playlist %s', song_id, playlist_id);

            await this.#repo.removeSongToPlaylist(
                playlist_id as string,
                song_id as string,
            );

            return res.status(204).send();
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                const notFoundError = new NotFoundError(
                    'Song or playlist requested not found',
                    {
                        cause: error,
                    },
                );
                log(
                    'Error deleting song to the playlist: %s',
                    notFoundError.message,
                );
                return next(notFoundError);
            }

            const internalError = new InternalServerError(
                'Failed to delete song to playlist',
                { cause: error },
            );
            log('Error deleting song to playlist: %s', internalError.message);
            return next(internalError);
        }
    }
}
