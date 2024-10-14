import { Injectable, NotFoundException } from '@nestjs/common';
import { GameStatus, PrismaClient } from 'prisma/prisma-client';
import { CreateGameDto } from './dto/game.dto';


@Injectable()
export class GameService {

	private prisma = new PrismaClient();


async createGame(createGameDto: CreateGameDto) {
    return await this.prisma.games.create({
      data: {
        name: createGameDto.name,
		requiredDiamonds: createGameDto.requiredDiamonds,
		duration: createGameDto.duration,
		reward: createGameDto.reward,
		status: GameStatus.CREATED,
		sponsorId: createGameDto.sponsorId.length > 0 ? {
			connect: createGameDto.sponsorId .map(id => ({ id })),
		  } : undefined,
        images: createGameDto.images,
        options: createGameDto.options,
        licenseId: createGameDto.licenseId,
        winnerId: createGameDto.winnerId,
        questions: {
          create: createGameDto.questions.map(question => ({
            question: question.question,
			maxTime: question.maxTime,
            options: {
              create: question.options.map(option => ({
                optionText: option.optionText,
                isCorrect: option.isCorrect,
              })),
            },
          })),
        },
      },
    });
  }

    // Method to get a game by ID
	async getGameById(gameId: number) {
		const game = await this.prisma.games.findUnique({
		  where: { id: gameId },
		  include: {
			questions: {
			  include: {
				options: true,
			  },
			},
		  },
		});
	
		if (!game) {
		  throw new NotFoundException(`Game with ID ${gameId} not found.`);
		}
		return game;
	  }

}