import debug from 'debug';
import { PrismaClient } from '../../../../generated/prisma/client.ts';
import { env } from '../../../config/env.ts';
import type {
    Song,
    CreateSongDTO,
    UpdateSongDTO,
} from '../entities/song.entities.ts';

const log = debug(`${env.PROJECT_NAME}:repo:songs`);
log('Loading Songs Repo...');

export class SongsRepo {
    #prisma: PrismaClient;
    constructor(prisma: PrismaClient) {
        log('Starting Songs Repo!');
        this.#prisma = prisma;
    }

    async getAllSongs(): Promise<Song[]> {
        log('Read all songs for DB 📖');
        return (await this.#prisma.song.findMany()) as Song[];
    }

    async getSongByID(id: string): Promise<Song> {
        log('Getting song with id %s', id);
        return (await this.#prisma.song.findUniqueOrThrow({
            where: {
                id,
            },
        })) as Song;
    }

    // async readSongByTitle(title: string): Promise<Song[]> {
    //     log(`Reading songs with title containing ${title} from DB`);
    //     const q = `
    //         SELECT id, title, artist, duration_seconds, image_url AS "image", audio_url AS "audio", created_at, updated_at FROM songs WHERE title ILIKE '%' || $1 || '%'
    //     `;

    //     const { rows } = await this.pool.query<Song>(q, [title]);

    //     return rows as Song[];
    // }

    async createSong(song: CreateSongDTO): Promise<Song> {
        log(`Creating a song with title is ${song.title}`);

        const result = await this.#prisma.song.create({
            data: {
                title: song.title,
                artist: song.artist,
                image_url: song.image_url,
                audio_url: song.audio_url,
            },
        });
        return result as Song;
    }

    async updateSong(id: string, songData: UpdateSongDTO): Promise<Song> {
        log(`Updating song with id %s`, id);
        const data: Record<string, unknown> = {};
        if (songData.title !== undefined) data.title = songData.title;
        if (songData.artist !== undefined) data.artist = songData.artist;
        if (songData.image_url !== undefined)
            data.image_url = songData.image_url;
        if (songData.audio_url !== undefined)
            data.audio_url = songData.audio_url;

        const result = await this.#prisma.song.update({
            where: { id },
            data,
        });

        return result as Song;
    }

    async deleteSong(id: string): Promise<Song> {
        log(`Deleting song with id %s`, id);
        return (await this.#prisma.song.delete({
            where: {
                id,
            },
        })) as Song;
    }
}
