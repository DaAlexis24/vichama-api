import { env } from '../../../../config/env.ts';
import debug from 'debug';
import { PlaylistRepo } from '../../../../features/playlists/repo/playlist.repo.ts';
import type { PrismaClient } from '../../../../../generated/prisma/client.ts';

const log = debug(`${env.PROJECT_NAME}:populate-playlist:component:view`);
log('Loading component Populate Playlist view class...');

export class PopulatePlaylist {
    static #defaultCover = './default-cover.png';

    static render = async (prisma: PrismaClient): Promise<string> => {
        log('Fetching playlists from repo...');
        const repo = new PlaylistRepo(prisma);
        const playlists = await repo.getAllPlaylists();

        const playlistsHtml = playlists.length
            ? playlists
                  .map((playlist) => {
                      const cover =
                          playlist.cover ?? PopulatePlaylist.#defaultCover;
                      return /*html*/ `
                    <article class="playlist-card">
                        <img src="${cover}" alt="Portada de ${playlist.name}" class="playlist-image">
                        <h3>${playlist.name}</h3>
                        ${
                            playlist.description
                                ? `<p>${playlist.description}</p>`
                                : ''
                        }
                        <a href="/api/playlists/${playlist.id}" class="playlist-link">Ver más</a>
                    </article>
                `;
                  })
                  .join('')
            : /*html*/ `
                <p class="playlist-empty">Todavía no hay playlists disponibles.</p>
            `;

        const template =
            /*html*/
            `
            <section class="populate-playlist">
                <div class="heading-playlist">
                    <h2>Playlists más populares</h2>
                    <p>
                        Descubre y conecta con las APIs más utilizadas por la comunidad. Listas para consumir en un clic.
                    </p>
                </div>
                <div class="playlists-list">
                    ${playlistsHtml}
                </div>
            </section>
            `;

        log('Rendered playlists successfully');
        return template;
    };
}
