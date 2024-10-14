import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Body, Controller, Get, Post, Res, UseGuards, Param } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { PrismaClient } from '@prisma/client';
import { RoleGuard, Roles, UserRoles } from 'src/role.guard';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { CreateReportDto } from 'src/dto/create-raports.dto';
import { Response } from 'express';
import * as fs from 'fs';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
    constructor(
        private readonly dashboardService: DashboardService,
        private readonly prismaService: PrismaClient
    ) {}

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    @Get('leaderboard')
    @ApiOperation({ summary: 'Get leaderboard' })
    @ApiResponse({ status: 200, description: 'Returns the formatted leaderboard.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async getLeaderboard() {
        return this.dashboardService.getFormattedLeaderboard();
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    @Get('allGames')
    @ApiOperation({ summary: 'Get all games' })
    @ApiResponse({ status: 200, description: 'Returns all games.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async getAllGames() {
        return this.dashboardService.getAllGames();
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    @Post('updatePoints/:id')
    @ApiOperation({ summary: 'Update user points' })
    @ApiParam({ name: 'id', type: 'string' })
    @ApiBody({ type: Number, description: 'Points to add' })
    @ApiResponse({ status: 200, description: 'User points updated successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async updateUserPoints(@Param('id') id: string, @Body() points: number) {
        return this.dashboardService.updateUserPoints(id, points);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    @Post('createReport')
    @ApiOperation({ summary: 'Create a report' })
    @ApiBody({ type: CreateReportDto })
    @ApiResponse({ status: 201, description: 'Report created successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async createReport(@Body() createReportDto: CreateReportDto) {
        return this.dashboardService.createReport(createReportDto);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    @Post('updateReport/:id')
    @ApiOperation({ summary: 'Update a report' })
    @ApiParam({ name: 'id', type: 'string' })
    @ApiBody({ type: CreateReportDto })
    @ApiResponse({ status: 200, description: 'Report updated successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async updateReport(@Param('id') id: string, @Body() createReportDto: CreateReportDto) {
        return this.dashboardService.updateReport(id, createReportDto);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    @Get('allReports')
    @ApiOperation({ summary: 'Get all reports' })
    @ApiResponse({ status: 200, description: 'Returns all reports.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async getAllReports() {
        return this.dashboardService.getAllReports();
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    @Get('topThreeWinners/:gameId')
    @ApiOperation({ summary: 'Get top three winners for a game' })
    @ApiParam({ name: 'gameId', type: 'number' })
    @ApiResponse({ status: 200, description: 'Returns top three winners.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async getTopThreeWinners(@Param('gameId') gameId: number) {
        return this.dashboardService.getTopThreeWinners(gameId);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    @Get('endedGames')
    @ApiOperation({ summary: 'Get ended games' })
    @ApiResponse({ status: 200, description: 'Returns ended games.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async getEndedGames() {
        return this.dashboardService.getEndedGames();
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    @Get('endedGamesWithoutReports')
    @ApiOperation({ summary: 'Get ended games without reports' })
    @ApiResponse({ status: 200, description: 'Returns ended games without reports.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async getEndedGamesWithoutReports() {
        return this.dashboardService.getEndedGamesWithoutReports();
    }

    @Get('generate-pdf')
    @ApiOperation({ summary: 'Generate PDF report' })
    @ApiResponse({ status: 200, description: 'Returns a PDF file.' })
    @ApiResponse({ status: 500, description: 'Error generating or downloading file.' })
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

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    @Get('unreportedGames')
    @ApiOperation({ summary: 'Get unreported games' })
    @ApiResponse({ status: 200, description: 'Returns unreported games.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async getUnreportedGames() {
        return this.dashboardService.getUnreportedGames();
    }
}