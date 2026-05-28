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

        /**
         * @openapi
         * tags:
         *  - name: Playlist
         *    description: API endpoints for managing playlists
         */

        /**
         * @openapi
         *
         * /api/playlists:
         *   get:
         *     summary: Retrieve a list of playlists
         *     tags: [Playlists]
         *     responses:
         *       200:
         *         description: A list of playlists
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 $ref: '#/components/schemas/Playlist'
         */
        this.#router.get(
            '/',
            this.#controller.getAllPlaylists.bind(this.#controller),
        );

        /**
         * @openapi
         *
         * /api/playlists/{id}:
         *   get:
         *     summary: Retrieve a single playlist by ID
         *     tags: [Playlists]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: A single playlist
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Playlist'
         *       404:
         *         description: playlist not found
         *       500:
         *         description: Server error
         *
         */
        this.#router.get(
            '/:id',
            validateId(),
            this.#controller.getPlaylistByID.bind(this.#controller),
        );

        /**
         * @openapi
         *
         * /api/playlists:
         *   post:
         *     summary: Create a new playlist
         *     tags: [Playlists]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/PlaylistCreateDTO'
         *     responses:
         *       201:
         *         description: Playlist created successfully
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Playlist'
         *       400:
         *         description: Invalid input data
         *       401:
         *         description: Missing or invalid token
         *       500:
         *         description: Server error
         */
        this.#router.post(
            '/',
            validateBody(CreatePlaylistSchema),
            this.#controller.createPlaylist.bind(this.#controller),
        );

        /**
         * @openapi
         *
         * /api/playlists/{id}:
         *   patch:
         *     summary: Update a playlist (partial)
         *     tags: [Playlists]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/PlaylistUpdateDTO'
         *     responses:
         *       200:
         *         description: Playlist updated successfully
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Playlist'
         *       400:
         *         description: Invalid input data
         *       401:
         *         description: Missing or invalid token
         *       404:
         *         description: Playlist not found
         *       500:
         *         description: Server error
         */
        this.#router.patch(
            '/:id',
            validateId(),
            validateBody(UpdatePlaylistSchema),
            this.#controller.updatePlaylist.bind(this.#controller),
        );

        /**
         * @openapi
         *
         * /api/playlists/{id}:
         *   delete:
         *     summary: Delete a playlist
         *     tags: [Playlists]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       204:
         *         description: Playlist deleted successfully
         *       401:
         *         description: Missing or invalid token
         *       404:
         *         description: Playlist not found
         *       500:
         *         description: Server error
         */
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
