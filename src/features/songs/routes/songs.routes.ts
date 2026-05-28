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

        /**
         * @openapi
         * tags:
         *  - name: Songs
         *    description: API endpoints for managing songs
         */

        /**
         * @openapi
         *
         * /api/songs:
         *   get:
         *     summary: Retrieve a list of songs
         *     tags: [Songs]
         *     responses:
         *       200:
         *         description: A list of songs
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 $ref: '#/components/schemas/Song'
         */
        this.#router.get(
            '/',
            this.#controller.getAllSongs.bind(this.#controller),
        );

        /**
         * @openapi
         *
         * /api/songs/{id}:
         *   get:
         *     summary: Retrieve a single song by ID
         *     tags: [Songs]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: A single song
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Song'
         *       404:
         *         description: Song not found
         *       500:
         *         description: Server error
         *
         */
        this.#router.get(
            '/:id',
            validateId(),
            this.#controller.getSongByID.bind(this.#controller),
        );

        /**
         * @openapi
         *
         * /api/songs:
         *   post:
         *     summary: Create a new song
         *     tags: [Songs]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/SongCreateDTO'
         *     responses:
         *       201:
         *         description: Song created successfully
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Song'
         *       400:
         *         description: Invalid input data
         *       401:
         *         description: Missing or invalid token
         *       500:
         *         description: Server error
         */
        this.#router.post(
            '/',
            validateBody(CreateSongSchema),
            this.#controller.createSong.bind(this.#controller),
        );

        /**
         * @openapi
         *
         * /api/songs/{id}:
         *   patch:
         *     summary: Update a song (partial)
         *     tags: [Songs]
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
         *             $ref: '#/components/schemas/SongUpdateDTO'
         *     responses:
         *       200:
         *         description: Song updated successfully
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Song'
         *       400:
         *         description: Invalid input data
         *       401:
         *         description: Missing or invalid token
         *       404:
         *         description: Song not found
         *       500:
         *         description: Server error
         */
        this.#router.patch(
            '/:id',
            validateId(),
            validateBody(UpdateSongSchema),
            this.#controller.updateSong.bind(this.#controller),
        );

        /**
         * @openapi
         *
         * /api/songs/{id}:
         *   delete:
         *     summary: Delete a song
         *     tags: [Songs]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       204:
         *         description: Song deleted successfully
         *       401:
         *         description: Missing or invalid token
         *       404:
         *         description: Song not found
         *       500:
         *         description: Server error
         */
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
