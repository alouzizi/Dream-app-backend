import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { PrismaClient } from '@prisma/client';
import { RoleGuard, Roles, UserRoles } from 'src/role.guard';
import { JwtAuthGuard } from 'src/jwt-auth.guard';

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
    async createReport(@Body() reportData: {
      userId: number;
      gameId: number;
      trophyType: string;
      sponsorsId: number;
      expenses: number;
      additionalExpenses: number;
      amount: number;
      reportDate: string;
      hasTrophy: boolean;
    }) {
      const reportDate = new Date(reportData.reportDate);
      return this.dashboardService.createReport({
        ...reportData,
        reportDate,
      });
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    @Get('allReports')
    async getAllReports() {
        return this.dashboardService.getAllReports();
    }

}
