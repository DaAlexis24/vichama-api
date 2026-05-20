import debug from 'debug';
import { env } from '../../../config/env.ts';
import type { NextFunction, Response, Request } from 'express';
import type { SongsRepo } from '../repo/songs.repo.ts';
import type {
    CreateSongDTO,
    UpdateSongDTO,
} from '../entities/song.entities.ts';
import { HttpError } from '../../../errors/http-error.ts';
import { SqlError } from '../../../errors/sql-error.ts';

const log = debug(`${env.PROJECT_NAME}:controller:songs`);
log('Starting songs controller...');

export class SongsController {
    private repo: SongsRepo;
    constructor(repo: SongsRepo) {
        this.repo = repo;
    }

    async getAllSongs(_req: Request, res: Response, next: NextFunction) {
        log('Getting all songs from repo...');
        try {
            const songs = await this.repo.getAllSongs();
            res.json(songs);
        } catch (error) {
            log('Error occurred while fetching songs');
            const httpError = new HttpError(
                500,
                'Internal Server Error',
                'An error occurred while fetching songs',
                { cause: error },
            );
            next(httpError);
        }
    }

    async getSongByTitle(req: Request, res: Response, next: NextFunction) {
        const title = String(req.params.title);
        log(`Getting song with title ${title} from repo...`);
        try {
            const song = await this.repo.readSongByTitle(title);
            res.json(song);
        } catch (error) {
            if (error instanceof SqlError && error.code === 'NOT_FOUND') {
                const httpError = new HttpError(
                    404,
                    'Not Found',
                    'Song not found',
                    { cause: error },
                );
                next(httpError);
                return;
            }
            log('Error occurred while fetching song.');
            const httpError = new HttpError(
                500,
                'Internal Server Error',
                'An error occurred while fetching song',
                { cause: error },
            );
            next(httpError);
        }
    }

    async createSong(req: Request, res: Response, next: NextFunction) {
        log('Creating new song in repo...');
        try {
            const songData = req.body as CreateSongDTO;
            // body Validado por el middleware de validación
            const song = await this.repo.createSong(songData);
            res.status(201).json(song);
        } catch (error) {
            log('Error occurred while creating song.');
            const httpError = new HttpError(
                500,
                'Internal Server Error',
                'An error occurred while creating song',
                { cause: error },
            );
            next(httpError);
        }
    }

    async updateSong(req: Request, res: Response, next: NextFunction) {
        const id = String(req.params.id);
        log(`Updating song with id ${id} in repository...`);
        try {
            const songData = req.body as UpdateSongDTO;
            const song = await this.repo.updateSong(id, songData);
            res.json(song);
        } catch (error) {
            log('Error occurred while updating song.');
            if (error instanceof SqlError && error.code === 'NOT_FOUND') {
                const httpError = new HttpError(
                    404,
                    'Not Found',
                    'Song not found',
                    { cause: error },
                );
                next(httpError);
                return;
            }
            log('Error occurred while fetching song.');
            const httpError = new HttpError(
                500,
                'Internal Server Error',
                'An error occurred while updating song',
                { cause: error },
            );
            next(httpError);
        }
    }

    async deleteSong(req: Request, res: Response, next: NextFunction) {
        const id = String(req.params.id);
        // id Validado por el middleware de validación
        log(`Deleting song with id ${id} from repository...`);
        try {
            await this.repo.deleteSong(id);
            res.status(204).send();
        } catch (error: unknown) {
            log('Error occurred while deleting song.');
            if (error instanceof SqlError && error.code === 'NOT_FOUND') {
                res.status(404);
                const httpError = new HttpError(
                    404,
                    'Not Found',
                    'Song not found',
                    { cause: error },
                );
                next(httpError);
                return;
            }
            const httpError = new HttpError(
                500,
                'Internal Server Error',
                'An error occurred while deleting song',
                { cause: error },
            );
            next(httpError);
        }
    }
}
