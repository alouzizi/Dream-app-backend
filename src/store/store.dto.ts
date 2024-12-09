import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  price: number;

  @IsInt()
  @IsNotEmpty()
  reward: number;
}
