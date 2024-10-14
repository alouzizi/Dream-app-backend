import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from '../dto/create-user.dto';
import { JwtAuthGuard } from "src/jwt-auth.guard";
import { Request } from 'express';
import { LoginDto } from "src/dto/login-validator.dto";
import { GoogleDto } from "src/dto/google-validator.dto";

// Response DTOs (you'll need to create these)
import { UserResponseDto, LoginResponseDto,GoogleAuthResponseDto, UpdateResponseDto,RegisterResponseDto } from '../dto/user-response.dto';


@ApiTags('Authentication')
@Controller("auth")
export class AuthController {
  constructor(private readonly userService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully registered.',
    type: RegisterResponseDto
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  register(@Req() req: Request, @Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
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
  @ApiResponse({ 
    status: 200, 
    description: 'User information updated successfully.',
    type: UpdateResponseDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async updateUserInfo(@Req() req: any, @Body() createUserDto: CreateUserDto) {
    const id = req.user.id;
    return this.userService.updateUser(id, createUserDto);
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
}