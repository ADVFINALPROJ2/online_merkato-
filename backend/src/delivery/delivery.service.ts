import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DeliveryService {
  constructor(private readonly prisma: PrismaService) {}

  async assignDriverToOrder(orderId: string, driverUserId: string) {
    const [order, driver] = await Promise.all([
      this.prisma.order.findUnique({ where: { id: orderId } }),
      this.prisma.driverProfile.findUnique({ where: { userId: driverUserId } }),
    ]);

    if (!order) {
      throw new Error('Order not found');
    }
    if (!driver || driver.status !== 'APPROVED') {
      throw new Error('Approved driver not found');
    }

    return this.prisma.delivery.upsert({
      where: { orderId },
      update: { runnerId: driverUserId, status: 'ASSIGNED' },
      create: { orderId, runnerId: driverUserId, status: 'ASSIGNED' },
    });
  }

  async acceptOrder(orderId: string) {
    const delivery = await this.prisma.delivery.findUnique({
      where: { orderId },
    });

    if (!delivery || delivery.status !== 'ASSIGNED') {
      throw new Error('Invalid order or delivery status');
    }

    return this.prisma.delivery.update({
      where: { orderId },
      data: { status: 'ACCEPTED' },
    });
  }

  async pickUpOrder(orderId: string) {
    const delivery = await this.prisma.delivery.findUnique({
      where: { orderId },
    });

    if (!delivery || delivery.status !== 'ACCEPTED') {
      throw new Error('Invalid order or delivery status');
    }

    return this.prisma.delivery.update({
      where: { orderId },
      data: { status: 'PICKED_UP' },
    });
  }

  async completeOrder(orderId: string) {
    const delivery = await this.prisma.delivery.findUnique({
      where: { orderId },
    });

    if (!delivery || delivery.status !== 'PICKED_UP') {
      throw new Error('Invalid order or delivery status');
    }

    return this.prisma.delivery.update({
      where: { orderId },
      data: { status: 'COMPLETED' },
    });
  }
}
