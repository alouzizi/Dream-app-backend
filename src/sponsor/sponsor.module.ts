import { Module } from '@nestjs/common';
import { SponsorController } from './sponsor.controller';
import { SponsorService } from './sponsor.service';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [SponsorController],
  providers: [SponsorService, PrismaClient]
})
export class SponsorModule {}
