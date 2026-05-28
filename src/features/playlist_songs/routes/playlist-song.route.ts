import { env } from '../../../config/env.ts';
import debug from 'debug';
import type { PlaylistSongsController } from '../controllers/playlist-song.controller.ts';
import { Router } from 'express';

const log = debug(`${env.PROJECT_NAME}:router:playlists-songs`);
log('Loading Playlist Songs Router...');

export class PlaylistSongRouter {
    #controller: PlaylistSongsController;
    #router: Router;
    constructor(controller: PlaylistSongsController) {
        log('Starting playlist songs router...');
        this.#controller = controller;
        this.#router = Router();

        /**
         * @openapi
         * tags:
         *  - name: Playlist Song
         *    description: API endpoints for managing songs into playlists
         */

        /**
         * @openapi
         * /playlists/{playlist_id}/{song_id}:
         *   post:
         *     summary: Añadir una canción a una playlist
         *     tags:
         *       - Playlist Song
         *     parameters:
         *       - in: path
         *         name: playlist_id
         *         required: true
         *         schema:
         *           type: string
         *         description: ID de la playlist
         *       - in: path
         *         name: song_id
         *         required: true
         *         schema:
         *           type: string
         *         description: ID de la canción
         *     responses:
         *       201:
         *         description: Canción agregada a la playlist
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/PlaylistWithSongs'
         *       404:
         *         description: Playlist o canción no encontrada
         *       500:
         *         description: Error interno del servidor
         */
        this.#router.post(
            '/:playlist_id/:song_id',
            this.#controller.addSongToPlaylist.bind(this.#controller),
        );

        /**
         * @openapi
         * /playlists/{playlist_id}/{song_id}:
         *   delete:
         *     summary: Eliminar una canción de una playlist
         *     tags:
         *       - Playlist Song
         *     parameters:
         *       - in: path
         *         name: playlist_id
         *         required: true
         *         schema:
         *           type: string
         *         description: ID de la playlist
         *       - in: path
         *         name: song_id
         *         required: true
         *         schema:
         *           type: string
         *         description: ID de la canción
         *     responses:
         *       204:
         *         description: Canción eliminada de la playlist
         *       404:
         *         description: Playlist o canción no encontrada
         *       500:
         *         description: Error interno del servidor
         */
        this.#router.delete(
            '/:playlist_id/:song_id',
            this.#controller.removeSongToPlaylist.bind(this.#controller),
        );
    }

    get router() {
        return this.#router;
    }
}
