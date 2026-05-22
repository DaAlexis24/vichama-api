import type { PrismaClient } from '../../generated/prisma/client.ts';
import { env } from '../config/env.ts';
import debug from 'debug';
import type { Router } from 'express';
import type {
    ControllerConstructor,
    RepoConstructor,
    RouterConstructor,
} from './entities/features.entity.ts';

const log = debug(`${env.PROJECT_NAME}:features`);
log('Loading features...');

export class FeatureImage<
    TRepo,
    TController,
    TRouter extends { router: Router },
> {
    #repo: TRepo;
    #controller: TController;
    #router: TRouter;

    constructor(
        prisma: PrismaClient,
        Repo: RepoConstructor<TRepo>,
        Controller: ControllerConstructor<TController, TRepo>,
        Router: RouterConstructor<TRouter, TController>,
    ) {
        log('Starting feature image...');
        this.#repo = new Repo(prisma);
        this.#controller = new Controller(this.#repo);
        this.#router = new Router(this.#controller);
    }

    get repo() {
        return this.#repo;
    }

    get controller() {
        return this.#controller;
    }

    get router() {
        return this.#router.router;
    }
}
