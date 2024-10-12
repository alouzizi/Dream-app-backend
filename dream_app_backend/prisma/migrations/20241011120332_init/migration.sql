/*
  Warnings:

  - You are about to drop the `Sponsors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GamesToSponsors` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_GamesToSponsors" DROP CONSTRAINT "_GamesToSponsors_A_fkey";

-- DropForeignKey
ALTER TABLE "_GamesToSponsors" DROP CONSTRAINT "_GamesToSponsors_B_fkey";

-- DropTable
DROP TABLE "Sponsors";

-- DropTable
DROP TABLE "_GamesToSponsors";

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
