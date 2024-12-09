import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [StoreService],
  controllers: [StoreController],
  imports: [UserModule],
})
export class StoreModule {}
