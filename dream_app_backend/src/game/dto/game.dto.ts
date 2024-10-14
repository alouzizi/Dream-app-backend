
import { IsInt, IsArray, IsString, IsEnum, IsOptional, IsDate } from 'class-validator';
import { GameStatus } from 'prisma/prisma-client';
import { Type } from 'class-transformer';

export class CreateGameDto {
  @IsString() // New field for game name
  name: string;

  @IsInt()
  requiredDiamonds: number;

  @IsInt()
  duration: number;
 
  @IsString()
  reward: string;

  @IsArray()
  @IsString({ each: true })
  trophyTypes: string[];
  
  @IsArray()
  @IsInt({ each: true })
  sponsorId: number[] = [];


  @Type(() => Date) 
  @IsDate()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  endDate: Date;
  
  @IsOptional()
  @IsString()
  images?: string;


  @IsOptional()
  @IsString()
  options?: string;

  @IsOptional()
  @IsString()
  licenseId?: string;

  @IsOptional()
  @IsInt()
  winnerId?: number;

  @IsArray()
  questions: {
    question: string;
    maxTime: number;
    options: {
      optionText: string;
      isCorrect: boolean;
    }[];
  }[];
}


