import { env } from '../../config/env.ts';
import debug from 'debug';
import { Layout } from '../core/layout.ts';
import { Hero } from '../core/components/home/hero.ts';
import { PopulatePlaylist } from '../core/components/home/populate-playlist.ts';

const log = debug(`${env.PROJECT_NAME}:home:view`);
log('Loading home view class...');

export class Home {
    static page = 'Inicio';
    static description =
        'Página de inicio de Vichama API, proyecto de música libre';
    static keywords = 'Vichama API, música, playlists';

    static #hero = Hero.render();

    static render = async (): Promise<string> => {
        const heroContent = Home.#hero;
        const playlistContent = await PopulatePlaylist.render();

        const content = /*html*/ `
            ${heroContent}
            ${playlistContent}
            <article class="home-hero">
                <section class="features">
                    <h3>Qué puedes hacer</h3>
                    <ul>
                        <li>Ver la lista de canciones disponibles</li>
                        <li>Crear y gestionar playlists</li>
                        <li>Integrar con clientes que usen la API</li>
                    </ul>
                </section>
            </article>
        `;

        const layout = new Layout(
            Home.page,
            Home.description,
            Home.keywords,
            content,
        );

        log('Rendering Home page with Layout');
        return layout.render();
    };
}
