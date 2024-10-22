/*
  Warnings:

  - You are about to drop the column `duration` on the `Games` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `Games` table. All the data in the column will be lost.
  - You are about to drop the column `options` on the `Games` table. All the data in the column will be lost.
  - You are about to drop the column `reward` on the `Games` table. All the data in the column will be lost.
  - You are about to drop the column `trophyTypes` on the `Games` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Games" DROP COLUMN "duration",
DROP COLUMN "images",
DROP COLUMN "options",
DROP COLUMN "reward",
DROP COLUMN "trophyTypes",
ADD COLUMN     "prizes" TEXT[];
