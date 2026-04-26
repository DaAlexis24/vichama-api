import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { connectDB } from '../../config/db.ts';
import { SongsRepo } from './songs.repo.ts';
import { seedSongsTestDB, type SeedData } from '../entities/test-seed-song.ts';
import type { SqlError } from '../../errors/sql-error.ts';
import type { SongCreateDTO } from '../entities/song.entities.ts';

const songMock: SongCreateDTO = {
    title: 'Take It or Leave It',
    artist: 'The Strokes',
    duration_seconds: 320,
    image_url:
        'https://store.sonymusic.es/cdn/shop/products/ISTHISIT.jpg?v=1667388364',
    audio_url:
        'https://www.youtube.com/watch?v=C0qls7b5oAY&list=RDC0qls7b5oAY&start_radio=1',
};

describe('SongsRepo', async () => {
    const pool = await connectDB();
    const songsRepo = new SongsRepo(pool);
    let seedData: SeedData;

    beforeEach(async () => {
        seedData = await seedSongsTestDB(pool);
    });

    afterEach(async () => {
        await pool.query(`DROP TABLE IF EXISTS songs CASCADE`);
    });

    describe('Read operations', () => {
        it('should read all songs', async () => {
            const songs = await songsRepo.readAllSongs();
            assert(Array.isArray(songs));
            assert.strictEqual(songs.length, 2);
        });

        it('should read a song by title', async () => {
            const song = await songsRepo.readSongByTitle('Eterno');
            assert(song);
            assert.strictEqual(song.artist, 'Mundaka');
            assert.strictEqual(song.duration_seconds, 225);
        });

        it('should throw an error if song not found', async () => {
            try {
                await songsRepo.readSongByTitle(
                    'this is a song that doesnt exist',
                );
                assert.fail('Expected an error to be thrown');
            } catch (error) {
                assert.strictEqual((error as SqlError).code, 'NOT_FOUND');
                assert.strictEqual((error as SqlError).sqlState, 'READ_FAILED');
            }
        });
    });

    describe('Create operation', () => {
        it('should create a new song', async () => {
            const newSong = await songsRepo.createSong(songMock);
            assert(newSong);
            assert.strictEqual(newSong.title, 'Take It or Leave It');
            assert.strictEqual(newSong.artist, 'The Strokes');
        });
    });

    describe('Update operation', () => {
        it('should update an existing song', async () => {
            const updatedSong = await songsRepo.updateSong(
                seedData.eterno.id!,
                songMock,
            );
            assert(updatedSong);
            assert.strictEqual(updatedSong.id, seedData.eterno.id);
            assert.strictEqual(updatedSong.title, 'Take It or Leave It');
            assert.strictEqual(updatedSong.artist, 'The Strokes');
        });

        it('should throw an error if song not found', async () => {
            try {
                await songsRepo.updateSong(
                    '00000000-0000-0000-0000-000000000000',
                    songMock,
                );
                assert.fail('Expected an error to be thrown');
            } catch (error) {
                assert.strictEqual((error as SqlError).code, 'NOT_FOUND');
                assert.strictEqual(
                    (error as SqlError).sqlState,
                    'UPDATE_FAILED',
                );
            }
        });
    });

    describe('Delete operation', () => {
        it('should delete an existing song', async () => {
            // ✅ Usa el ID dinámico del seed
            const deletedSong = await songsRepo.deleteSong(
                seedData.hombreAlAgua.id!,
            );
            assert(deletedSong);
            assert.strictEqual(deletedSong.id, seedData.hombreAlAgua.id);
            assert.strictEqual(deletedSong.title, 'Hombre al Agua');
        });

        it('should throw an error if song not found', async () => {
            try {
                await songsRepo.deleteSong(
                    '00000000-0000-0000-0000-000000000000',
                );
                assert.fail('Expected an error to be thrown');
            } catch (error) {
                assert.strictEqual((error as SqlError).code, 'NOT_FOUND');
                assert.strictEqual(
                    (error as SqlError).sqlState,
                    'DELETE_FAILED',
                );
            }
        });
    });
});
