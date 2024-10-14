/*
  Warnings:

  - The values [PENDING,IN_PROGRESS] on the enum `GameStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `itemsId` on the `store` table. All the data in the column will be lost.
  - You are about to drop the `Sponsors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GamesToSponsors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `items` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productType` to the `store` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GameStatus_new" AS ENUM ('CREATED', 'STARTED', 'ENDED', 'CLOSED');
ALTER TABLE "Games" ALTER COLUMN "status" TYPE "GameStatus_new" USING ("status"::text::"GameStatus_new");
ALTER TYPE "GameStatus" RENAME TO "GameStatus_old";
ALTER TYPE "GameStatus_new" RENAME TO "GameStatus";
DROP TYPE "GameStatus_old";
COMMIT;

-- AlterEnum
ALTER TYPE "SponsorStatus" ADD VALUE 'REJECTED';

-- DropForeignKey
ALTER TABLE "_GamesToSponsors" DROP CONSTRAINT "_GamesToSponsors_A_fkey";

-- DropForeignKey
ALTER TABLE "_GamesToSponsors" DROP CONSTRAINT "_GamesToSponsors_B_fkey";

-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_storeId_fkey";

-- AlterTable
ALTER TABLE "store" DROP COLUMN "itemsId",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "productType" TEXT NOT NULL;

-- DropTable
DROP TABLE "Sponsors";

-- DropTable
DROP TABLE "_GamesToSponsors";

-- DropTable
DROP TABLE "items";

-- CreateTable
CREATE TABLE "Sponsor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "status" "SponsorStatus" NOT NULL,

    CONSTRAINT "Sponsor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GamesToSponsor" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GamesToSponsor_AB_unique" ON "_GamesToSponsor"("A", "B");

-- CreateIndex
CREATE INDEX "_GamesToSponsor_B_index" ON "_GamesToSponsor"("B");

-- AddForeignKey
ALTER TABLE "_GamesToSponsor" ADD CONSTRAINT "_GamesToSponsor_A_fkey" FOREIGN KEY ("A") REFERENCES "Games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GamesToSponsor" ADD CONSTRAINT "_GamesToSponsor_B_fkey" FOREIGN KEY ("B") REFERENCES "Sponsor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
