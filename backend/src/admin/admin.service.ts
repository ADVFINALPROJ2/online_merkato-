import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // Fetch all profiles awaiting review
  async getPendingDrivers() {
    return this.prisma.driverProfile.findMany({
      where: { status: 'PENDING' },
    });
  }

  // Task #47: Approve or Reject a profile application
  async updateDriverStatus(profileId: string, status: string) {
    const profile = await this.prisma.driverProfile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      throw new NotFoundException('Driver profile not found');
    }

    return this.prisma.driverProfile.update({
      where: { id: profileId },
      data: { status },
    });
  }

  // Fetch all orders that currently do not have a delivery tracker created
  async getUnassignedOrders() {
    return this.prisma.order.findMany({
      where: { delivery: null },
      include: {
        buyer: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  // Task #37: Link an order runner id
  async assignDriverToOrder(orderId: string, driverUserId: string) {
    return this.prisma.delivery.upsert({
      where: { orderId: orderId },
      update: { runnerId: driverUserId, status: 'ASSIGNED' },
      create: { orderId: orderId, runnerId: driverUserId, status: 'ASSIGNED' },
    });
  }
}