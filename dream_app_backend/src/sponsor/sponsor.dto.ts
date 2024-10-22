import { IsEnum, IsNotEmpty, IsString, IsOptional } from "class-validator";
import { SponsorStatus } from "@prisma/client";

export class CreateSponsorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  @IsOptional()
  logo?: string;

  @IsOptional()
  @IsEnum(SponsorStatus)
  status: SponsorStatus;
}

export class UpdateSponsorDto {
  @IsOptional()
  @IsString()
  name?: string; // Optional field

  @IsOptional()
  logo?: string; // Optional field

  @IsOptional()
  @IsEnum(SponsorStatus)
  status?: SponsorStatus;
}