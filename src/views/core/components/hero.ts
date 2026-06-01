import { env } from '../../../config/env.ts';
import debug from 'debug';

const log = debug(`${env.PROJECT_NAME}:hero:component:view`);
log('Loading component hero view class...');

export class Hero {
    static image_hero = './vichama-hero.png';

    static render = () => {
        const template =
            /*html*/
            `<section class="hero">
                <div class="heading-group">
                    <h1>Tus canciones, <span>tu API</span> de música
                    </h1>
                    <p>
                        Sube tus canciones favoritas y genera listas de reproducción para integrar en tus aplicaciones mediante endpoints personalizados. Perfecta para desarrolladores.
                    </p>
                </div>
                <div class="logo">
                    <img src=${this.image_hero} alt="Logo Vichama API">
                </div>
            </section>
            `;
        return template;
    };
}
