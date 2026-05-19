import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { SongsController } from './songs.controller.ts';
import type { SongsRepo } from '../repo/songs.repo.ts';
import type { Song } from '../entities/song.entities.ts';
import type { Response, Request, NextFunction } from 'express';

describe('Songs Controller', () => {
    const songList = [
        {
            id: '550e8400-e29b-41d4-a716-446655440001',
            title: 'Take It or Leave It',
        },
    ] as unknown as Song[];

    const newSong = {
        id: '550e8400-e29b-41d4-a716-446655440002',
        title: 'New Song',
        artist: 'Test Artist',
    } as unknown as Song;

    const createExpressContext = () => {
        const json = mock.fn();
        const status = mock.fn(() => ({ json, send: mock.fn() }));
        const send = mock.fn();
        const res = { json, status, send } as unknown as Response;
        const nextMock = mock.fn<(error?: unknown) => void>();
        const next = nextMock as NextFunction;
        return { json, status, send, next, nextMock, res };
    };

    it('should read all songs', async () => {
        const { json, next, nextMock, res } = createExpressContext();
        const readAllSongs = mock.fn(async () => songList);
        const repo = { readAllSongs } as unknown as SongsRepo;
        const controller = new SongsController(repo);
        await controller.getAllSongs({} as Request, res, next);

        assert.strictEqual(readAllSongs.mock.calls.length, 1);
        assert.strictEqual(json.mock.calls.length, 1);
        assert.deepStrictEqual(json.mock.calls[0]?.arguments, [songList]);
        assert.strictEqual(nextMock.mock.calls.length, 0);
    });

    it('should handle errors when reading all songs', async () => {
        const { json, next, nextMock, res } = createExpressContext();
        const error = new Error('Database Error');
        const readAllSongs = mock.fn(async () => {
            throw error;
        });
        const repo = { readAllSongs } as unknown as SongsRepo;
        const controller = new SongsController(repo);
        await controller.getAllSongs({} as Request, res, next);

        assert.strictEqual(readAllSongs.mock.calls.length, 1);
        assert.strictEqual(json.mock.calls.length, 0);
        assert.strictEqual(nextMock.mock.calls.length, 1);
        const calledWithError = nextMock.mock.calls[0]?.arguments[0];
        assert(calledWithError instanceof Error);
        assert.strictEqual(
            calledWithError.message,
            'An error occurred while fetching songs',
        );
        assert.strictEqual(calledWithError.cause, error);
    });

    // CREATE TESTS
    it('should create a new song', async () => {
        const { json, status, next, nextMock, res } = createExpressContext();
        const createSong = mock.fn(async () => newSong);
        const repo = { createSong } as unknown as SongsRepo;
        const controller = new SongsController(repo);

        const req = {
            body: {
                title: 'New Song',
                artist: 'Test Artist',
            },
        } as Request;

        await controller.createSong(req, res, next);

        assert.strictEqual(createSong.mock.calls.length, 1);
        assert.strictEqual(status.mock.calls.length, 1);
        assert.strictEqual(status.mock.calls[0]?.arguments[0], 201);
        assert.strictEqual(json.mock.calls.length, 1);
        assert.deepStrictEqual(json.mock.calls[0]?.arguments, [newSong]);
        assert.strictEqual(nextMock.mock.calls.length, 0);
    });

    it('should handle errors when creating a song', async () => {
        const { json, next, nextMock, res } = createExpressContext();
        const error = new Error('Database Error');
        const createSong = mock.fn(async () => {
            throw error;
        });
        const repo = { createSong } as unknown as SongsRepo;
        const controller = new SongsController(repo);

        const req = {
            body: { title: 'New Song' },
        } as Request;

        await controller.createSong(req, res, next);

        assert.strictEqual(createSong.mock.calls.length, 1);
        assert.strictEqual(json.mock.calls.length, 0);
        assert.strictEqual(nextMock.mock.calls.length, 1);
        const calledWithError = nextMock.mock.calls[0]?.arguments[0];
        assert(calledWithError instanceof Error);
        assert.strictEqual(
            calledWithError.message,
            'An error occurred while creating song',
        );
    });

    // UPDATE TESTS
    it('should update a song', async () => {
        const { json, next, nextMock, res } = createExpressContext();
        const updatedSong = { ...newSong, title: 'Updated Title' };
        const updateSong = mock.fn(async () => updatedSong);
        const repo = { updateSong } as unknown as SongsRepo;
        const controller = new SongsController(repo);

        const req = {
            params: { id: '550e8400-e29b-41d4-a716-446655440002' },
            body: { title: 'Updated Title' },
        } as unknown as Request;

        await controller.updateSong(req, res, next);

        assert.strictEqual(updateSong.mock.calls.length, 1);
        assert.deepStrictEqual(
            updateSong.mock.calls[0]?.arguments[0],
            '550e8400-e29b-41d4-a716-446655440002',
        );
        assert.strictEqual(json.mock.calls.length, 1);
        assert.deepStrictEqual(json.mock.calls[0]?.arguments, [updatedSong]);
        assert.strictEqual(nextMock.mock.calls.length, 0);
    });

    it('should return 404 when updating a non-existent song', async () => {
        const { json, next, nextMock, res, status } = createExpressContext();
        const HttpError = class extends Error {
            code = 'NOT_FOUND';
            constructor(message: string) {
                super(message);
                this.name = 'HttpError';
            }
        };
        const error = new HttpError('Song not found');
        const updateSong = mock.fn(async () => {
            throw error;
        });
        const repo = { updateSong } as unknown as SongsRepo;
        const controller = new SongsController(repo);

        const req = {
            params: { id: 'no-existo' },
            body: { title: 'Updated Title' },
        } as unknown as Request;

        await controller.updateSong(req, res, next);

        assert.strictEqual(updateSong.mock.calls.length, 1);
        assert.strictEqual(json.mock.calls.length, 0);
        assert.strictEqual(status.mock.calls.length, 1);
        assert.strictEqual(status.mock.calls[0]?.arguments[0], 404);
        assert.strictEqual(nextMock.mock.calls.length, 1);
        const calledWithError = nextMock.mock.calls[0]?.arguments[0];
        assert(calledWithError instanceof Error);
        assert.strictEqual(calledWithError.message, 'Song not found');
    });

    it('should handle errors when updating a song', async () => {
        const { json, next, nextMock, res } = createExpressContext();
        const error = new Error('Database Error');
        const updateSong = mock.fn(async () => {
            throw error;
        });
        const repo = { updateSong } as unknown as SongsRepo;
        const controller = new SongsController(repo);

        const req = {
            params: { id: '550e8400-e29b-41d4-a716-446655440002' },
            body: { title: 'Updated Title' },
        } as unknown as Request;

        await controller.updateSong(req, res, next);

        assert.strictEqual(updateSong.mock.calls.length, 1);
        assert.strictEqual(json.mock.calls.length, 0);
        assert.strictEqual(nextMock.mock.calls.length, 1);
        const calledWithError = nextMock.mock.calls[0]?.arguments[0];
        assert(calledWithError instanceof Error);
        assert.strictEqual(
            calledWithError.message,
            'An error occurred while updating song',
        );
    });

    // DELETE TESTS
    it('should delete a song', async () => {
        const { status, next, nextMock, res } = createExpressContext();
        const deleteSong = mock.fn(async () => undefined);
        const repo = { deleteSong } as unknown as SongsRepo;
        const controller = new SongsController(repo);

        const req = {
            params: { id: '550e8400-e29b-41d4-a716-446655440001' },
        } as unknown as Request;

        await controller.deleteSong(req, res, next);

        assert.strictEqual(deleteSong.mock.calls.length, 1);
        assert.deepStrictEqual(
            deleteSong.mock.calls[0]?.arguments[0],
            '550e8400-e29b-41d4-a716-446655440001',
        );
        assert.strictEqual(status.mock.calls.length, 1);
        assert.strictEqual(status.mock.calls[0]?.arguments[0], 204);
        assert.strictEqual(nextMock.mock.calls.length, 0);
    });

    it('should return 404 when deleting a non-existent song', async () => {
        const { json, next, nextMock, res } = createExpressContext();
        const SqlError = class extends Error {
            code = 'NOT_FOUND';
            constructor(message: string) {
                super(message);
                this.name = 'SqlError';
            }
        };
        const error = new SqlError('Song not found');
        const deleteSong = mock.fn(async () => {
            throw error;
        });
        const repo = { deleteSong } as unknown as SongsRepo;
        const controller = new SongsController(repo);

        const req = {
            params: { id: 'non-existent-id' },
        } as unknown as Request;

        await controller.deleteSong(req, res, next);

        assert.strictEqual(deleteSong.mock.calls.length, 1);
        assert.strictEqual(json.mock.calls.length, 0);
        assert.strictEqual(nextMock.mock.calls.length, 1);
        const calledWithError = nextMock.mock.calls[0]?.arguments[0];
        assert(calledWithError instanceof Error);
        assert.strictEqual(calledWithError.message, 'Song not found');
    });

    it('should handle errors when deleting a song', async () => {
        const { json, next, nextMock, res } = createExpressContext();
        const error = new Error('Database Error');
        const deleteSong = mock.fn(async () => {
            throw error;
        });
        const repo = { deleteSong } as unknown as SongsRepo;
        const controller = new SongsController(repo);

        const req = {
            params: { id: '550e8400-e29b-41d4-a716-446655440001' },
        } as unknown as Request;

        await controller.deleteSong(req, res, next);

        assert.strictEqual(deleteSong.mock.calls.length, 1);
        assert.strictEqual(json.mock.calls.length, 0);
        assert.strictEqual(nextMock.mock.calls.length, 1);
        const calledWithError = nextMock.mock.calls[0]?.arguments[0];
        assert(calledWithError instanceof Error);
        assert.strictEqual(
            calledWithError.message,
            'An error occurred while deleting song',
        );
    });
});
