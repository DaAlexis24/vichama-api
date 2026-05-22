import z from 'zod';
import { env } from '../../config/env.ts';
import debug from 'debug';

const log = debug(`${env.PROJECT_NAME}:entity:index`);
log('Loaded index entities');

export const uuidSchema = z.uuid({
    message: 'El ID debe ser un UUID v4 válido',
});

export const urlSchema = z
    .url({ message: 'Debe ser una URL válida' })
    .or(z.string().min(1, { message: 'El campo no puede estar vacío' }));
