import debug from 'debug';
import { env } from '../../../config/env.ts';
import type { NextFunction, Response, Request } from 'express';
import type { PlaylistRepo } from '../repo/playlist.repo.ts';
import type {
    Playlist,
    CreatePlaylistDTO,
    UpdatePlaylistDTO,
    PlaylistWithSongs,
} from '../entities/playlist.entity.ts';
import {
    InternalServerError,
    NotFoundError,
} from '../../../errors/http-error.ts';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

const log = debug(`${env.PROJECT_NAME}:controller:playlists`);
log('Starting playlists controller...');

export class PlaylistController {
    #repo: PlaylistRepo;
    constructor(repo: PlaylistRepo) {
        this.#repo = repo;
    }

    async getAllPlaylists(_req: Request, res: Response, next: NextFunction) {
        try {
            log('Getting all playlists from repo...');
            const playlists: Playlist[] = await this.#repo.getAllPlaylists();
            return res.json(playlists);
        } catch (error) {
            const internalError = new InternalServerError(
                'Failed to get all playlists',
                { cause: error },
            );
            log('Error getting all playlists: %s', internalError.message);
            next(internalError);
        }
    }

    async getPlaylistByID(req: Request, res: Response, next: NextFunction) {
        try {
            const id = String(req.params.id);
            log('Get Playlist: %s', id);
            const playlist: PlaylistWithSongs =
                await this.#repo.getPlaylistByID(id);
            return res.json(playlist);
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                const notFoundError = new NotFoundError(
                    'playlist requested not found',
                    { cause: error },
                );
                log('Error getting playlist by ID: %s', notFoundError.message);
                return next(notFoundError);
            }
            const internalError = new InternalServerError(
                'Failed to get playlist by id',
                { cause: error },
            );
            log('Error getting playlist by id: %s', internalError.message);
            return next(internalError);
        }
    }

    async createPlaylist(req: Request, res: Response, next: NextFunction) {
        try {
            const playlistData = req.body as CreatePlaylistDTO;
            log('Creating playlist: %O', playlistData);
            // body Validado por el middleware de validación
            const newPlaylist: Playlist =
                await this.#repo.createPlaylist(playlistData);
            return res.status(201).json(newPlaylist);
        } catch (error) {
            const internalError = new InternalServerError(
                'Failed to create playlist',
                { cause: error },
            );
            log('Error creating playlist: %s', internalError.message);
            internalError.cause = error;
            return next(internalError);
        }
    }

    async updatePlaylist(req: Request, res: Response, next: NextFunction) {
        try {
            const id = String(req.params.id);
            log(`Updating playlist with ID: %0`, id);
            const playlistData = req.body as UpdatePlaylistDTO;
            const playlist: Playlist = await this.#repo.updatePlaylist(
                id,
                playlistData,
            );
            res.json(playlist);
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                const notFoundError = new NotFoundError(
                    'Playlist for updating not found',
                    { cause: error },
                );
                log('Error updating playlist: %s', notFoundError.message);
                return next(notFoundError);
            }
            const internalError = new InternalServerError(
                'Failed to updated playlist',
                { cause: error },
            );
            log('Error updating playlist: %s', internalError.message);
            return next(internalError);
        }
    }

    async deletePlaylist(req: Request, res: Response, next: NextFunction) {
        try {
            const id = String(req.params.id);
            log(`Deleting playlist with ID: %O`, id);
            await this.#repo.deletePlaylist(id);
            return res.status(204).send();
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                const notFoundError = new NotFoundError(
                    'Playlist for deletion not found',
                    { cause: error },
                );
                log('Error deleting playlist: %s', notFoundError.message);
                return next(notFoundError);
            }
            const internalError = new InternalServerError(
                'Failed to delete playlist',
                { cause: error },
            );
            log('Error deleting playlist: %s', internalError.message);
            return next(internalError);
        }
    }
}
