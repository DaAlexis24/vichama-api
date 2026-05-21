import debug from 'debug';
import { env } from '../../../config/env.ts';
import type { NextFunction, Response, Request } from 'express';
import type { SongsRepo } from '../repo/songs.repo.ts';
import type {
    CreateSongDTO,
    Song,
    UpdateSongDTO,
} from '../entities/song.entities.ts';
import {
    InternalServerError,
    NotFoundError,
} from '../../../errors/http-error.ts';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

const log = debug(`${env.PROJECT_NAME}:controller:songs`);
log('Starting songs controller...');

export class SongsController {
    #repo: SongsRepo;
    constructor(repo: SongsRepo) {
        this.#repo = repo;
    }

    async getAllSongs(_req: Request, res: Response, next: NextFunction) {
        try {
            log('Getting all songs from repo...');
            const songs: Song[] = await this.#repo.getAllSongs();
            return res.json(songs);
        } catch (error) {
            const internalError = new InternalServerError(
                'Failed to get all songs',
                { cause: error },
            );
            log('Error getting all songs: %s', internalError.message);
            next(internalError);
        }
    }

    async getSongByID(req: Request, res: Response, next: NextFunction) {
        try {
            const id = String(req.params.id);
            log('Get Song: %s', id);
            const song: Song = await this.#repo.getSongByID(id);
            return res.json(song);
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                const notFoundError = new NotFoundError(
                    'Song requested not found',
                    { cause: error },
                );
                log('Error getting song by ID: %s', notFoundError.message);
                return next(notFoundError);
            }
            const internalError = new InternalServerError(
                'Failed to get song by id',
                { cause: error },
            );
            log('Error getting song by id: %s', internalError.message);
            return next(internalError);
        }
    }

    // async getSongByTitle(req: Request, res: Response, next: NextFunction) {
    //     const title = String(req.params.title);
    //     log(`Getting song with title ${title} from repo...`);
    //     try {
    //         const song = await this.repo.readSongByTitle(title);
    //         res.json(song);
    //     } catch (error) {
    //         if (error instanceof SqlError && error.code === 'NOT_FOUND') {
    //             const httpError = new HttpError(
    //                 404,
    //                 'Not Found',
    //                 'Song not found',
    //                 { cause: error },
    //             );
    //             next(httpError);
    //             return;
    //         }
    //         log('Error occurred while fetching song.');
    //         const httpError = new HttpError(
    //             500,
    //             'Internal Server Error',
    //             'An error occurred while fetching song',
    //             { cause: error },
    //         );
    //         next(httpError);
    //     }
    // }

    async createSong(req: Request, res: Response, next: NextFunction) {
        try {
            const songData = req.body as CreateSongDTO;
            log('Creating song: %O', songData);
            // body Validado por el middleware de validación
            const newSong: Song = await this.#repo.createSong(songData);
            return res.status(201).json(newSong);
        } catch (error) {
            const internalError = new InternalServerError(
                'Failed to create song',
                { cause: error },
            );
            log('Error creating song: %s', internalError.message);
            internalError.cause = error;
            return next(internalError);
        }
    }

    async updateSong(req: Request, res: Response, next: NextFunction) {
        try {
            const id = String(req.params.id);
            log(`Updating song with ID: %0`, id);
            const songData = req.body as UpdateSongDTO;
            const song: Song = await this.#repo.updateSong(id, songData);
            res.json(song);
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                const notFoundError = new NotFoundError(
                    'Song for updating not found',
                    { cause: error },
                );
                log('Error updating song: %s', notFoundError.message);
                return next(notFoundError);
            }
            const internalError = new InternalServerError(
                'Failed to updated song',
                { cause: error },
            );
            log('Error updating song: %s', internalError.message);
            return next(internalError);
        }
    }

    async deleteSong(req: Request, res: Response, next: NextFunction) {
        try {
            const id = String(req.params.id);
            log(`Deleting song with ID: %O`, id);
            await this.#repo.deleteSong(id);
            return res.status(204).send();
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                const notFoundError = new NotFoundError(
                    'Song for deletion not found',
                    { cause: error },
                );
                log('Error deleting song: %s', notFoundError.message);
                return next(notFoundError);
            }
            const internalError = new InternalServerError(
                'Failed to delete song',
                { cause: error },
            );
            log('Error deleting song: %s', internalError.message);
            return next(internalError);
        }
    }
}
