import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/game.dto';



@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  async createGame(@Body() createGameDto: CreateGameDto) {
    return this.gameService.createGame(createGameDto);
  }

  @Get(':id')
  async getGame(@Param('id') id: string) {
    // const gameId = parseInt(id);
    return this.gameService.getGameById(+ id);
  }


}