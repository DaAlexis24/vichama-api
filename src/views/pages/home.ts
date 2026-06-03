import { env } from '../../config/env.ts';
import debug from 'debug';
import { Layout } from '../core/layout.ts';
import { Hero } from '../core/components/home/hero.ts';
import { PopulatePlaylist } from '../core/components/home/populate-playlist.ts';
import { Features } from '../core/components/home/features.ts';

const log = debug(`${env.PROJECT_NAME}:home:view`);
log('Loading home view class...');

export class Home {
    static page = 'Inicio';
    static description =
        'Página de inicio de Vichama API, proyecto de música libre';
    static keywords = 'Vichama API, música, playlists';

    static render = async (): Promise<string> => {
        const heroContent = Hero.render();
        const playlistContent = await PopulatePlaylist.render();
        const features = Features.render();

        const content = /*html*/ `
            ${heroContent}
            ${playlistContent}
            ${features}
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
