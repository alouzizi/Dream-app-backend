import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { UserRoles } from '@prisma/client';  // Import the UserRoles enum
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
  @ApiProperty()
  @IsString()
  @IsOptional()  // Make password optional if you're allowing Google login
  @MinLength(6) 
  password: string;
  @ApiProperty()
  @IsString()
  @IsOptional()  // Optional field; defaults to null if not provided
  @MinLength(6)
  googleId?: string;
  @ApiProperty()
  @IsEnum(UserRoles)
  @IsOptional()  // Optional field; defaults to USER if not provided
  role?: UserRoles;
  @ApiProperty()
  @IsString()
  @IsOptional()
  gender?: string;
  @ApiProperty()
  @IsOptional()
  dob?: Date;  // Assuming date of birth
  @ApiProperty()
  @IsString()
  @IsOptional()
  country?: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  city?: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  dream?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({message: "Type must not be empty"})
  type: string;
  // Other fields can be added based on the schema (like avatar, points, etc.)
}
