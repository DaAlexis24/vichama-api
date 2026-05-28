import { env } from './config/env.ts';
import type { PrismaClient } from '../generated/prisma/client.ts';
import debug from 'debug';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';

import { swaggerSpec } from './config/swagger.ts';
import { customHeaders } from './middleware/custom.ts';
import { errorHandler } from './middleware/error-handler.ts';
import { HttpError } from './errors/http-error.ts';
import { apiController } from './controllers/api.controller.ts';

import { FeatureImage } from './features/features.ts';

import { SongsRepo } from './features/songs/repo/songs.repo.ts';
import { SongsController } from './features/songs/controllers/songs.controller.ts';
import { SongsRouter } from './features/songs/routes/songs.routes.ts';

import { PlaylistRepo } from './features/playlists/repo/playlist.repo.ts';
import { PlaylistController } from './features/playlists/controllers/playlists.controller.ts';
import { PlaylistRouter } from './features/playlists/routes/playlists.routes.ts';

import { PlaylistSongsRepo } from './features/playlist_songs/repo/playlist-song.repo.ts';
import { PlaylistSongsController } from './features/playlist_songs/controllers/playlist-song.controller.ts';
import { PlaylistSongRouter } from './features/playlist_songs/routes/playlist-song.route.ts';

const log = debug(`${env.PROJECT_NAME}:app`);
log('Loading app...');

export const createApp = (prisma: PrismaClient) => {
    log('Rising app...');
    const app = express();
    app.disable('x-powered-by');
    app.use(morgan('dev'));
    app.use(cors({ origin: '*', credentials: true }));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(customHeaders(env.PROJECT_NAME));
    app.use(express.static('public'));

    app.get('/health', (_req, res) => {
        return res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
        });
    });

    app.get('/api', apiController);

    app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
    app.get('/api/docs.json', (_req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    const songFeature = new FeatureImage(
        prisma,
        SongsRepo,
        SongsController,
        SongsRouter,
    );

    const playlistFeature = new FeatureImage(
        prisma,
        PlaylistRepo,
        PlaylistController,
        PlaylistRouter,
    );

    const playlistSongFeature = new FeatureImage(
        prisma,
        PlaylistSongsRepo,
        PlaylistSongsController,
        PlaylistSongRouter,
    );

    app.use('/api/songs', songFeature.router);
    app.use('/api/playlists', playlistFeature.router);
    app.use('/api/playlists', playlistSongFeature.router);

    app.use((_req, _res, next) => {
        log('Calling errorHandler for 404 error');
        const error = new HttpError(404, 'Not Found', 'Resource not found');
        next(error);
    });

    app.use(errorHandler);

    return app;
};
