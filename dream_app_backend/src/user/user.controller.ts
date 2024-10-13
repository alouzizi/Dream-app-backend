import { Body, ConflictException, Controller, Delete, Get, HttpException, HttpStatus, InternalServerErrorException, Param, ParseIntPipe, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { RoleGuard, Roles, UserRoles } from 'src/role.guard';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { log } from 'console';
import { CreateUserDto } from 'src/dto/create-user.dto';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
      ) {}

      
      //get my info
      @UseGuards(JwtAuthGuard, RoleGuard)
      @Roles(UserRoles.ADMIN, UserRoles.USER)
      @Get("profile")
      async getMyInfo(@Req() req: any) {
        const userId = req.user?.id;
        if (!userId) {
            throw new UnauthorizedException('User not found in request');
        }
        try {
            return this.userService.getInfo(userId);
        } catch(err) {
            // Log the error and throw an appropriate HTTP exception
            console.error(err);
            throw new InternalServerErrorException('Failed to retrieve user info');
        }
    }


    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    @Get(":id")
    async getUserInfo(@Param("id") id: string) {
        try{
        return this.userService.getUserInfo(id);
        }
        catch(err){
            return err;
        }
    }

    //get all users
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    @Get()
    async getAllUsers() {
        return this.userService.getAllUsers();
    }


    //delete user
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    @Delete("delete/:id")
    async deleteUser(@Param("id") id: string) {
        return this.userService.deleteUser(id);
    }

    //add user diamond
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    @Get("addDiamond/:id/:diamond")
    async addUserDiamond(
      @Param("id", ParseIntPipe) id: number,
      @Param("diamond", ParseIntPipe) diamond: number
    ) {
      try {
        const updatedUser = await this.userService.addUserDiamond(id, diamond);
        return { message: "Diamonds added successfully", user: updatedUser };
      } catch (error) {
        if (error instanceof HttpException) {
          throw error;
        }
        throw new HttpException('Failed to add diamonds', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    //add user coin
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    @Get("addCoin/:id/:coin")
    async addUserCoin(
      @Param("id", ParseIntPipe) id: number,
      @Param("coin", ParseIntPipe) coin: number
    ) {
      try {
        const updatedUser = await this.userService.addUserCoin(id, coin);
        return { message: "Coins added successfully", user: updatedUser };
      } catch (error) {
        if (error instanceof HttpException) {
          throw error;
        }
        throw new HttpException('Failed to add coins', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    //get user filter by name or total diamond or total coin or total point or name
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    @Get("filter")
    async getUserFilter(
    @Param("name") name?: string,
    @Param("diamond") diamond?: number,
    @Param("coin") coin?: number,
    @Param("point") point?: number
    ) {
        return this.userService.getUserFilter(name, diamond, coin, point);
    }

    //admin can create user
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    @Post("createUser")
    async createUser(@Body() body: CreateUserDto, @Res() res) {
        try {
        const user = await this.userService.createUser(body);
        res.status(201).json({message: "User created", user});
        } catch (err) {
        if (err instanceof ConflictException) {
            return res.status(409).json({message: err.message});
        }
        return res.status(400).json({message: "Error in creating user"});
        }
    }



}
