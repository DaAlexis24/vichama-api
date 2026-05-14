import { env } from './config/env.ts';
import debug from 'debug';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { HttpError } from './errors/http-error.ts';
import { apiController } from './controllers/api.controller.ts';
import { errorHandler } from './middleware/error-handler.ts';
import { customHeaders } from './middleware/custom.ts';
import { SongsRepo } from './songs/repo/songs.repo.ts';
import type { Pool } from 'pg';
import { SongsController } from './songs/controllers/songs.controller.ts';
import { SongsRouter } from './songs/routes/songs.routes.ts';

const log = debug(`${env.PROJECT_NAME}:app`);
log('Loading app...');

export const createApp = (pool: Pool) => {
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

    const songRepo = new SongsRepo(pool);
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
