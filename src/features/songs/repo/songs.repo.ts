import debug from 'debug';
import { env } from '../../../config/env.ts';
import { SqlError } from '../../../errors/sql-error.ts';
import type { Pool } from 'pg';
import type {
    Song,
    SongCreateDTO,
    SongUpdateDTO,
} from '../entities/song.entities.ts';

const log = debug(`${env.PROJECT_NAME}:repo:songs`);
log('Loading Songs Repo...');

export class SongsRepo {
    private pool: Pool;
    constructor(pool: Pool) {
        log('Starting Songs Repo!');
        this.pool = pool;
    }

    async readAllSongs() {
        log('Read all songs for DB 📖');
        const { rows } = await this.pool.query<Song>(`
                SELECT id, title, artist, duration_seconds, image_url, audio_url, created_at, updated_at FROM songs;
            `);
        return rows as Song[];
    }

    async readSongByTitle(title: string): Promise<Song[]> {
        log(`Reading songs with title containing ${title} from DB`);
        const q = `
            SELECT id, title, artist, duration_seconds, image_url AS "image", audio_url AS "audio", created_at, updated_at FROM songs WHERE title ILIKE '%' || $1 || '%'
        `;

        const { rows } = await this.pool.query<Song>(q, [title]);

        return rows as Song[];
    }

    async createSong(song: SongCreateDTO): Promise<Song> {
        log(`Creating a song with title is ${song.title}`);
        const q = `
            INSERT INTO songs (title, artist, duration_seconds, image_url, audio_url) 
            VALUES ($1, $2, $3, $4, $5)
            RETURNING
                id, title, artist, duration_seconds, image_url, audio_url, created_at, updated_at;`;
        const { rows } = await this.pool.query<Song>(q, [
            song.title,
            song.artist,
            song.duration_seconds,
            song.image_url,
            song.audio_url,
        ]);
        return rows[0] as Song;
    }

    async updateSong(id: string, songData: SongUpdateDTO): Promise<Song> {
        log(`Updating song with id ${id}....`);
        const q = `
            UPDATE songs
            SET title = COALESCE($2, title),
                artist = COALESCE($3, artist),
                duration_seconds = COALESCE($4, duration_seconds),
                image_url = COALESCE($5, image_url),
                audio_url = COALESCE($6, audio_url)
            WHERE
                id = $1
            RETURNING
                id, 
                title, 
                artist, 
                duration_seconds, 
                image_url, 
                audio_url;
        `;
        const { rows } = await this.pool.query<Song>(q, [
            id,
            songData.title,
            songData.artist,
            songData.duration_seconds,
            songData.image_url,
            songData.audio_url,
        ]);

        if (rows.length === 0) {
            throw new SqlError(`Song with id ${id} not found`, {
                code: 'NOT_FOUND',
                sqlState: 'UPDATE_FAILED',
                sqlMessage: `No song found with id ${id}`,
            });
        }

        return rows[0] as Song;
    }

    async deleteSong(id: string): Promise<Song> {
        log(`Deleting song with id ${id}...`);
        const q = `
            DELETE FROM songs 
            WHERE id = $1 
            RETURNING 
                id, 
                title, 
                artist, 
                duration_seconds AS "duration", 
                image_url AS "image", 
                audio_url AS "audio";`;
        const { rows } = await this.pool.query<Song>(q, [id]);

        if (rows.length === 0) {
            throw new SqlError(`Song with id ${id} not found`, {
                code: 'NOT_FOUND',
                sqlState: 'DELETE_FAILED',
                sqlMessage: `No song found with id ${id}`,
            });
        }

        return rows[0] as Song;
    }
}
