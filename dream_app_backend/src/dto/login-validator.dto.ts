import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { UserRoles } from '@prisma/client';  // Import the UserRoles enum

export class LoginDto {
//   @IsString()
//   @IsNotEmpty()
//   name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

//   @IsString()
//   @IsNotEmpty()
//   phoneNumber: string;

  @IsString()
  @MinLength(6) 
  @IsNotEmpty()
  password: string;

//   @IsString()
//   @IsOptional()  // Optional field; defaults to null if not provided
//   @MinLength(6)
//   googleId?: string;
  // Other fields can be added based on the schema (like avatar, points, etc.)
}
