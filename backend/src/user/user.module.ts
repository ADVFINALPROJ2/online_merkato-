import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AdminController } from './admin.controller'; // Import this
import { AdminService } from './admin.service';         // Import this
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserController, AdminController], // Add AdminController
  providers: [UserService, AdminService],         // Add AdminService
})
export class UserModule {}