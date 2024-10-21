import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaClient } from '@prisma/client';
import { JwtStrategy } from 'src/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants';


@Module({
  controllers: [UserController],
  providers: [UserService, PrismaClient,JwtStrategy],
  exports: [UserService],
})
export class UserModule {}
