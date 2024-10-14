import { IsNotEmpty, IsInt, IsString, IsDecimal, IsBoolean, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReportDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  gameId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  trophyType: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  sponsorsId: number;


  @ApiProperty()
  @IsNotEmpty()
  expenses: number;

  @ApiProperty()
  @IsNotEmpty()
  additionalExpenses: number;

  @ApiProperty()
  //optional
  @IsNotEmpty()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  reportDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  hasTrophy: boolean;
}

export class ReportDto {
  id: number;
  userId: number;
  gameId: number;
  trophyType: string;
  sponsorsId: number;
  expenses: number;
  additionalExpenses: number;
  amount: number;
  reportDate: Date;
  hasTrophy: boolean;
  createdAt: Date;
}