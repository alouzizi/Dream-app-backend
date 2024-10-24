import { Injectable, NotFoundException } from "@nestjs/common";
import { GameStatus, PrismaClient } from "prisma/prisma-client";
import { CreateGameDto } from "./dto/game.dto";
import { NotificationService } from "../notification/notification.service";
import { SchedulerRegistry } from "@nestjs/schedule";

@Injectable()
export class GameService {
  private prisma = new PrismaClient();

  constructor(
    private readonly notificationService: NotificationService,
    private readonly schedulerRegistry: SchedulerRegistry
  ) {}

  async createGame(createGameDto: CreateGameDto) {
    const now = new Date();
    let status: GameStatus;

    const startDate = new Date(createGameDto.startingDate);
    const duration = createGameDto.quizFile.reduce(
      (total, question) => total + question.time,
      0
    );
    const endDate = new Date(startDate.getTime() + duration * 1000);

    console.log("startDate", startDate);
    console.log("endDate", endDate);

    const reward = createGameDto.quizFile.length * 5;

    if (now < startDate) {
      status = GameStatus.PENDING;
    } else if (now >= startDate && now <= endDate) {
      status = GameStatus.STARTED;
    } else {
      status = GameStatus.ENDED;
    }

    //check if sponsor is empty return error

    if (createGameDto.sponsors.length === 0) {
      throw new NotFoundException("Sponsor is required");
    }
    console.log("createGameDto.sponsors", createGameDto.sponsors);
    //check if the sponsers is exist in the database
    const sponsor = await this.prisma.sponsor.findMany({
      where: {
        id: {
          in: createGameDto.sponsors,
        },
      },
    });
    if (sponsor.length !== createGameDto.sponsors.length) {
      throw new NotFoundException("Sponsor not found");
    }

    const game = await this.prisma.games.create({
      data: {
        name: createGameDto.gameName,
        requiredDiamonds: createGameDto.requiredDiamond,
        prizes: createGameDto.prizes,
        status: status,
        startDate: startDate,
        reward: reward,
        // endDate: createGameDto.endDate,
        sponsorId:
          createGameDto.sponsors.length > 0
            ? {
                connect: createGameDto.sponsors.map((id) => ({ id })),
              }
            : undefined,
        licenseId: createGameDto.licences,
        questions: {
          create: createGameDto.quizFile.map((question) => ({
            question: question.question,
            maxTime: question.time,
            options: {
              create: question.options.map((option) => ({
                optionText: option.text,
                isCorrect: option.isCorrect,
              })),
            },
          })),
        },
      },
    });

    this.scheduleGameNotifications(game.id, startDate, endDate);
    return game;
  }

  private scheduleGameNotifications(
    gameId: number,
    startDate: Date,
    endDate: Date
  ) {
    const startTimeout = startDate.getTime() - Date.now();
    const endTimeout = endDate.getTime() - Date.now();

    if (startTimeout > 0) {
      const startHandle = setTimeout(async () => {
        await this.startGame(gameId);
      }, startTimeout);
      this.schedulerRegistry.addTimeout(`start-game-${gameId}`, startHandle);
    }

    if (endTimeout > 0) {
      const endHandle = setTimeout(async () => {
        await this.endGame(gameId);
      }, endTimeout);
      this.schedulerRegistry.addTimeout(`end-game-${gameId}`, endHandle);
    }
  }

  async startGame(gameId: number) {
    console.log("startGame");
    const game = await this.prisma.games.findUnique({ where: { id: gameId } });
    if (!game) {
      throw new NotFoundException(`Game with ID ${gameId} not found.`);
    }

    await this.prisma.games.update({
      where: { id: gameId },
      data: { status: GameStatus.STARTED },
    });

    const message = `Game ${gameId} has started!`;
    await this.notificationService.broadcastNotification(message);
  }

  async endGame(gameId: number) {
    console.log("endGame");
    const game = await this.prisma.games.findUnique({ where: { id: gameId } });
    if (!game) {
      throw new NotFoundException(`Game with ID ${gameId} not found.`);
    }

    await this.prisma.games.update({
      where: { id: gameId },
      data: { status: GameStatus.ENDED },
    });

    const message = `Game ${gameId} has ended!`;
    await this.notificationService.broadcastNotification(message);
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

  async getAllGames() {
    const games = await this.prisma.games.findMany({
      where: {
        status: {
          in: ["STARTED", "PENDING"],
        },
      },
      select: {
        startDate: true,
        name: true,
        requiredDiamonds: true,
        reward: true,
        prizes: true,
        status: true,
        sponsorId: {
          select: {
            name: true,
          },
        },
      },
    });
    return games;
  }

  async deleteGame(id: number) {
    const game = await this.prisma.games.findUnique({
      where: { id },
      include: {
        winners: true,
        userGames: true,
        questions: {
          include: {
            options: true,
          },
        },
        scratchCard: true,
        reports: true,
      },
    });

    if (!game) {
      throw new NotFoundException("Game not found");
    }

    await this.prisma.$transaction(async (prisma) => {
      // Delete options for all questions
      for (const question of game.questions) {
        await prisma.option.deleteMany({
          where: { questionId: question.id },
        });
      }

      // Delete questions
      await prisma.question.deleteMany({
        where: { gameId: id },
      });

      // Delete scratch card if exists
      if (game.scratchCard) {
        await prisma.scratchCard.delete({
          where: { gameId: id },
        });
      }

      // Delete user games
      await prisma.userGames.deleteMany({
        where: { gameId: id },
      });

      // Delete winners
      await prisma.winners.deleteMany({
        where: { gameId: id },
      });

      // Delete reports
      await prisma.report.deleteMany({
        where: { gameId: id },
      });

      // Finally delete the game
      await prisma.games.delete({
        where: { id },
      });
    });

    return { message: "Game deleted successfully" };
  }
}
