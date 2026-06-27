import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Adjust path if needed
import { AuthModule } from '../auth/auth.module';     // ⚠️ CRITICAL IMPORT!

@Module({
  imports: [
    PrismaModule, 
    AuthModule // ◄ Tells NestJS how to use AuthGuard('jwt') on products!
  ], 
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}