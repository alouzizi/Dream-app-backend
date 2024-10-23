import { Body, ConflictException, Controller, Delete, Get, HttpException, HttpStatus, InternalServerErrorException, Param, ParseIntPipe, Post, Query, Req, Res, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { UserService } from './user.service';
import { RoleGuard, Roles, UserRoles } from 'src/role.guard';
import { log } from 'console';
import { CreateUserDto } from 'src/dto/create-user.dto';

import { AdminJwtAuthGuard } from 'src/admin-auth.guard';

import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { FileInterceptor } from "@nestjs/platform-express";
import * as path from "path";
import * as fs from "fs";
import multer from 'multer';



@ApiTags('Users')
@ApiBearerAuth()
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
      ) {}

      
      //get my info
      @UseGuards( JwtAuthGuard,RoleGuard)
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


    @UseGuards( JwtAuthGuard, RoleGuard)
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
    @UseGuards( JwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'Returns all users.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @Get()
    async getAllUsers() {
      // console.log("get all users");
        return this.userService.getAllUsers();
    }


    //delete user
    @UseGuards( JwtAuthGuard, RoleGuard)
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
    @UseGuards( JwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    @ApiOperation({ summary: 'Add diamonds to a user' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiParam({ name: 'diamond', type: 'number' })
    @ApiResponse({ status: 200, description: 'Diamonds added successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @Post("addDiamond/:id/:diamond")
    async addUserDiamond(
      @Param("id", ParseIntPipe) id: number,
      @Param("diamond", ParseIntPipe) diamond: number
    ) {
      console.log("add diamond");
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
    @UseGuards( JwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    @ApiOperation({ summary: 'Add coins to a user' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiParam({ name: 'coin', type: 'number' })
    @ApiResponse({ status: 200, description: 'Coins added successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @Post("addCoin/:id/:coin")
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
    @UseGuards( JwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    
    @Get("filter")
    @UseGuards( JwtAuthGuard, RoleGuard)
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
    @UseGuards( JwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    @ApiOperation({ summary: 'Create a new user' })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ status: 201, description: 'User created successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 409, description: 'User already exists.' })
    @UseInterceptors(
      FileInterceptor("avatar", {
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (req, file, callback) => {
          if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return callback(
              new HttpException(
                "Invalid file type. Only JPG and PNG are allowed.",
                HttpStatus.BAD_REQUEST
              ),
              false
            );
          }
          callback(null, true);
        },
      })
    )


    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(UserRoles.ADMIN)
    @Post("createUser")
async createUser(
    @Body() body: CreateUserDto,
    @UploadedFile() avatar: Express.Multer.File,
    @Res() res
) {
    try {
      console.log("create user");
        const generatePassword = () => {
            const length = 8;
            const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
            let password = "";
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * charset.length);
                password += charset[randomIndex];
            }
            return password;
        };
        let logoPath = null;
        const generatedPassword = generatePassword();
        if (avatar) {
          const uploadDir = './uploads/avatars';
  
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
  
          // Delete old logo if it exists
          if (body.avatar && fs.existsSync(body.avatar)) {
            fs.unlinkSync(body.avatar);
          }
  
          // Create a unique file path for new logo
          logoPath = path.join(uploadDir, `${Date.now()}-${avatar.originalname}`);
          // Write new file to disk
          fs.writeFileSync(logoPath, avatar.buffer);
        }
        const userData = {
            ...body,
            password: generatedPassword,
            avatar: logoPath
        };

        const user = await this.userService.createUser(userData);
        
        return res.status(201).json({
            message: "User created successfully",
            user: {
                email: user.email,
                password: generatedPassword,
                avatar: user.avatar
            }
        });
    } catch (error) {
        if (error instanceof ConflictException) {
            return res.status(409).json({ message: error.message });
        }
        console.error('Error creating user:', error);
        return res.status(400).json({ 
            message: error.message || "Error creating user"
        });
    }
}



}
