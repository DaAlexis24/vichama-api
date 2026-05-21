import { Router } from 'express';
import { env } from '../../../config/env.ts';
import debug from 'debug';
import type { SongsController } from '../controllers/songs.controller.ts';
import { validateBody, validateId } from '../../../middleware/validations.ts';
import {
    CreateSongSchema,
    UpdateSongSchema,
} from '../entities/song.entities.ts';

const log = debug(`${env.PROJECT_NAME}:router:song`);
log('Loading song router...');

export class SongsRouter {
    #router: Router;
    #controller: SongsController;
    constructor(controller: SongsController) {
        log('Starting songs router...');
        this.#controller = controller;
        this.#router = Router();

        this.#router.get(
            '/',
            this.#controller.getAllSongs.bind(this.#controller),
        );
        this.#router.get(
            '/:id',
            validateId(),
            this.#controller.getSongByID.bind(this.#controller),
        );
        // this._router.get(
        //     '/search/:title',
        //     validateSearch(),
        //     this.controller.getSongByTitle.bind(this.controller),
        // );
        this.#router.post(
            '/',
            validateBody(CreateSongSchema),
            this.#controller.createSong.bind(this.#controller),
        );
        this.#router.patch(
            '/:id',
            validateId(),
            validateBody(UpdateSongSchema),
            this.#controller.updateSong.bind(this.#controller),
        );
        this.#router.delete(
            '/:id',
            validateId(),
            this.#controller.deleteSong.bind(this.#controller),
        );
    }

    get router() {
        return this.#router;
    }
}
