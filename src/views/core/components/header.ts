import { env } from '../../../config/env.ts';
import debug from 'debug';

const log = debug(`${env.PROJECT_NAME}:header:component:view`);
log('Loading component header view class...');

export class Header {
    static selector = 'app-header';
    static #logo = './favicon.png';

    static render = (): string => {
        const template =
            /*html*/
            `<header class="header">
                <div>
                    <img src=${this.#logo} alt="Logo Vichama API">
                    <p>Vichama API</p>
                </div>
                <nav>
                    <li>
                    
                        <a href="#">Inicio</a>
                    </li>
                    <li>
                        <a href="/sobre-nosotros">Sobre Nosotros</a>
                    </li>
                </nav>
            </header>`;

        return template;
    };
}
