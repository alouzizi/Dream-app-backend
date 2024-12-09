// user-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    points: number;

    @ApiProperty()
    avatar: string;

    @ApiProperty()
    googleId: string;

    @ApiProperty()
    type: string;

    @ApiProperty()
    role: string;

    @ApiProperty()
    dob: Date;

    @ApiProperty()
    country: string;

    @ApiProperty()
    city: string;

    @ApiProperty()
    totatpoints: number;

    @ApiProperty()
    dream: string;

    @ApiProperty()
    daimonds: number;

    @ApiProperty()
    level: number;

    @ApiProperty()
    gender: string;

    @ApiProperty()
    phoneNumber: string;

}



export class LoginResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  user: UserResponseDto;
}

export class adminDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;
}

export class AdminLoginResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  user: adminDto;
}

export class RegisterResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  user: UserResponseDto;
}


export class GoogleAuthResponseDto {
    @ApiProperty()
    message: string;

    @ApiProperty()
    user: UserResponseDto;
    @ApiProperty()
    token: string;
}


export class UpdateResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  user: UserResponseDto;
}