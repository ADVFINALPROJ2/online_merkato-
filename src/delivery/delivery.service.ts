import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DeliveryService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrderWithDelivery(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: { delivery: true },
    });
  }

  async getAnotherOrderWithDelivery(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: { delivery: true },
    });
  }

  async getYetAnotherOrderWithDelivery(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: { delivery: true },
    });
  }
}
