/*
  Warnings:

  - Added the required column `name` to the `Games` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Games" ADD COLUMN     "name" TEXT NOT NULL;
