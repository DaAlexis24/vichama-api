import { env } from '../../config/env.ts';
import debug from 'debug';
import { Layout } from '../core/layout.ts';
import { Hero } from '../core/components/about-us/hero.ts';
import { Summary } from '../core/components/about-us/summary.ts';

const log = debug(`${env.PROJECT_NAME}:about-us:view`);
log('Loading About Us view class...');

export class AboutUs {
    static #page = 'About Us';
    static #description = 'Página sobre Vichama API, proyecto de música libre';
    static #keywords = 'Vichama API, música, playlists, sobre nosotros';

    static render = async (): Promise<string> => {
        const heroContent = Hero.render();
        const summaryContent = Summary.render();

        const content =
            /*html*/
            `
                ${heroContent}
                ${summaryContent}
            `;

        const layout = new Layout(
            this.#page,
            this.#description,
            this.#keywords,
            content,
        );

        log('Rendering About Us page with Layout');
        return layout.render();
    };
}
