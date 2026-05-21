import { Router } from 'express';
import { env } from '../../../config/env.ts';
import debug from 'debug';
import type { PlaylistController } from '../controllers/playlists.controller.ts';
import { validateBody, validateId } from '../../../middleware/validations.ts';
import {
    CreatePlaylistSchema,
    UpdatePlaylistSchema,
} from '../entities/playlist.entity.ts';

const log = debug(`${env.PROJECT_NAME}:router:playlist`);
log('Loading playlist router...');

export class PlaylistRouter {
    #router: Router;
    #controller: PlaylistController;
    constructor(controller: PlaylistController) {
        log('Starting playlist router...');
        this.#controller = controller;
        this.#router = Router();

        this.#router.get(
            '/',
            this.#controller.getAllPlaylists.bind(this.#controller),
        );
        this.#router.get(
            '/:id',
            validateId(),
            this.#controller.getPlaylistByID.bind(this.#controller),
        );
        this.#router.post(
            '/',
            validateBody(CreatePlaylistSchema),
            this.#controller.createPlaylist.bind(this.#controller),
        );
        this.#router.patch(
            '/:id',
            validateId(),
            validateBody(UpdatePlaylistSchema),
            this.#controller.updatePlaylist.bind(this.#controller),
        );
        this.#router.delete(
            '/:id',
            validateId(),
            this.#controller.deletePlaylist.bind(this.#controller),
        );
    }

    get router() {
        return this.#router;
    }
}
