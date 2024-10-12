import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DashboardModule } from './dashboard/dashboard.module';
import { GameModule } from './game/game.module';
import { SponsorModule } from './sponsor/sponsor.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DashboardModule, UserModule, GameModule, SponsorModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
