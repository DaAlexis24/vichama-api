-- AlterTable
ALTER TABLE "playlists" ALTER COLUMN "created_at" SET DEFAULT (now());

-- AlterTable
ALTER TABLE "songs" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3);
