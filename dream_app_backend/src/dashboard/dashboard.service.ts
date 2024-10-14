import { Injectable, NotAcceptableException } from '@nestjs/common';
import { GameStatus, PrismaClient } from '@prisma/client';
import { CreateReportDto } from 'src/dto/create-raports.dto';
import * as fs from 'fs';
// import PDFDocument from 'pdfkit';
const PDFDocument = require('pdfkit');

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaClient) {}


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
        return await this.prisma.sponsor.findMany();
    }

    //get all games
    async getAllGames() {
        return await this.prisma.games.findMany({
            include: {
                
                winners: {
                    select: {
                        rank: true
                        
                    }
                  },
                userGames: {
                    select: {
                        userId: true,
                        gameId: true
                    }
                },
                
                sponsorId: true
            
            }
        });
    }

    //get unreported games
    async getUnreportedGames() {
        return await this.prisma.games.findMany({
            where: {
                reports: {
                    none: {}
                },
                status: {
                    in: [GameStatus.ENDED, GameStatus.CLOSED]
                }
                
            },
            include: {
                winners: {
                    select: {
                        rank: true
                        
                    }
                  },
                userGames: {
                    select: {
                        userId: true,
                        gameId: true
                    }
                },
                sponsorId: true
            }
        });
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

    //get ended games by admin
    async getEndedGames() {
        return await this.prisma.games.findMany({
          where: {
            status:  GameStatus.ENDED
          }
        });
    }

    //get ended games wihtout report
    async getEndedGamesWithoutReports() {
      return await this.prisma.games.findMany({
        where: {
          status: {
            in: [GameStatus.ENDED, GameStatus.CLOSED],  // Matches either 'ENDED' or 'CLOSED' status
          },
          reports: {
            none: {}
          }
        },
        include: {
          winners: true,
          sponsorId: true
        }
      });
    }

    // //create raport
    // async createReport(createReportDto: CreateReportDto) {
    //     //check if the game exists
    //     const game = await this.prisma.games.findUnique({
    //         where: {
    //             id: createReportDto.gameId
    //         }
    //     });
    //     if (!game) {
    //         throw new NotAcceptableException('Game does not exist');
    //     }
    //     //check if game already has a report
    //     const existingReport = await this.prisma.report.findFirst({
    //         where: {
    //             gameId: createReportDto.gameId
    //         }
    //     });
    //     if (existingReport) {
    //         throw new NotAcceptableException('Game already has a report');
    //     }
    //     //check if game is ended or closed
    //     if (game.status !== GameStatus.ENDED && game.status !== GameStatus.CLOSED) {
    //         throw new NotAcceptableException('Game is not ended or closed');
    //     }
      
    //     try {
    //       const report = await this.prisma.report.create({
    //         data: {
    //             ...createReportDto,
    //             reportDate: new Date(createReportDto.reportDate),
    //         },
    //       });
    //       return report;
    //     } catch (error) {
    //       throw new Error(`Failed to create report: ${error.message}`);
    //     }
    // }
    async createReport(createReportDto: CreateReportDto) {
      // Check if the game exists
      const game = await this.prisma.games.findUnique({
          where: {
              id: createReportDto.gameId
          },
          include: {
              sponsorId: true, // Include sponsor information
          }
      });
  
      if (!game) {
          throw new NotAcceptableException('Game does not exist');
      }
      //if user is exist
      const user = await this.prisma.user.findUnique({
          where: {
              id: createReportDto.userId
          }
      });
      if (!user) {
          throw new NotAcceptableException('User does not exist');
      }

      // Check if the game already has a report with the same user
      const existingReport = await this.prisma.report.findFirst({
          where: {
              gameId: createReportDto.gameId,
              userId: createReportDto.userId
          }
      });

      if (existingReport) {
          throw new NotAcceptableException('Game already has a report with the same user');
      }



  
      // Previous checks remain the same...
  
      try {
          // Create the report
          const report = await this.prisma.report.create({
              data: {
                  userId: createReportDto.userId,
                  gameId: createReportDto.gameId,
                  trophyType: createReportDto.trophyType,
                  expenses: createReportDto.expenses,
                  additionalExpenses: createReportDto.additionalExpenses,
                  amount: createReportDto.amount,
                  reportDate: new Date(createReportDto.reportDate),
                  hasTrophy: createReportDto.hasTrophy,
                  sponsors: {
                      connect: createReportDto.sponsorsId.map(id => ({ id }))
                  }
              },
              include: {
                  sponsors: true,
                  user: {
                      select: {
                          name: true,
                          avatar: true,
                      }
                  },
                  game: {
                      select: {
                          name: true,
                      }
                  }
              }
          });
  
          // Prepare the response
          const response = {
              id: report.id,
              userId: report.userId,
              gameId: report.gameId,
              trophyType: report.trophyType,
              expenses: report.expenses,
              additionalExpenses: report.additionalExpenses,
              amount: report.amount,
              reportDate: report.reportDate,
              hasTrophy: report.hasTrophy,
              createdAt: report.createdAt,
              sponsors: report.sponsors.map(sponsor => ({
                  id: sponsor.id,
                  name: sponsor.name,
                  logo: sponsor.logo,
                  status: sponsor.status
              })),
              game: {
                  name: report.game.name,
              },
              user: {
                  name: report.user.name,
                  avatar: report.user.avatar,
              }
          };
  
          return response;
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
        //iget this response
      //   {
      //     "id": 7,
      //     "userId": 1,
      //     "gameId": 5,
      //     "trophyType": "phone",
      //     "expenses": "200",
      //     "additionalExpenses": "200",
      //     "amount": "0",
      //     "reportDate": "2024-10-14T09:19:03.655Z",
      //     "hasTrophy": true,
      //     "createdAt": "2024-10-14T10:35:09.279Z"
      // },
      //add user name and game name and date and sponsor name

        return await this.prisma.report.findMany(
            {
                include: {
                    user: {
                        select: {
                            name: true,
                            avatar: true
                        }
                    },
                    game: {
                        select: {
                            name: true,
                            sponsorId: true
                        }
                    }
                    
                }
            }
        );
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



    async generateReportsPDF(): Promise<Buffer> {
      const reports = await this.prisma.report.findMany({
          include: {
              user: { select: { name: true } },
              game: { select: { id: true } },
          },
      });

      return new Promise((resolve, reject) => {
          const doc = new PDFDocument({ margin: 50, size: 'A4', layout: 'landscape' });
          const buffers: Buffer[] = [];

          doc.on('data', buffers.push.bind(buffers));
          doc.on('end', () => {
              const pdfData = Buffer.concat(buffers);
              resolve(pdfData);
          });

          try {
              this.generateHeader(doc);
              this.generateReportTable(doc, reports);
              this.generateFooter(doc);
              doc.end();
          } catch (error) {
              reject(error);
          }
      });
  }

  private generateHeader(doc: PDFKit.PDFDocument, marginTop = 50) {
    try {
        doc.image('./assets/logo.png', 50, marginTop, { width: 50 });
    } catch (error) {
        console.warn('Logo image not found, skipping logo.');
    }

    doc
        .fillColor('#444444')
        .fontSize(24)
        .text('Reports Summary', 110, marginTop + 7)  // Adjusted for top margin
        .fontSize(12)
        .text('Generated on: ' + new Date().toLocaleString(), { align: 'right' })
        .moveDown();
}

private generateFooter(doc: PDFKit.PDFDocument, marginBottom = 100) {
    const pageCount = doc.bufferedPageRange().count;
    for (let i = 0; i < pageCount; i++) {
        doc.switchToPage(i);
        doc.fontSize(8).text(
            `Page ${i + 1} of ${pageCount}`,
            50,
            doc.page.height - marginBottom,  // Adjusted for bottom margin
            { align: 'center' }
        );
    }
}

private generateReportTable(doc: PDFKit.PDFDocument, reports: any[], marginTop = 100, marginBottom = 50) {
    const tableTop = marginTop + 100;  // Adjusted for top margin
    const columns = [
        { header: 'User', width: 100 },
        { header: 'Game', width: 80 },
        { header: 'Trophy', width: 100 },
        { header: 'Expense of Prize', width: 80 },
        { header: 'Additional Expense', width: 100 },
        { header: 'Amount', width: 80 },
        { header: 'Date', width: 100 },
    ];

    this.generateTableRow(doc, tableTop, columns.map(col => col.header), columns.map(col => col.width), true);

    let rowTop = tableTop + 25;

    reports.forEach((report, index) => {
        const row = [
            report.user.name,
            `Game #${report.game.id}`,
            report.trophyType,
            `$${report.expenses.toFixed(2)}`,
            `$${report.additionalExpenses.toFixed(2)}`,
            `$${report.amount.toFixed(2)}`,
            new Date(report.reportDate).toLocaleDateString(),
        ];

        const isEvenRow = index % 2 === 0;
        if (isEvenRow) {
            doc.rect(50, rowTop - 5, 670, 20).fill('#f2f2f2').stroke();
        }

        this.generateTableRow(doc, rowTop, row, columns.map(col => col.width));
        rowTop += 20;

        // Adjust for bottom margin: make sure the row doesn't go into the bottom margin
        if (rowTop > doc.page.height - marginBottom - 20) {  // 20 is for row height
            doc.addPage();
            this.generateTableRow(doc, marginTop, columns.map(col => col.header), columns.map(col => col.width), true);
            rowTop = marginTop + 25;
        }
    });
}

  private generateTableRow(doc: PDFKit.PDFDocument, y: number, items: string[], widths: number[], isHeader = false) {
    let x = 50;
    items.forEach((item, i) => {
        doc
            .fillColor('gray')  // Set the text color to red
            .fontSize(isHeader ? 12 : 10)
            .font(isHeader ? 'Helvetica-Bold' : 'Helvetica')
            .text(item, x, y, {
                width: widths[i],
                align: 'left',
                ellipsis: true,
            });
        x += widths[i] + 10;
    });
}

      
}
