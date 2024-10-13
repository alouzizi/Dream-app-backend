/*
  Warnings:

  - You are about to drop the column `text` on the `Option` table. All the data in the column will be lost.
  - You are about to drop the column `answer` on the `Question` table. All the data in the column will be lost.
  - Added the required column `optionText` to the `Option` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Question_quizId_key";

-- AlterTable
ALTER TABLE "Option" DROP COLUMN "text",
ADD COLUMN     "optionText" TEXT NOT NULL,
ALTER COLUMN "isCorrect" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "answer";
