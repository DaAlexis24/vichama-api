import swaggerJSDoc, { type Options } from 'swagger-jsdoc';

import { env } from './env.ts';

const swaggerOptions: Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Vichama Api',
            version: '1.0.0',
            description: 'API REST for managing playlists and songs',
            contact: {
                name: 'Daniel Soledad',
                email: 'danielalsole24@gmail.com',
            },
            servers: [
                {
                    url: `http://${env.PGHOST}:${env.PORT}/api`,
                    description: 'Development server',
                },
            ],
        },
    },
    apis: ['./src/features/**/routes/*.ts', './src/features/**/entities/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
