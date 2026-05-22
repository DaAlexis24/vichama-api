import { env } from './config/env.ts';
import debug from 'debug';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { HttpError } from './errors/http-error.ts';
import { apiController } from './controllers/api.controller.ts';
import { errorHandler } from './middleware/error-handler.ts';
import { customHeaders } from './middleware/custom.ts';
import { SongsRepo } from './features/songs/repo/songs.repo.ts';
import { SongsController } from './features/songs/controllers/songs.controller.ts';
import { SongsRouter } from './features/songs/routes/songs.routes.ts';
import type { PrismaClient } from '../generated/prisma/client.ts';

const log = debug(`${env.PROJECT_NAME}:app`);
log('Loading app...');

export const createApp = (prisma: PrismaClient) => {
    log('Rising app...');
    const app = express();
    app.disable('x-powered-by');
    app.use(morgan('dev'));
    app.use(cors({ origin: '*' }));
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

    const songRepo = new SongsRepo(prisma);
    const songController = new SongsController(songRepo);
    const songRouter = new SongsRouter(songController);
    app.use('/api/songs', songRouter.router);

    app.use((_req, _res, next) => {
        log('Calling errorHandler for 404 error');
        const error = new HttpError(404, 'Not Found', 'Resource not found');
        next(error);
    });

    app.use(errorHandler);

    return app;
};
