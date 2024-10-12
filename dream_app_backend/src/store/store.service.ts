import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateStoreDto } from './store.dto';

@Injectable()
export class StoreService {
  private prisma = new PrismaClient();

  // Create a new store
  async createStore(createStoreDto: CreateStoreDto) {
    return this.prisma.store.create({
      data: {
        name: createStoreDto.name,
        price: createStoreDto.price,
        productType: createStoreDto.productType,
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
}
