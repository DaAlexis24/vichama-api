import { env } from '../config/env.ts';
import debug from 'debug';
import { connectDB } from '../config/db.ts';
import { createServer } from 'node:http';
import { listenManager } from './handlers.ts';
import { createApp } from '../app.ts';

const log = debug(`${env.PROJECT_NAME}:server`);
log('Loading server...');

export const startServer = async () => {
    log('Starting API server...');
    const prisma = await connectDB();
    const app = createApp(prisma);
    const port = env.PORT || 3000;
    const server = createServer(app);
    log('Server created');
    server.listen(port);
    server.on('listening', () => listenManager(server));
    // server.on('error', errorManager);
};
