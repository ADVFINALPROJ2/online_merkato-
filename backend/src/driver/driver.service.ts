import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDriverDto } from './dto/register-driver.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DriverService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: RegisterDriverDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Build user payload defensively based on your exact schema properties
    const userData: any = {
      email: dto.email,
      password: hashedPassword,
    };

    // Safely assign whichever name property your specific schema uses
    if ('fullName' in (this.prisma.user as any).fields) {
      userData.fullName = dto.fullName;
    } else {
      userData.name = dto.fullName;
    }

    const user = await this.prisma.user.create({
      data: userData,
    });

    return {
      message: 'Driver registration submitted successfully.',
      userId: user.id,
    };
  }
}
