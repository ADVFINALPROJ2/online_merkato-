import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssignmentService {
  constructor(private readonly prisma: PrismaService) {}

  async getAvailableDrivers() {
    const drivers = await this.prisma.driverProfile.findMany({
      where: { status: 'APPROVED' },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const activeCounts = await Promise.all(
      drivers.map((d) =>
        this.prisma.delivery.count({
          where: {
            runnerId: d.userId,
            status: { in: ['ASSIGNED', 'ACCEPTED', 'PICKED_UP', 'OUT_FOR_DELIVERY'] },
          },
        }),
      ),
    );

    return drivers.map((driver, i) => ({
      ...driver,
      activeDeliveries: activeCounts[i],
    }));
  }

  async getDriverSuggestions(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              include: {
                shop: { select: { location: true } },
              },
            },
          },
        },
      },
    });

    if (!order) throw new NotFoundException('Order not found');

    const drivers = await this.getAvailableDrivers();

    return drivers;
  }

  async assignToOrder(orderId: string, driverUserId: string) {
    const [order, driver] = await Promise.all([
      this.prisma.order.findUnique({ where: { id: orderId }, include: { delivery: true } }),
      this.prisma.driverProfile.findUnique({ where: { userId: driverUserId } }),
    ]);

    if (!order) throw new NotFoundException('Order not found');
    if (!driver || driver.status !== 'APPROVED') throw new BadRequestException('Driver is not approved');
    if (order.delivery) throw new BadRequestException('Order already has a delivery assigned');

    return this.prisma.delivery.create({
      data: {
        orderId,
        runnerId: driverUserId,
        status: 'ASSIGNED',
      },
      include: {
        order: {
          select: {
            id: true,
            totalAmount: true,
            deliveryAddress: true,
            buyer: { select: { firstName: true, lastName: true, phoneNumber: true } },
          },
        },
        runner: {
          select: { id: true, firstName: true, lastName: true, phoneNumber: true },
        },
      },
    });
  }

  async getActiveDeliveriesCount(driverUserId: string) {
    return this.prisma.delivery.count({
      where: {
        runnerId: driverUserId,
        status: { in: ['ASSIGNED', 'ACCEPTED', 'PICKED_UP', 'OUT_FOR_DELIVERY'] },
      },
    });
  }
}
