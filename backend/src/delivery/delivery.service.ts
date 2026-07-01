import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class DeliveryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async getDriverOrders(driverUserId: string) {
    return this.prisma.delivery.findMany({
      where: { runnerId: driverUserId },
      include: {
        order: {
          include: {
            buyer: {
              select: { id: true, firstName: true, lastName: true, phoneNumber: true },
            },
            items: {
              include: {
                product: {
                  select: {
                    id: true, name: true, price: true, imageUrl: true,
                    shop: {
                      select: {
                        id: true, name: true,
                        location: true,
                        seller: {
                          select: { id: true, firstName: true, lastName: true, phoneNumber: true },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getOrderDetails(orderId: string) {
    const delivery = await this.prisma.delivery.findUnique({
      where: { orderId },
      include: {
        order: {
          include: {
            buyer: {
              select: { id: true, firstName: true, lastName: true, phoneNumber: true },
            },
            items: {
              include: {
                product: {
                  select: {
                    id: true, name: true, price: true, imageUrl: true,
                    shop: {
                      select: {
                        id: true, name: true,
                        location: true,
                        seller: {
                          select: { id: true, firstName: true, lastName: true, phoneNumber: true },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!delivery) throw new NotFoundException('Delivery not found for this order');
    return delivery;
  }

  async assignDriverToOrder(orderId: string, driverUserId: string) {
    const [order, driver] = await Promise.all([
      this.prisma.order.findUnique({ where: { id: orderId }, include: { delivery: true } }),
      this.prisma.driverProfile.findUnique({ where: { userId: driverUserId } }),
    ]);

    if (!order) throw new NotFoundException('Order not found');
    if (!driver || driver.status !== 'APPROVED') throw new BadRequestException('Approved driver not found');

    return this.prisma.delivery.upsert({
      where: { orderId },
      update: { runnerId: driverUserId, status: 'ASSIGNED' },
      create: { orderId, runnerId: driverUserId, status: 'ASSIGNED' },
    });
  }

  async acceptOrder(orderId: string) {
    const delivery = await this.prisma.delivery.findUnique({ where: { orderId } });
    if (!delivery) throw new NotFoundException('Delivery not found');
    if (delivery.status !== 'ASSIGNED') throw new BadRequestException('Delivery must be ASSIGNED before accepting');

    const updated = await this.prisma.delivery.update({
      where: { orderId },
      data: { status: 'ACCEPTED' },
    });

    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (order) {
      await this.notificationService.notifyDeliveryUpdate(order.buyerId, orderId, 'ACCEPTED');
    }

    return updated;
  }

  async pickUpOrder(orderId: string) {
    const delivery = await this.prisma.delivery.findUnique({ where: { orderId } });
    if (!delivery) throw new NotFoundException('Delivery not found');
    if (delivery.status !== 'ACCEPTED') throw new BadRequestException('Delivery must be ACCEPTED before pickup');

    const updated = await this.prisma.delivery.update({
      where: { orderId },
      data: { status: 'PICKED_UP', pickedUpAt: new Date() },
    });

    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (order) {
      await this.notificationService.notifyDeliveryUpdate(order.buyerId, orderId, 'PICKED_UP');
    }

    return updated;
  }

  async outForDelivery(orderId: string) {
    const delivery = await this.prisma.delivery.findUnique({ where: { orderId } });
    if (!delivery) throw new NotFoundException('Delivery not found');
    if (delivery.status !== 'PICKED_UP') throw new BadRequestException('Delivery must be PICKED_UP before out for delivery');

    const updated = await this.prisma.delivery.update({
      where: { orderId },
      data: { status: 'OUT_FOR_DELIVERY' },
    });

    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (order) {
      await this.notificationService.notifyDeliveryUpdate(order.buyerId, orderId, 'OUT_FOR_DELIVERY');
    }

    return updated;
  }

  async getSellerDeliveries(sellerUserId: string) {
    return this.prisma.delivery.findMany({
      where: {
        order: {
          items: {
            some: {
              product: {
                shop: { sellerId: sellerUserId },
              },
            },
          },
        },
      },
      include: {
        order: {
          select: {
            id: true,
            totalAmount: true,
            deliveryAddress: true,
            deliveryFee: true,
            status: true,
            createdAt: true,
            buyer: {
              select: { id: true, firstName: true, lastName: true, phoneNumber: true },
            },
          },
        },
        runner: {
          select: { id: true, firstName: true, lastName: true, phoneNumber: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getBuyerDeliveries(buyerUserId: string) {
    return this.prisma.delivery.findMany({
      where: { order: { buyerId: buyerUserId } },
      include: {
        order: {
          select: {
            id: true,
            totalAmount: true,
            deliveryAddress: true,
            deliveryFee: true,
            status: true,
            createdAt: true,
          },
        },
        runner: {
          select: { id: true, firstName: true, lastName: true, phoneNumber: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async trackDelivery(orderId: string) {
    const delivery = await this.prisma.delivery.findUnique({
      where: { orderId },
      include: {
        runner: {
          select: { id: true, firstName: true, lastName: true, phoneNumber: true },
        },
        order: {
          select: {
            id: true,
            status: true,
            totalAmount: true,
            deliveryAddress: true,
            deliveryFee: true,
            paymentMethod: true,
            createdAt: true,
            buyer: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
      },
    });

    if (!delivery) throw new NotFoundException('Delivery not found for this order');
    return delivery;
  }

  async completeOrder(orderId: string) {
    const delivery = await this.prisma.delivery.findUnique({ where: { orderId } });
    if (!delivery) throw new NotFoundException('Delivery not found');
    if (delivery.status !== 'OUT_FOR_DELIVERY') throw new BadRequestException('Delivery must be OUT_FOR_DELIVERY before completing');

    const [updated] = await Promise.all([
      this.prisma.delivery.update({
        where: { orderId },
        data: { status: 'COMPLETED', deliveredAt: new Date() },
      }),
      this.prisma.order.update({
        where: { id: orderId },
        data: { status: 'DELIVERED' },
      }),
    ]);

    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (order) {
      await this.notificationService.notifyDeliveryUpdate(order.buyerId, orderId, 'COMPLETED');
    }

    return updated;
  }
}
