// // src/games/dto/create-game.dto.ts
// import { IsInt, IsArray, IsString, IsEnum, IsOptional } from 'class-validator';
// import { GameStatus } from 'prisma/prisma-client';

// export class CreateGameDto {
//   @IsInt()
//   requiredDiamonds: number;

//   @IsInt()
//   duration: number;
 
//   @IsString()
//   reward: string;

//   @IsArray()
//   @IsString({ each: true })
//   trophyTypes: string[];

//   @IsEnum(GameStatus)
//   status: GameStatus;
  
//   @IsArray()
//   @IsInt({ each: true })
//   sponsorIds: number[];
  
//   // @IsOptional()
//   @IsString()
//   images?: string;

//   @IsOptional()
//   @IsString()
//   options?: string;

//   @IsOptional()
//   @IsString()
//   licenseId?: string; // Optional field for license ID

//   @IsOptional()
//   @IsInt()
//   winnerId?: number; // Optional field for the winner's ID
// }



// src/games/dto/create-game.dto.ts
import { IsInt, IsArray, IsString, IsEnum, IsOptional } from 'class-validator';
import { GameStatus } from 'prisma/prisma-client';

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

  @IsEnum(GameStatus)
  status: GameStatus;
  
  @IsArray()
  @IsInt({ each: true })
  sponsorId: number[] = [];
  
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
