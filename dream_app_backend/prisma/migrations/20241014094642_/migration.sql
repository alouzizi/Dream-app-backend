/*
  Warnings:

  - You are about to drop the column `sponsorsId` on the `Report` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "sponsorsId";

-- CreateTable
CREATE TABLE "_ReportToSponsor" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ReportToSponsor_AB_unique" ON "_ReportToSponsor"("A", "B");

-- CreateIndex
CREATE INDEX "_ReportToSponsor_B_index" ON "_ReportToSponsor"("B");

-- AddForeignKey
ALTER TABLE "_ReportToSponsor" ADD CONSTRAINT "_ReportToSponsor_A_fkey" FOREIGN KEY ("A") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReportToSponsor" ADD CONSTRAINT "_ReportToSponsor_B_fkey" FOREIGN KEY ("B") REFERENCES "Sponsor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
