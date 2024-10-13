import { Body, Controller, Get, Param, Post,Req,UseGuards  } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { PrismaClient } from "@prisma/client";
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from "src/jwt-auth.guard";
import { RoleGuard, Roles, UserRoles } from 'src/role.guard';
import { Request } from 'express';
import { LoginDto } from "src/dto/login-validator.dto";
import { GoogleDto } from "src/dto/google-validator.dto";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly userService: AuthService,
  ) {}

  @Post("register")
  register(@Req() req: Request,@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @Post("login")
  login(@Body() loginUserDto: LoginDto) {
    return this.userService.login(loginUserDto);
  }

  @Get("google")
  async IsGoogleAuth(@Body()loginUserDto: GoogleDto) {
	return this.userService.isgoogleAuth(loginUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post("update")
  async updateUserInfo(@Req() req:any, @Body() createUserDto: CreateUserDto) {
	const id = req.user.id;
	return this.userService.updateUser(id,createUserDto);
  }

  //update password
  @UseGuards(JwtAuthGuard)
  @Post("updatePassword")
  async updatePassword(@Req() req:any, @Body() body:any) {
        const id = req.user.id;
        return this.userService.updatePassword(id,body);
  }

  //forget password


}
