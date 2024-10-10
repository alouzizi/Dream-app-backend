import { Body, Controller, Get, Param, Post,Req,UseGuards  } from "@nestjs/common";
import { UserService } from "./user.service";
import { PrismaClient } from "@prisma/client";
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from "src/jwt-auth.guard";
import { RoleGuard, Roles, UserRoles } from 'src/role.guard';
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

  @Get("google")
  async IsGoogleAuth(@Body()loginUserDto: CreateUserDto) {
	return this.userService.isgoogleAuth(loginUserDto);
  }


  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @Get(":id")
  async getUserInfo(@Param("id") id: string) {
    return this.userService.getUserInfo(id);
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
