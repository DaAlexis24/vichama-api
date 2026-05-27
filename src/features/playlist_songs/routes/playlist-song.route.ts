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

        this.#router.post(
            '/:playlist_id/:song_id',
            this.#controller.addSongToPlaylist.bind(this.#controller),
        );

        this.#router.delete(
            '/:playlist_id/:song_id',
            this.#controller.removeSongToPlaylist.bind(this.#controller),
        );
    }

    get router() {
        return this.#router;
    }
}
