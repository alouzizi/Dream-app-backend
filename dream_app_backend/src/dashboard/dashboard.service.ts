import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaClient) {}

    async getAllUsers() {
        return await this.prisma.user.findMany();
    }

    async getUserInfo(id: string) {
        return await this.prisma.user.findUnique({
            where: {
                id: parseInt(id)
            }
        });
    }

    //update user points
    async updateUserPoints(id: string, points: number) {
        return await this.prisma.user.update({
            where: {
                id: parseInt(id)
            },
            data: {
                points
            }
        });
    }

    //get all sponsors
    async getAllSponsors() {
        return await this.prisma.sponsors.findMany();
    }

    //get all games
    async getAllGames() {
        return await this.prisma.games.findMany();
    }

    //create game // upload csv if needed // gamet 2 types quiz and skratch and spin
    async createGame(data: any) {
        return await this.prisma.games.create({
            data
        });
    }

    //leaderboard
    async leaderboard() {
        return await this.prisma.user.findMany({
          select: {
            id: true,
            name: true,
            totalPoints: true,
            winners: {
              select: {
                gameId: true,
                rank: true,
              },
            },
          },
          orderBy: [
            {
              totalPoints: 'desc',
            },
            {
              winners: {
                _count: 'desc',
              },
            },
          ],
        });
    }

    //leaderboard formatted
    async getFormattedLeaderboard() {
        const leaderboardData = await this.leaderboard();
        
        return leaderboardData.map((user, index) => ({
          rank: index + 1,
          id: user.id,
          name: user.name,
          totalPoints: user.totalPoints,
          gamesWon: user.winners.length,
          firstPlaceWins: user.winners.filter(win => win.rank === 1).length,
        }));
    }


    //get all winners
    async getAllWinners() {
        return await this.prisma.winners.findMany();
    }

    //create raport
    async createReport(data: {
        userId: number;
        gameId: number;
        trophyType: string;
        sponsorsId: number;
        expenses: number;
        additionalExpenses: number;
        amount: number;
        reportDate: Date;
        hasTrophy: boolean;
      }) {
        try {
          const report = await this.prisma.report.create({
            data: {
              userId: data.userId,
              gameId: data.gameId,
              trophyType: data.trophyType,
              sponsorsId: data.sponsorsId,
              expenses: data.expenses,
              additionalExpenses: data.additionalExpenses,
              amount: data.amount,
              reportDate: data.reportDate,
              hasTrophy: data.hasTrophy,
            },
          });
          return report;
        } catch (error) {
          throw new Error(`Failed to create report: ${error.message}`);
        }
    }

    //update report
    async updateReport(id: string, data: any) {
        return await this.prisma.report.update({
            where: {
                id: parseInt(id)
            },
            data
        });
    }

    //get all reports
    async getAllReports() {
        return await this.prisma.report.findMany();
    }
    

}
