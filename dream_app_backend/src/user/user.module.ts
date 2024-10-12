import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaClient } from '@prisma/client';
import { JwtStrategy } from 'src/jwt.strategy';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaClient,JwtStrategy]
})
export class UserModule {}
