import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { PrismaClient } from "@prisma/client";
import { CreateUserDto } from '../dto/create-user.dto';

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly prismaService: PrismaClient
  ) {}
  @Post("register")
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @Post("login")
  async login(@Body() loginUserDto: CreateUserDto) {
    return this.userService.login(loginUserDto);
  }

  @Get(":id")
  async getUserInfo(@Param("id") id: string) {
    return this.userService.getUserInfo(id);
  }
}
