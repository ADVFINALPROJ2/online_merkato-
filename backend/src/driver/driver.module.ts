import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [DriverController],
  providers: [DriverService, PrismaService],
})
export class DriverModule {}