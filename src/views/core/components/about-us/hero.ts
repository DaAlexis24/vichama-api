import { env } from '../../../../config/env.ts';
import debug from 'debug';

const log = debug(`${env.PROJECT_NAME}:hero:component:about-us:view`);
log('Loading component Hero for AboutUs Page view class...');

export class Hero {
    static render = () => {
        const template =
            /*html*/
            `
        <section class="hero-about">
            <h2>Nuestra Misión</h2>
            <p>Democratizamos el acceso a la tecnología musical para Desarrolladores en todo el mundo</p>
            <blockquote>
                Innovación Tecnológica
            </blockquote>
        </section>
        `;
        return template;
    };
}
