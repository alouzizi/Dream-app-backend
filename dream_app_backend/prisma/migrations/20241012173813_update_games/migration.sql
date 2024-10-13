/*
  Warnings:

  - You are about to drop the column `quizId` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the `Quiz` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `Games` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gameId` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_quizId_fkey";

-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_gameId_fkey";

-- AlterTable
ALTER TABLE "Games" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "quizId",
ADD COLUMN     "gameId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Quiz";

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
