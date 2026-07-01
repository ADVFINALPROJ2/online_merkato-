import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDriverDto } from './dto/register-driver.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class DriverService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDriverDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new BadRequestException('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.$transaction(async (tx) => {
      const nameParts = dto.fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const user = await tx.user.create({
        data: {
          firstName,
          lastName,
          email: dto.email,
          phoneNumber: dto.phoneNumber,
          password: hashedPassword,
          role: 'DRIVER',
        },
      });

      await tx.driverProfile.create({
        data: {
          userId: user.id,
          vehicleType: dto.vehicleType as any,
          licensePlate: dto.licensePlate,
          idImageUrl: dto.idImageUrl,
          licenseImageUrl: dto.licenseImageUrl,
        },
      });

      return {
        message: 'Driver registration submitted successfully.',
        userId: user.id,
      };
    });
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, role: user.role },
    };
  }
}
