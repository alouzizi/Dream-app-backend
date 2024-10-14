import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiBody, ApiProperty, ApiConsumes } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from '../dto/create-user.dto';
import { JwtAuthGuard } from "src/jwt-auth.guard";
import { Request } from 'express';
import { LoginDto } from "src/dto/login-validator.dto";
import { GoogleDto } from "src/dto/google-validator.dto";

// Response DTOs (you'll need to create these)
import { UserResponseDto, LoginResponseDto,GoogleAuthResponseDto, UpdateResponseDto,RegisterResponseDto } from '../dto/user-response.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';


class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  avatar: any;
}

@ApiTags('Authentication')
@Controller("auth")
export class AuthController {
  constructor(private readonly userService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: 'Register a new user' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateUserDto })
  
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully registered.',
    type: RegisterResponseDto
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @UseInterceptors(FileInterceptor('avatar'))
  register(@Req() req: Request, @Body() createUserDto: CreateUserDto, @UploadedFile() avatar: Express.Multer.File) {
    return this.userService.register(createUserDto, avatar);
  }

  @Post("login")
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
    status: 200, 
    description: 'User successfully logged in.',
    type: LoginResponseDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  login(@Body() loginUserDto: LoginDto) {
    return this.userService.login(loginUserDto);
  }

  @Get("google")
  @ApiOperation({ summary: 'Google authentication' })
  @ApiBody({ type: GoogleDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Google authentication successful.',
    type: GoogleAuthResponseDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async IsGoogleAuth(@Body() loginUserDto: GoogleDto) {
    return this.userService.isgoogleAuth(loginUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post("update")
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user information' })
  @ApiBody({ type: CreateUserDto })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ 
    status: 200, 
    description: 'User information updated successfully.',
    type: UpdateResponseDto
  })
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async updateUserInfo(@Req() req: any, @Body() createUserDto: CreateUserDto, @UploadedFile() avatar: Express.Multer.File) {
    const id = req.user.id;
    return this.userService.updateUser(id, createUserDto, avatar);
  }

  @UseGuards(JwtAuthGuard)
  @Post("updatePassword")
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user password' })
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        oldPassword: { type: 'string' },
        newPassword: { type: 'string' },
      },
    },
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Password updated successfully.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async updatePassword(@Req() req: any, @Body() body: any) {
    const id = req.user.id;
    return this.userService.updatePassword(id, body);
  }


  //USER can delete his account
  @UseGuards(JwtAuthGuard)
  @Post("delete")
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user account' })
  @ApiResponse({ 
    status: 200, 
    description: 'User account deleted successfully.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async deleteUser(@Req() req: any ,@Body() body: any) {
    const id = req.user.id;
    
    return this.userService.deleteUser(id,body);
  }

}