import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { UserRoles } from '@prisma/client';  // Import the UserRoles enum
import { ApiProperty } from '@nestjs/swagger';

export class GoogleDto {
//   @IsString()
//   @IsNotEmpty()
//   name: string;

//   @IsEmail()
//   @IsNotEmpty()
//   email: string;

//   @IsString()
//   @IsNotEmpty()
//   phoneNumber: string;

//   @IsString()
//   @MinLength(6) 
//   password: string;
@ApiProperty()
  @IsString()
  @IsNotEmpty()
//   @IsOptional()  // Optional field; defaults to null if not provided
@ApiProperty()
  @MinLength(6)
  googleId?: string;
  // Other fields can be added based on the schema (like avatar, points, etc.)
}