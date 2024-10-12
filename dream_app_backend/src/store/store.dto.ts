import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  productType: string;
}
