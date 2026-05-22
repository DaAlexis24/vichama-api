import type { PrismaClient } from '../../generated/prisma/client.ts';
import { env } from '../config/env.ts';
import debug from 'debug';
import type { Router as ExpressRouter } from 'express';

const log = debug(`${env.PROJECT_NAME}:features`);
log('Loading features...');

type RepoConstructor<TRepo> = new (prisma: PrismaClient) => TRepo;
type ControllerConstructor<TController, TRepo> = new (
    repo: TRepo,
) => TController;
type RouterConstructor<
    TRouter extends { router: ExpressRouter },
    TController,
> = new (controller: TController) => TRouter;

export class FeatureImage<
    TRepo,
    TController,
    TRouter extends { router: ExpressRouter },
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
