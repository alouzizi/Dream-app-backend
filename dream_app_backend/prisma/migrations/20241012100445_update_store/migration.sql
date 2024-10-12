/*
  Warnings:

  - You are about to drop the column `itemsId` on the `store` table. All the data in the column will be lost.
  - You are about to drop the `items` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productType` to the `store` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_storeId_fkey";

-- AlterTable
ALTER TABLE "store" DROP COLUMN "itemsId",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "productType" TEXT NOT NULL;

-- DropTable
DROP TABLE "items";
