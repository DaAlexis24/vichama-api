import { env } from '../../../../config/env.ts';
import debug from 'debug';

const log = debug(`${env.PROJECT_NAME}:features:component:view`);
log('Loading component Features view class...');

export class Features {
    static #songSvg = './song.svg';
    static #playlistSvg = './playlist-add.svg';
    static #integrationSvg = './integration.svg';

    static render = () => {
        const template =
            /*html*/
            `
            <section class="features">
                <h3>¿Qué puedes hacer?</h3>
                <div>
                    <div class="feature-card">
                        <img src=${this.#songSvg} alt="Song">
                        <p>Ver la lista de canciones disponibles</p>
                    </div>
                    <div class="feature-card">
                        <img src=${this.#playlistSvg} alt="Playlist Add">
                        <p>Crear y gestionar playlists</p>
                    </div>
                    <div class="feature-card">
                        <img src=${this.#integrationSvg} alt="Integration">
                        <p>Integrar con clientes que usen la API</p>
                    </div>
                </div>
            </section>
        `;
        return template;
    };
}
