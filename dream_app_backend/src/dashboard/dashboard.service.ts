import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateReportDto } from 'src/dto/create-raports.dto';
import * as fs from 'fs';
import PDFDocument from 'pdfkit';

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
    async createReport(createReportDto: CreateReportDto) {
        try {
          const report = await this.prisma.report.create({
            data: {
                ...createReportDto,
                reportDate: new Date(createReportDto.reportDate),
            },
          });
          return report;
        } catch (error) {
          throw new Error(`Failed to create report: ${error.message}`);
        }
    }

    //update report
    async updateReport(id: string, createReportDto: CreateReportDto) {
        return await this.prisma.report.update({
            where: {
                id: parseInt(id)
            },
            data: {
                ...createReportDto,
                reportDate: new Date(createReportDto.reportDate)
            }
        });
    }

    
    //get all reports
    async getAllReports() {
        return await this.prisma.report.findMany();
    }

   

    //get first three winners of a game
    async getTopThreeWinners(gameId: number) {
        return await this.prisma.winners.findMany({
          where: {
            gameId
          },
          take: 3,
          orderBy: {
            rank: 'asc'
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            },
            game: {
              select: {
                trophyTypes: true
              }
            }
          }
        });
    }



        //report to pdf ///////// //////////////////////////////////////////////
        async generateReportsPDF(): Promise<string> {
            const reports = await this.prisma.report.findMany({
              include: {
                user: { select: { name: true } },
                game: { select: { id: true } },
              },
            });
        
            const pdfBuffer: Buffer = await new Promise(resolve => {
              const doc = new PDFDocument({ margin: 50 });
              
              this.generateHeader(doc);
              this.generateReportTable(doc, reports);
              
              doc.end();
              
              const buffers = [];
              doc.on('data', buffers.push.bind(buffers));
              doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
              });
            });
        
            const pdfPath = `reports_${Date.now()}.pdf`;
            fs.writeFileSync(pdfPath, pdfBuffer);
        
            return pdfPath;
          }
        
          private generateHeader(doc: PDFKit.PDFDocument) {
            doc
              .fontSize(20)
              .text('Reports Summary', { align: 'center' })
              .moveDown();
          }
        
          private generateReportTable(doc: PDFKit.PDFDocument, reports: any[]) {
            const tableTop = 150;
            const columns = [
              { header: 'User', width: 70 },
              { header: 'Game', width: 50 },
              { header: 'Trophy', width: 70 },
              { header: 'Expenses', width: 70 },
              { header: 'Add. Expenses', width: 70 },
              { header: 'Amount', width: 70 },
              { header: 'Date', width: 80 },
            ];
        
            this.generateTableRow(doc, tableTop, columns.map(col => col.header));
        
            let rowTop = tableTop + 20;
        
            reports.forEach(report => {
              const row = [
                report.user.name,
                `Game #${report.game.id}`,
                report.trophyType,
                `$${report.expenses}`,
                `$${report.additionalExpenses}`,
                `$${report.amount}`,
                report.reportDate.toLocaleDateString(),
              ];
        
              this.generateTableRow(doc, rowTop, row, columns.map(col => col.width));
              rowTop += 20;
        
              if (rowTop > 750) {
                doc.addPage();
                rowTop = 50;
                this.generateTableRow(doc, rowTop, columns.map(col => col.header));
                rowTop += 20;
              }
            });
          }
        
          private generateTableRow(doc: PDFKit.PDFDocument, y: number, items: string[], widths?: number[]) {
            let x = 50;
            items.forEach((item, i) => {
              doc
                .fontSize(10)
                .text(item, x, y, {
                  width: widths ? widths[i] : 100,
                  align: 'left',
                });
              x += (widths ? widths[i] : 100) + 10;
            });
          }


}
