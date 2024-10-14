import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/game.dto';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { RoleGuard, Roles, UserRoles } from 'src/role.guard';


@UseGuards(JwtAuthGuard, RoleGuard)

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
    return this.gameService.getGameById(+ id);
  }



}