import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  // #28 Place Order
  async placeOrder(buyerId: string, dto: CreateOrderDto) {
    const productIds = dto.items.map(i => i.productId);

    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      throw new NotFoundException('One or more products not found');
    }

    let total = 0;
    const orderItems = dto.items.map((item) => {
      const product = products.find((p: any) => p.id === item.productId);
      if (!product) throw new NotFoundException(`Product ${item.productId} not found`);
      const lineTotal = product.price * item.quantity;
      total += lineTotal;
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price,
      };
    });

    const deliveryFee = 50;

    return this.prisma.order.create({
      data: {
        buyerId,
        totalAmount: total + deliveryFee,
        deliveryFee,
        deliveryAddress: dto.deliveryAddress,
        paymentMethod: dto.paymentMethod,
        items: { create: orderItems },
      },
      include: { items: true },
    });
  }

  // #29 Cancel Order
  async cancelOrder(buyerId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.buyerId !== buyerId) throw new ForbiddenException();
    if (order.status !== 'PENDING') throw new ForbiddenException('Only PENDING orders can be cancelled');

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    });
  }

  // #30 Track Order
  async trackOrder(buyerId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, delivery: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.buyerId !== buyerId) throw new ForbiddenException();
    return order;
  }

  // #31 Order History
  async getOrderHistory(buyerId: string) {
    return this.prisma.order.findMany({
      where: { buyerId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // #32 Confirm Delivery
  async confirmDelivery(buyerId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.buyerId !== buyerId) throw new ForbiddenException();

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'DELIVERED' },
    });
  }
}