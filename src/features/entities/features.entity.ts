import type { Router } from 'express';
import type { PrismaClient } from '../../../generated/prisma/client.ts';

export type RepoConstructor<TRepo> = new (prisma: PrismaClient) => TRepo;

export type ControllerConstructor<TController, TRepo> = new (
    repo: TRepo,
) => TController;

export type RouterConstructor<
    TRouter extends { router: Router },
    TController,
> = new (controller: TController) => TRouter;
