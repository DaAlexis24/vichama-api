import type { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.ts';
import debug from 'debug';
import z, { type ZodObject } from 'zod';
import { BadRequestError } from '../errors/http-error.ts';

const log = debug(`${env.PROJECT_NAME}:middleware:validations`);

log('Loading validation middleware...');

export const validateId = (
    schema: ZodObject = z.object({ id: z.coerce.string() }),
) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        log('Validating ID...');
        const { id } = req.params;
        try {
            schema.parse({ id });
            log('ID validated successfully!');
            return next();
        } catch (error) {
            const idDetail = JSON.stringify({ id });
            const idError = new BadRequestError(`Invalid ID: ${idDetail}`, {
                cause: error,
            });
            return next(idError);
        }
    };
};

export const validateParams = (schema: ZodObject) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        log('Validating request params...');
        try {
            schema.parse(req.params);
            log('Params were validated successfully!');
            return next();
        } catch (error) {
            const paramsError = new BadRequestError(`Invalid Request Params`, {
                cause: error,
            });
            return next(paramsError);
        }
    };
};

// export const validateSearch = (
//     schema: ZodObject = z.object({ title: z.coerce.string() }),
// ) => {
//     return (req: Request, _res: Response, next: NextFunction) => {
//         log('Validating query...');
//         const { title } = req.params;
//         if (!title) {
//             const error = new HttpError(
//                 400,
//                 'Bad Request',
//                 'Request Query is required',
//             );
//             next(error);
//         }
//         try {
//             schema.parse({ title });
//             next();
//         } catch (error) {
//             next(error);
//         }
//     };
// };

export const validateBody = (schema: ZodObject) => {
    return (req: Request, res: Response, next: NextFunction) => {
        log('Validating request body...');
        try {
            const validationResult = schema.parse(req.body);
            // Actualiza el body de la solicitud con los datos validados
            // incluyendo posibles transformaciones realizadas por Zod
            req.body = validationResult;
            log('Body was validated successfully!');
            return next();
        } catch (error) {
            const bodyError = new BadRequestError(`Invalid Request Body`, {
                cause: error,
            });
            return next(bodyError);
        }
    };
};
