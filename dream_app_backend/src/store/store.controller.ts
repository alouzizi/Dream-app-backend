import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './store.dto';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { RoleGuard, Roles, UserRoles } from 'src/role.guard';


@UseGuards(JwtAuthGuard, RoleGuard)

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  // Create a new store
  @Roles(UserRoles.ADMIN)
  @Post()
  createStore(@Body() createStoreDto: CreateStoreDto) {
    return this.storeService.createStore(createStoreDto);
  }

  // Fetch all stores
  @Get()
  findAllStores() {
    return this.storeService.findAllStores();
  }

  // Fetch a store by ID
  @Get(':id')
  findStoreById(@Param('id') id: string) {
    return this.storeService.findStoreById(+id);
  }

  // Update a store
  @Roles(UserRoles.ADMIN)
  @Patch(':id')
  updateStore(@Param('id') id: string, @Body() updateData: Partial<CreateStoreDto>) {
    return this.storeService.updateStore(+id, updateData);
  }

  // Delete a store
  @Roles(UserRoles.ADMIN)
  @Delete(':id')
  deleteStore(@Param('id') id: string) {
    return this.storeService.deleteStore(+id);
  }
}