import { Router } from 'express';
import { env } from '../../config/env.ts';
import debug from 'debug';
import type { SongsController } from '../controllers/songs.controller.ts';
import {
    validateBody,
    validateId,
    validateSearch,
} from '../../middleware/validations.ts';
import {
    SongCreateSchema,
    SongUpdateSchema,
} from '../entities/song.entities.ts';

const log = debug(`${env.PROJECT_NAME}:router:song`);
log('Loading song router...');

export class SongsRouter {
    private _router: Router;
    private controller: SongsController;
    constructor(controller: SongsController) {
        log('Starting animal router...');
        this.controller = controller;
        this._router = Router();

        this._router.get(
            '/',
            this.controller.getAllSongs.bind(this.controller),
        );
        this._router.get(
            '/search/:title',
            validateSearch(),
            this.controller.getSongByTitle.bind(this.controller),
        );
        this._router.post(
            '/',
            validateBody(SongCreateSchema),
            this.controller.createSong.bind(this.controller),
        );
        this._router.patch(
            '/:id',
            validateId(),
            validateBody(SongUpdateSchema),
            this.controller.updateSong.bind(this.controller),
        );
        this._router.delete(
            '/:id',
            validateId(),
            this.controller.deleteSong.bind(this.controller),
        );
    }

    get router() {
        return this._router;
    }
}
