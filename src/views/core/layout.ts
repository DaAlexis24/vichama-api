import { env } from '../../config/env.ts';
import debug from 'debug';
import { Header } from './components/header.ts';

const log = debug(`${env.PROJECT_NAME}:app:view`);
log('Loading app view class...');

export class Layout {
    #page: string;
    #description: string;
    #keywords: string;
    #content: string;

    static #favicon = '/favicon.png';
    static #css = './styles.css';

    static #header = Header.render();

    constructor(
        page: string,
        description: string,
        keywords: string,
        content: string = '',
    ) {
        this.#page = page;
        this.#description = description;
        this.#keywords = keywords;
        this.#content = content;
    }

    render = (): string => {
        const template = /*html*/ `
            <!doctype html>
            <html lang="es">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="description" content="${this.#description}" />
                <meta name="keywords" content="${this.#keywords}" />
                <title>${env.PROJECT_NAME} | ${this.#page}</title>
                <link rel="shortcut icon" href="${Layout.#favicon}" type="image/x-icon">
                <link rel="stylesheet" href="${Layout.#css}">
            </head>
            <body>
                <div class="grid-box">
                    ${Layout.#header}
                    <main>
                        <section>
                            ${this.#content}
                        </section>
                    </main>
                    <footer class="footer">
                        <p>Curso Desarrollo Web</p>
                    </footer>
                </div> 
            </body>
            </html>
            `;
        log('Rendering main template');
        return template;
    };
}
