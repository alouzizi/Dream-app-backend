import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/game.dto';
import { RoleGuard, Roles, UserRoles } from 'src/role.guard';


// @UseGuards(JwtAuthGuard, RoleGuard)

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Roles(UserRoles.ADMIN)
  @Post('create')
  async createGame(@Body() createGameDto: CreateGameDto) {
    return this.gameService.createGame(createGameDto);
  }

  @Get(':id')
  async getGame(@Param('id') id: string) {
    // const gameId = parseInt(id);
    return this.gameService.getGameById(+id);
  }

  //get games by mobile app user the games have status created and just name of game and required diamonds and duration and reward

  //add user to the game whene user join the game 

  //get result of the game by game id when the game status is ended if user in the game return the result

  //get available events

  //user see number of users in the game -> socket.io





}