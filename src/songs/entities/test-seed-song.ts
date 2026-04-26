import type { Pool } from 'pg';
import { env } from '../../config/env.ts';
import debug from 'debug';
import { connectDB } from '../../config/db.ts';
import { fileURLToPath } from 'node:url';

const log = debug(`${env.PROJECT_NAME}:seed:test`);
log('Loading seed...');

export interface SeedData {
    eterno: { id: string | undefined };
    hombreAlAgua: { id: string | undefined };
}

export const seedSongsTestDB = async (pool: Pool): Promise<SeedData> => {
    log('Seeding to database...');

    await pool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await pool.query(`DROP TABLE IF EXISTS songs`);
    await pool.query(
        `CREATE TABLE IF NOT EXISTS songs (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            title VARCHAR(255) NOT NULL,
            artist VARCHAR(255) NOT NULL,
            duration_seconds INTEGER NOT NULL CHECK (duration_seconds > 0),
            image_url VARCHAR(500) NOT NULL,
            audio_url VARCHAR(500) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`,
    );

    const { rows } = await pool.query<{ id: string }>(`
        INSERT INTO songs (title, artist, duration_seconds, image_url, audio_url) VALUES 
        ('Eterno', 'Mundaka', 225, 'https://res.cloudinary.com/dtfjsgavh/image/upload/v1776607130/mundaka-eterno_eabevy.webp', 'https://res.cloudinary.com/dtfjsgavh/video/upload/v1776607932/mundaka-eterno_onsoiz.mp3'),
        ('Hombre al Agua', 'Soda Stereo', 356, 'https://res.cloudinary.com/dtfjsgavh/image/upload/v1776607128/soda_stereo-hombre_al_agua_ocm7t4.webp', 'https://res.cloudinary.com/dtfjsgavh/video/upload/v1776607959/soda_stereo-hombre_al_agua_smtfza.mp3')
        RETURNING id;
    `);

    return {
        eterno: { id: rows[0]?.id },
        hombreAlAgua: { id: rows[1]?.id },
    };
};

// Run seed if this file is executed directly
const currentFilePath = fileURLToPath(import.meta.url);
const processFilePath = process.argv[1];

if (currentFilePath === processFilePath) {
    seedSongsTestDB(await connectDB())
        .then(() => {
            console.log('Seed completed successfully.');
            process.exit(0);
        })
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}
