import type { PrismaClient } from '../../../../generated/prisma/client.ts';
import { env } from '../../../config/env.ts';
import debug from 'debug';
// import type { PlaylistWithSongs } from '../../playlists/entities/playlist.entity.ts';
import type { PlaylistSong } from '../entities/playlist-song.entity.ts';

const log = debug(`${env.PROJECT_NAME}:repo:playlists-songs`);
log('Loading Playlist Songs Repo...');

export class PlaylistSongsRepo {
    #prisma: PrismaClient;
    constructor(prisma: PrismaClient) {
        log('Starting Playlist Songs Repo!');
        this.#prisma = prisma;
    }

    // async getAllSongsPlaylist(playlistID: string): Promise<PlaylistWithSongs> {
    //     log('Getting all songs for playlist %s', playlistID);
    //     return await this.#prisma.playlistSong.findMany({
    //         where: {
    //             playlist_id: playlistID,
    //         },
    //         omit: {
    //             song_id: true,
    //         },
    //     });
    // }

    async addSongToPlaylist(
        playlist_id: string,
        song_id: string,
    ): Promise<PlaylistSong> {
        return (await this.#prisma.playlistSong.create({
            data: { playlist_id, song_id },
        })) as PlaylistSong;
    }

    async removeSongToPlaylist(
        playlist_id: string,
        song_id: string,
    ): Promise<PlaylistSong> {
        return await this.#prisma.playlistSong.delete({
            where: {
                playlist_id_song_id: { playlist_id, song_id },
            },
        });
    }
}
