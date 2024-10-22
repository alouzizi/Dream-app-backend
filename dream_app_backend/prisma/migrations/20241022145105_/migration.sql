-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('PENDING', 'STARTED', 'ENDED', 'CLOSED');

-- CreateEnum
CREATE TYPE "SponsorStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "googleId" TEXT,
    "gender" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "type" TEXT NOT NULL,
    "diamonds" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 0,
    "avatar" TEXT,
    "dob" TIMESTAMP(3) NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "dream" TEXT,
    "role" "UserRoles" NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Games" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "requiredDiamonds" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "reward" TEXT NOT NULL,
    "trophyTypes" TEXT[],
    "answersId" INTEGER,
    "images" TEXT,
    "options" TEXT,
    "status" "GameStatus" NOT NULL,
    "licenseId" TEXT,
    "winnerId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),

    CONSTRAINT "Games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Winners" (
    "id" SERIAL NOT NULL,
    "rank" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "videoProof" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Winners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGames" (
    "userId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "gameTime" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "UserGames_pkey" PRIMARY KEY ("userId","gameId")
);

-- CreateTable
CREATE TABLE "Sponsor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "status" "SponsorStatus" NOT NULL,

    CONSTRAINT "Sponsor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "maxTime" INTEGER NOT NULL,
    "question" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Option" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "optionText" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScratchCard" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "gameId" INTEGER NOT NULL,

    CONSTRAINT "ScratchCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "productType" TEXT NOT NULL,

    CONSTRAINT "store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "trophyType" TEXT NOT NULL,
    "expenses" DECIMAL(65,30) NOT NULL,
    "additionalExpenses" DECIMAL(65,30) NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "reportDate" TIMESTAMP(3) NOT NULL,
    "hasTrophy" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GamesToSponsor" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ReportToSponsor" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "ScratchCard_gameId_key" ON "ScratchCard"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "_GamesToSponsor_AB_unique" ON "_GamesToSponsor"("A", "B");

-- CreateIndex
CREATE INDEX "_GamesToSponsor_B_index" ON "_GamesToSponsor"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ReportToSponsor_AB_unique" ON "_ReportToSponsor"("A", "B");

-- CreateIndex
CREATE INDEX "_ReportToSponsor_B_index" ON "_ReportToSponsor"("B");

-- AddForeignKey
ALTER TABLE "Winners" ADD CONSTRAINT "Winners_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Winners" ADD CONSTRAINT "Winners_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGames" ADD CONSTRAINT "UserGames_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGames" ADD CONSTRAINT "UserGames_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScratchCard" ADD CONSTRAINT "ScratchCard_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GamesToSponsor" ADD CONSTRAINT "_GamesToSponsor_A_fkey" FOREIGN KEY ("A") REFERENCES "Games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GamesToSponsor" ADD CONSTRAINT "_GamesToSponsor_B_fkey" FOREIGN KEY ("B") REFERENCES "Sponsor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReportToSponsor" ADD CONSTRAINT "_ReportToSponsor_A_fkey" FOREIGN KEY ("A") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReportToSponsor" ADD CONSTRAINT "_ReportToSponsor_B_fkey" FOREIGN KEY ("B") REFERENCES "Sponsor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
