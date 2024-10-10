import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRoles } from '@prisma/client';  // Import the UserRoles enum

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @IsEnum(UserRoles)
  @IsOptional()  // Optional field; defaults to USER if not provided
  role?: UserRoles;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsOptional()
  dob?: Date;  // Assuming date of birth

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  dream?: string;

  // Other fields can be added based on the schema (like avatar, points, etc.)
}
