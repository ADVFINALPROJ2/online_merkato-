import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { NotificationsGateway } from '../notification/notifications.gateway'; // Ensure your file path matches this exactly!

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private notificationsGateway: NotificationsGateway,
  ) {}

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

    const order = await this.prisma.order.create({
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

    // 💡 REAL-TIME BROADCAST: Notify Shop(s) & Buyer instantly
    try {
      // 💡 FIXED: Changed sellerId to shopId based on your Prisma error log!
      const uniqueShopIds = Array.from(new Set(products.map(p => p.shopId).filter(Boolean)));
      
      // 1. Alert every shop owner who owns products in this order
      uniqueShopIds.forEach((shopId: string) => {
        this.notificationsGateway.sendNotification(shopId, 'new_order', {
          message: `🎉 You have a new order request! (Order #${order.id})`,
          orderId: order.id,
        });
      });

      // 2. Alert the buyer that their order went through successfully
      this.notificationsGateway.sendNotification(buyerId, 'order_status', {
        message: '✅ Your order has been placed and is pending approval!',
        status: 'PENDING',
        orderId: order.id,
      });
    } catch (err) {
      console.error('Real-time order placement notifications failed:', err);
    }

    return order;
  }

  // #29 Cancel Order
  async cancelOrder(buyerId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({ 
      where: { id: orderId },
      include: { items: true }
    });
    
    if (!order) throw new NotFoundException('Order not found');
    if (order.buyerId !== buyerId) throw new ForbiddenException();
    if (order.status !== 'PENDING') throw new ForbiddenException('Only PENDING orders can be cancelled');

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    });

    // 💡 REAL-TIME BROADCAST: Notify Buyer and Shops of cancellation
    try {
      // 1. Notify the buyer
      this.notificationsGateway.sendNotification(buyerId, 'order_status', {
        message: `🛑 You cancelled Order #${orderId}.`,
        status: 'CANCELLED',
        orderId,
      });

      // 2. Safely find the shops for these items to alert them of cancellation
      const productIds = order.items.map(item => item.productId);
      const products = await this.prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { shopId: true } // 💡 FIXED: Changed sellerId to shopId
      });

      const shopIds = Array.from(new Set(products.map(p => p.shopId).filter(Boolean)));
      
      shopIds.forEach((shopId: string) => {
        this.notificationsGateway.sendNotification(shopId, 'order_cancelled', {
          message: `⚠️ Customer cancelled Order #${orderId}.`,
          orderId,
        });
      });
    } catch (err) {
      console.error('Cancellation broadcast alert failed:', err);
    }

    return updated;
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

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'DELIVERED' },
    });

    // 💡 REAL-TIME BROADCAST: Notify Buyer that the order status updated to delivered
    try {
      this.notificationsGateway.sendNotification(buyerId, 'order_status', {
        message: `🏁 Order #${orderId} has been successfully marked as delivered! Thank you!`,
        status: 'DELIVERED',
        orderId,
      });
    } catch (err) {
      console.error('Delivery confirmation broadcast alert failed:', err);
    }

    return updated;
  }
}