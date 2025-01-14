import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiProperty,
  ApiConsumes,
} from "@nestjs/swagger";
import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { Request, Response } from "express";
import { LoginDto } from "src/dto/login-validator.dto";
import { GoogleDto } from "src/dto/google-validator.dto";

// Response DTOs (you'll need to create these)
import { UserResponseDto, LoginResponseDto,GoogleAuthResponseDto, UpdateResponseDto,RegisterResponseDto, AdminLoginResponseDto } from '../dto/user-response.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { CombinedJwtAuthGuard } from 'src/user-auth.guard';
import { serialize } from 'cookie';
import { AdminJwtAuthGuard } from "src/admin-auth.guard";
import { JwtAuthGuard } from "src/jwt-auth.guard";


class FileUploadDto {
  @ApiProperty({ type: "string", format: "binary" })
  avatar: any;
}

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly userService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: "User successfully registered.",
    type: RegisterResponseDto,
  })
  @ApiResponse({ status: 400, description: "Bad Request." })
  @UseInterceptors(FileInterceptor("avatar"))
  async register(
    @Req() req: Request,
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() avatar: Express.Multer.File
  ) {

     try {
        return await this.userService.register(createUserDto, avatar);
    } catch (error) {
        if (error instanceof ConflictException) {
            throw new HttpException(error.message, HttpStatus.CONFLICT);
        }
        throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post("login")
  @ApiOperation({ summary: "Login user" })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: "User successfully logged in.",
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  login(@Body() loginUserDto: LoginDto) {
    return this.userService.login(loginUserDto);
  }

  @Get("google")
  @ApiOperation({ summary: "Google authentication" })
  @ApiBody({ type: GoogleDto })
  @ApiResponse({
    status: 200,
    description: "Google authentication successful.",
    type: GoogleAuthResponseDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  async IsGoogleAuth(@Body() loginUserDto: GoogleDto) {
    return this.userService.isgoogleAuth(loginUserDto);
  }

  @UseGuards(CombinedJwtAuthGuard)
  @Post("update")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update user information" })
  @ApiBody({ type: CreateUserDto })
  @ApiConsumes("multipart/form-data")
  @ApiResponse({
    status: 200,
    description: "User information updated successfully.",
    type: UpdateResponseDto,
  })
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
  @ApiResponse({ status: 401, description: "Unauthorized." })
  async updateUserInfo(
    @Req() req: any,
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() avatar: Express.Multer.File
  ) {
    const id = req.user.id;
    return this.userService.updateUser(id, createUserDto, avatar);
  }

  @UseGuards(CombinedJwtAuthGuard)
  @Post("updatePassword")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update user password" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        oldPassword: { type: "string" },
        newPassword: { type: "string" },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Password updated successfully.",
    schema: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  async updatePassword(@Req() req: any, @Body() body: any) {
    const id = req.user.id;
    return this.userService.updatePassword(id, body);
  }

  //USER can delete his account
  @UseGuards(CombinedJwtAuthGuard)
  @Post("delete")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete user account" })
  @ApiResponse({
    status: 200,
    description: "User account deleted successfully.",
    schema: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  async deleteUser(@Req() req: any, @Body() body: any) {
    const id = req.user.id;

    return this.userService.deleteUser(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('check-auth')
  async checkAuth(@Req() request: Request) {
    // Debug logging

    return { status: 'Authenticated' };
  }

  @Post('admin/login')
  async adminLogin(@Body() loginUserDto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const { user, token } = await this.userService.adminLogin(loginUserDto);
  
    // const serialized = serialize('Jwt-tk', token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production', // Use secure in production
    //   sameSite: 'strict', // or 'lax' depending on your requirements
    //   maxAge: 1000 * 60 * 60 * 24 * 2, // 2 days
    //   path: '/',
    //   // domain: 'localhos',
    // });

    // response.setHeader('Set-Cookie', serialized);
    response.cookie('Jwt-tk', token, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 2, // 2 days

    });

    return {
      message: 'Login success',
      token: token,
      user: {
        id: user.id,
        email: user.email,
        // Add other necessary user properties, but avoid anything that might contain circular references
      }
    };
  }
  
}
