import { env } from '../../config/env.ts';
import debug from 'debug';
import { Layout } from '../core/layout.ts';

const log = debug(`${env.PROJECT_NAME}:about-us:view`);
log('Loading About Us view class...');

export class AboutUs {
    static #page = 'About Us';
    static #description = 'Página sobre Vichama API, proyecto de música libre';
    static #keywords = 'Vichama API, música, playlists, sobre nosotros';

    static render = async (): Promise<string> => {
        const layout = new Layout(
            this.#page,
            this.#description,
            this.#keywords,
        );

        log('Rendering About Us page with Layout');
        return layout.render();
    };
}
