import { env } from '../../config/env.ts';
import debug from 'debug';
import { Layout } from '../core/layout.ts';

const log = debug(`${env.PROJECT_NAME}:home:view`);
log('Loading home view class...');

export class Home {
    static page = 'Inicio';
    static description =
        'Página de inicio de Vichama API, proyecto de música libre';
    static keywords = 'Vichama API, música, playlists';

    static render = (): string => {
        const content = /*html*/ `
            <article class="home-hero">
                <h2>Bienvenido a Vichama API</h2>
                <p>Proyecto de música libre — explora canciones y playlists.</p>
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
