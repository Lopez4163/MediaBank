-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "path" TEXT NOT NULL DEFAULT 'default/album/path';

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "path" TEXT NOT NULL DEFAULT 'default/album/path';
