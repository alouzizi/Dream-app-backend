
import { IsInt, IsArray, IsString, IsEnum, IsOptional, IsDate } from 'class-validator';
import { GameStatus } from 'prisma/prisma-client';
import { Type } from 'class-transformer';

export class CreateGameDto {
  @IsString() // New field for game name
  gameName: string;

  @IsInt()
  requiredDiamond: number;

  // @IsInt()
  // duration: number;
 
  // @IsString()
  // reward: string;

  // @IsArray()
  // @IsString({ each: true })
  // trophyTypes: string[];
  
  @IsArray()
  @IsInt({ each: true })
  sponsors: number[] = [];


  @Type(() => Date) 
  @IsDate()
  startingDate: Date;

  // @Type(() => Date)
  // @IsDate()
  // endDate: Date;
  
  // @IsOptional()
  @IsString({each: true})
  prizes: string[];


  // @IsOptional()
  // @IsString()
  // options?: string;

  @IsOptional()
  @IsString()
  licences?: string;


  @IsArray()
  quizFile: {
    question: string;
    time: number;
    options: {
      text: string;
      isCorrect: boolean;
    }[];
  }[];
}


