import { Module } from '@nestjs/common';
import { CraftService } from './cart.service';       // Imports the class name actually in your file
import { CraftController } from './cart.controller'; // Imports the class name actually in your file
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CraftController],
  providers: [CraftService],
  exports: [CraftService],
})
export class CartModule {}