import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { NotificationModule } from '../notification/notification.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [NotificationModule, ScheduleModule.forRoot()],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
