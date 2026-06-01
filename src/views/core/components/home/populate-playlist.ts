import { env } from '../../../../config/env.ts';
import debug from 'debug';

const log = debug(`${env.PROJECT_NAME}:populate-playlist:component:view`);
log('Loading component Populate Playlist view class...');

export class PopulatePlaylist {
    static render = () => {
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
                    Aquí ira tus playlists
                </div>
            </section>
            `;

        return template;
    };
}
