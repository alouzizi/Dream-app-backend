import { IsNotEmpty, IsInt, IsString, IsDecimal, IsBoolean, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReportDto {
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsInt()
  gameId: number;

  @IsNotEmpty()
  @IsString()
  trophyType: string;

  @IsNotEmpty()
  @IsInt()
  sponsorsId: number;

  @IsNotEmpty()
  expenses: number;

  @IsNotEmpty()
  additionalExpenses: number;


  //optional
  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  reportDate: Date;

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