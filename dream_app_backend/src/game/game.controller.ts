import { Controller, Post, Body, Get, Param, UseGuards,Delete, ParseIntPipe, Res } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/game.dto';
import { RoleGuard, Roles, UserRoles } from 'src/role.guard';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { PrismaClient } from 'prisma/prisma-client';


@UseGuards( JwtAuthGuard, RoleGuard)
@Roles(UserRoles.ADMIN)


@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {

  }private prisma = new PrismaClient();

  // @Roles(UserRoles.ADMIN)
  @Post('create')
  async createGame(@Body() createGameDto: CreateGameDto) {
    return this.gameService.createGame(createGameDto);
  }

  @Get(':id')
  async getGame(@Param('id') id: string) {
    // const gameId = parseInt(id);
    return this.gameService.getGameById(+id);
  }


  //delete game by id
  @Delete(':id')
  @Roles(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Delete a game' })
  @ApiParam({ name: 'id', type: 'number', description: 'Game ID' })
  @ApiResponse({ status: 200, description: 'Game deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Game not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async deleteGame(@Param('id', ParseIntPipe) id: number, @Res() res) {
      try {
          // First check if game exists
          const game = await this.prisma.games.findUnique({
              where: { id },
              include: {
                  winners: true,
                  userGames: true,
                  questions: {
                      include: {
                          options: true
                      }
                  },
                  scratchCard: true,
                  reports: true
              }
          });
  
          if (!game) {
              return res.status(404).json({ message: 'Game not found' });
          }
  
          // Delete all related records in a transaction
          await this.prisma.$transaction(async (prisma) => {
              // Delete options for all questions
              for (const question of game.questions) {
                  await prisma.option.deleteMany({
                      where: { questionId: question.id }
                  });
              }
  
              // Delete questions
              await prisma.question.deleteMany({
                  where: { gameId: id }
              });
  
              // Delete scratch card if exists
              if (game.scratchCard) {
                  await prisma.scratchCard.delete({
                      where: { gameId: id }
                  });
              }
  
              // Delete user games
              await prisma.userGames.deleteMany({
                  where: { gameId: id }
              });
  
              // Delete winners
              await prisma.winners.deleteMany({
                  where: { gameId: id }
              });
  
              // Delete reports
              await prisma.report.deleteMany({
                  where: { gameId: id }
              });
  
              // Finally delete the game
              await prisma.games.delete({
                  where: { id }
              });
          });
  
          return res.status(200).json({
              message: 'Game deleted successfully'
          });
  
      } catch (error) {
          console.error('Error deleting game:', error);
          return res.status(500).json({
              message: 'Error deleting game',
              error: error.message
          });
      }
  }


  //get games by mobile app user the games have status created and just name of game and required diamonds and duration and reward

  //add user to the game whene user join the game 

  //get result of the game by game id when the game status is ended if user in the game return the result

  //get available events

  //user see number of users in the game -> socket.io





}