/*
  Warnings:

  - You are about to drop the column `productType` on the `store` table. All the data in the column will be lost.
  - Added the required column `reward` to the `store` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "store" DROP COLUMN "productType",
ADD COLUMN     "reward" INTEGER NOT NULL;
