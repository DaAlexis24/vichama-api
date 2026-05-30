import { env } from '../../config/env.ts';
import debug from 'debug';

const log = debug(`${env.PROJECT_NAME}:app:view`);
log('Loading app view class...');

export class Layout {
    static #title = env.PROJECT_NAME || 'Vichama API';
    static #favicon = './favicon.ico';
    static #css = './styles.css';

    static render = () => {
        const template = /*html*/ `
            <!doctype html>
            <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Inicio | ${this.#title}</title>
                <link rel="shortcut icon" href=${this.#favicon} type="image/x-icon">
                <link rel="stylesheet" href=${this.#css}>
            </head>
            <body>
                <header class="header">
                    <h1>${this.#title}</h1>
                </header>
                <main>
                    <section>
                        Esto es una pruebas
                    </section>
                </main>
                <footer class="footer">
                    <p>Curso Desarrollo Web</p>
                </footer>
            </body>
            </html>
            `;
        log('Rendering main template');
        return template;
    };
}
