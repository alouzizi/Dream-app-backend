import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { CreateStoreDto } from "./store.dto";
import { UserService } from "src/user/user.service";

@Injectable()
export class StoreService {
  constructor(private readonly userService: UserService) {}
  private prisma = new PrismaClient();

  // Create a new store
  async createStore(createStoreDto: CreateStoreDto) {
    return this.prisma.store.create({
      data: {
        name: createStoreDto.name,
        price: createStoreDto.price,
        reward: createStoreDto.reward
      },
    });
  }

  // Fetch all stores
  async findAllStores() {
    return this.prisma.store.findMany();
  }

  // Fetch a store by ID
  async findStoreById(id: number) {
    return this.prisma.store.findUnique({
      where: { id },
    });
  }

  // Update a store
  async updateStore(id: number, updateData: Partial<CreateStoreDto>) {
    return this.prisma.store.update({
      where: { id },
      data: updateData,
    });
  }

  // Delete a store
  async deleteStore(id: number) {
    return this.prisma.store.delete({
      where: { id },
    });
  }



  async payForProduct(productId: number, userId: string) {
    const user = await this.userService.getUserInfo(userId);
    const product = await this.findStoreById(productId);

    if (!user || !product) {
      throw new NotFoundException("User or product not found");
    }

    if (user.points < product.price) {
      throw new BadRequestException(
        "Insufficient balance to purchase this product"
      );
    }
    user.points -= product.price;
    await this.userService.updateUserPoints(+userId, user.points);
   

    await this.userService.addUserDiamond(+userId, product.reward);

    return {
      message: `Product "${product.name}" successfully purchased by user ${user.name}`,
    };
  }


}
