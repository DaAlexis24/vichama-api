import { env } from '../../../../config/env.ts';
import debug from 'debug';

const log = debug(`${env.PROJECT_NAME}:summary:component:about-us:view`);
log('Loading component Summary for AboutUs Page view class...');

export class Summary {
    static #picture = './vichama-api.png';

    static render = () => {
        const template =
            /*html*/
            `
            <section class="summary">
                <div class="summary-info">
                    <h3>Donde el código encuentra el ritmo</h3>
                    <p>Vichama API se creo para ayudar a la comunidad para que puedan desplegar aplicaciones y bots de música de una forma sencilla, rápida y totalmente personalizada según el usuario.</p>
                    <p>Crea tus propias playlists, sube tus propias canciones y compártelas con todos. Nunca había sido tan fácil y divertido compartir música.</p>
                </div>
                <div class="summary-pic">
                    <img src=${this.#picture} alt="Vichama API">
                </div>
            </section>
        `;
        return template;
    };
}
