import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDriverDto } from './dto/register-driver.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class DriverService {
  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) {}

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

   async getDriverDeliveries(userId: string) {
  return this.prisma.delivery.findMany({
    where: {
      runnerId: userId,
    },
    include: {
      order: {
        include: {
          buyer: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

async getDriverProfile(userId: string) {
  const [user, driverProfile, deliveries] = await Promise.all([
    this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, firstName: true, lastName: true, email: true,
        phoneNumber: true, role: true, createdAt: true,
      },
    }),
    this.prisma.driverProfile.findUnique({
      where: { userId },
    }),
    this.prisma.delivery.findMany({
      where: { runnerId: userId },
      include: {
        order: {
          select: {
            id: true, totalAmount: true, deliveryAddress: true,
            status: true, createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  if (!user) throw new NotFoundException('User not found');

  const totalDeliveries = deliveries.length;
  const completedDeliveries = deliveries.filter((d) => d.status === 'COMPLETED').length;
  const activeDeliveries = totalDeliveries - completedDeliveries;

  return {
    user,
    driverProfile,
    stats: { totalDeliveries, completedDeliveries, activeDeliveries },
    recentDeliveries: deliveries.slice(0, 20),
  };
}
  

  async markAsDelivered(deliveryId: string) {
    const delivery = await this.prisma.delivery.findUnique({
      where: { id: deliveryId },
    });
    

    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }

    if (delivery.status === 'COMPLETED') {
      throw new BadRequestException('Delivery is already completed');
    }

    const [updatedDelivery] = await this.prisma.$transaction([
      this.prisma.delivery.update({
        where: { id: deliveryId },
        data: {
          status: 'COMPLETED',
          deliveredAt: new Date(),
        },
      }),
      this.prisma.order.update({
        where: { id: delivery.orderId },
        data: { status: 'DELIVERED' },
      }),
    ]);

    return updatedDelivery;
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { userId: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
