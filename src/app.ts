import { env } from './config/env.ts';
import debug from 'debug';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { HttpError } from './errors/http-error.ts';
import { apiController } from './controllers/api.controller.ts';

const log = debug(`${env.PROJECT_NAME}:app`);
log('Loading app...');

export const createApp = () => {
    log('Rising app...');
    const app = express();
    app.disable('x-powered-by');
    app.use(morgan('dev'));
    app.use(cors({ origin: '*' }));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.static('public'));

    app.get('/api', apiController);

    app.get('/health', (_req, res) => {
        return res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
        });
    });

    app.use((_req, _res, next) => {
        log('Calling errorHandler for 404 error');
        const error = new HttpError(404, 'Not Found', 'Resource not found');
        next(error);
    });

    return app;
};
