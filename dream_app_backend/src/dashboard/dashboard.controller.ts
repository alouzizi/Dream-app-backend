import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { PrismaClient } from '@prisma/client';
import { RoleGuard, Roles, UserRoles } from 'src/role.guard';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { CreateReportDto } from 'src/dto/create-raports.dto';
import { Response } from 'express';
import * as fs from 'fs';

@Controller('dashboard')
export class DashboardController {
    constructor(
        private readonly dashboardService: DashboardService ,
        private readonly prismaService: PrismaClient
      ) {}
      //get all users by admin
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRoles.ADMIN)
  @Get("all")
  async getAllUsers() {
    return this.dashboardService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRoles.ADMIN)
  @Get('leaderboard')
    async getLeaderboard() {
    return this.dashboardService.getFormattedLeaderboard();
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    @Get('allSponsors')
    async getAllSponsors() {
    return this.dashboardService.getAllSponsors();
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    @Get('allGames')
    async getAllGames() {
    return this.dashboardService.getAllGames();
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    @Post('updatePoints/:id')
    async updateUserPoints(id: string, points: number) {
    return this.dashboardService.updateUserPoints(id, points);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    @Post()
    async createReport(@Body() createReportDto: CreateReportDto) {
     
      return this.dashboardService.createReport(createReportDto);
    }

    //update report
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    @Post('updateReport/:id')
    async updateReport(id: string,@Body() createReportDto: CreateReportDto) {
        return this.dashboardService.updateReport(id, createReportDto);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    @Get('allReports')
    async getAllReports() {
        return this.dashboardService.getAllReports();
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    @Get('topThreeWinners/:gameId')
    async getTopThreeWinners(gameId: number) {
        return this.dashboardService.getTopThreeWinners(gameId);
    }



    //report to pdf
    @Get('generate-pdf')
    async generatePDF(@Res() res: Response) {
        const pdfPath = await this.dashboardService.generateReportsPDF();
        res.download(pdfPath, 'reports.pdf', (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            res.status(500).send('Error downloading file');
        }
        // Delete the file after sending
        fs.unlinkSync(pdfPath);
        });
    }

    //get games that are not yet reported
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    @Get('unreportedGames')
    async getUnreportedGames() {
        return this.dashboardService.getUnreportedGames();
    }

}
