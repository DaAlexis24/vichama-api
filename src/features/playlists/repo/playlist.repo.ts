import debug from 'debug';
import { env } from '../../../config/env.ts';
import { PrismaClient } from '../../../../generated/prisma/client.ts';
import type {
    Playlist,
    CreatePlaylistDTO,
    UpdatePlaylistDTO,
    PlaylistWithSongs,
} from '../entities/playlist.entity.ts';

const log = debug(`${env.PROJECT_NAME}:repo:playlists`);
log('Loading Playlist Repo...');

export class PlaylistRepo {
    #prisma: PrismaClient;
    constructor(prisma: PrismaClient) {
        log('Starting Playlist Repo!');
        this.#prisma = prisma;
    }

    async getAllPlaylists(): Promise<Playlist[]> {
        log('Read all playlists for DB 📖');
        return (await this.#prisma.playlist.findMany()) as Playlist[];
    }

    async getPlaylistByID(id: string): Promise<PlaylistWithSongs> {
        log('Getting playlist with id %s', id);
        return (await this.#prisma.playlist.findUniqueOrThrow({
            where: {
                id,
            },
            include: {
                songs: {
                    include: {
                        song: {
                            omit: {
                                created_at: true,
                                updated_at: true,
                            },
                        },
                    },
                    omit: {
                        playlist_id: true,
                        song_id: true,
                    },
                },
            },
        })) as PlaylistWithSongs;
    }

    async createPlaylist(playlist: CreatePlaylistDTO): Promise<Playlist> {
        log(`Creating a playlist with name is ${playlist.name}`);

        const result = await this.#prisma.playlist.create({
            data: {
                name: playlist.name,
                description: playlist.description,
                cover: playlist.cover,
            },
        });
        return result as Playlist;
    }

    async updatePlaylist(
        id: string,
        playlistData: UpdatePlaylistDTO,
    ): Promise<Playlist> {
        log(`Updating playlist with id %s`, id);
        const data: Record<string, unknown> = {};
        if (playlistData.name !== undefined) data.name = playlistData.name;
        if (playlistData.description !== undefined)
            data.description = playlistData.description;
        if (playlistData.cover != undefined) data.cover = playlistData.cover;

        const result = await this.#prisma.playlist.update({
            where: { id },
            data,
        });

        return result as Playlist;
    }

    async deletePlaylist(id: string): Promise<PlaylistWithSongs> {
        log(`Deleting playlist with id %s`, id);
        return (await this.#prisma.playlist.delete({
            where: {
                id,
            },
        })) as PlaylistWithSongs;
    }
}
