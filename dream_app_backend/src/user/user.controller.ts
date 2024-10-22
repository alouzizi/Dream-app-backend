import { Body, ConflictException, Controller, Delete, Get, HttpException, HttpStatus, InternalServerErrorException, Param, ParseIntPipe, Post, Query, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { UserService } from './user.service';
import { RoleGuard, Roles, UserRoles } from 'src/role.guard';
import { log } from 'console';
import { CreateUserDto } from 'src/dto/create-user.dto';
import {  CombinedJwtAuthGuard } from 'src/user-auth.guard';
import { AdminJwtAuthGuard } from 'src/admin-auth.guard';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
      ) {}

      
      //get my info
      @UseGuards( CombinedJwtAuthGuard,RoleGuard)
      @Roles(UserRoles.ADMIN, UserRoles.USER)
      @ApiOperation({ summary: 'Get current user profile' })
      @ApiResponse({ status: 200, description: 'Returns the user profile.' })
      @ApiResponse({ status: 401, description: 'Unauthorized.' })
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


    @UseGuards( CombinedJwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    @ApiParam({ name: 'id', type: 'string' })
    @ApiResponse({ status: 200, description: 'Returns the user info.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @Get(":id")
    async getUserInfo(@Param("id") id: string) {
        try{
          //check if user exists
          
        return this.userService.getUserInfo(id);
        }
        catch(err){
            return err;
        }
    }

    //get all users
    @UseGuards( CombinedJwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'Returns all users.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @Get()
    async getAllUsers() {
        return this.userService.getAllUsers();
    }


    //delete user
    @UseGuards( CombinedJwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    @ApiOperation({ summary: 'Delete a user' })
    @ApiParam({ name: 'id', type: 'string' })
    @ApiResponse({ status: 200, description: 'User deleted successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @Delete("delete/:id")
    async deleteUser(@Param("id") id: string) {
        return this.userService.deleteUser(id);
    }

    //add user diamond
    @UseGuards( CombinedJwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    @ApiOperation({ summary: 'Add diamonds to a user' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiParam({ name: 'diamond', type: 'number' })
    @ApiResponse({ status: 200, description: 'Diamonds added successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
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
    @UseGuards( CombinedJwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    @ApiOperation({ summary: 'Add coins to a user' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiParam({ name: 'coin', type: 'number' })
    @ApiResponse({ status: 200, description: 'Coins added successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
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
    @UseGuards( CombinedJwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    
    @Get("filter")
    @UseGuards( CombinedJwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    @Get("filter")
    @ApiOperation({ summary: 'Filter users with pagination' })   
    @ApiOperation({ summary: 'Filter users' })
    @ApiParam({ name: 'name', type: 'string', required: false })
    @ApiParam({ name: 'diamond', type: 'number', required: false })
    @ApiParam({ name: 'coin', type: 'number', required: false })
    @ApiParam({ name: 'point', type: 'number', required: false })
    @ApiParam({ name: 'type', type: 'string', required: false })
    @ApiParam({ name: 'page', type: 'number', required: false, description: 'Page number (default: 1)' })
    @ApiParam({ name: 'limit', type: 'number', required: false, description: 'Items per page (default: 10)' })
    @ApiResponse({ status: 200, description: 'Returns filtered users with pagination.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async getUserFilter(
      @Param('name') name?: string,
      @Param('diamond') diamond?: number,
      @Param('coin') coin?: number,
      @Param('point') point?: number,
      @Param('type') type?: string,
      @Param('page') page: number = 1,
      @Param('limit') limit: number = 10
    ) {
      return this.userService.getUserFilter(name, diamond, coin, point, type, page, limit);
    }
  

    //admin can create user
    @UseGuards( CombinedJwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    @ApiOperation({ summary: 'Create a new user' })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ status: 201, description: 'User created successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 409, description: 'User already exists.' })
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
