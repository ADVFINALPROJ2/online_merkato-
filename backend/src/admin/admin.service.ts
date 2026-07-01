import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getVerificationSummary() {
    const [
      pendingDrivers,
      approvedDrivers,
      rejectedDrivers,
      pendingSellers,
      approvedSellers,
      rejectedSellers,
      unassignedOrders,
    ] = await Promise.all([
      this.prisma.driverProfile.count({ where: { status: 'PENDING' } }),
      this.prisma.driverProfile.count({ where: { status: 'APPROVED' } }),
      this.prisma.driverProfile.count({ where: { status: 'REJECTED' } }),
      this.prisma.shop.count({ where: { verificationStatus: 'PENDING' } }),
      this.prisma.shop.count({ where: { verificationStatus: 'APPROVED' } }),
      this.prisma.shop.count({ where: { verificationStatus: 'REJECTED' } }),
      this.prisma.order.count({ where: { delivery: null } }),
    ]);

    return {
      drivers: { pending: pendingDrivers, approved: approvedDrivers, rejected: rejectedDrivers },
      sellers: { pending: pendingSellers, approved: approvedSellers, rejected: rejectedSellers },
      fulfillment: { unassignedOrders },
    };
  }

  async getPendingDrivers() {
    return this.prisma.driverProfile.findMany({
      where: { status: 'PENDING' },
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
      orderBy: { createdAt: 'asc' },
    });
  }

  async updateDriverStatus(profileId: string, status: VerificationStatus) {
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

  async getPendingSellers() {
    return this.prisma.shop.findMany({
      where: { verificationStatus: 'PENDING' },
      include: {
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
          },
        },
        location: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async updateSellerStatus(shopId: string, status: VerificationStatus) {
    const shop = await this.prisma.shop.findUnique({ where: { id: shopId } });
    if (!shop) {
      throw new NotFoundException('Seller shop not found');
    }

    return this.prisma.shop.update({
      where: { id: shopId },
      data: { verificationStatus: status },
    });
  }

  async getUnassignedOrders() {
    return this.prisma.order.findMany({
      where: { delivery: null },
      include: {
        buyer: {
          select: {
            firstName: true,
            lastName: true,
            phoneNumber: true,
          },
        },
        items: {
          include: {
            product: {
              include: {
                shop: {
                  include: {
                    location: true,
                    seller: {
                      select: {
                        firstName: true,
                        lastName: true,
                        phoneNumber: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getApprovedDrivers() {
    return this.prisma.driverProfile.findMany({
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
  }

  async assignDriverToOrder(orderId: string, driverUserId: string) {
    const [order, driver] = await Promise.all([
      this.prisma.order.findUnique({ where: { id: orderId } }),
      this.prisma.driverProfile.findUnique({ where: { userId: driverUserId } }),
    ]);

    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (!driver || driver.status !== 'APPROVED') {
      throw new NotFoundException('Approved driver not found');
    }

    return this.prisma.delivery.upsert({
      where: { orderId: orderId },
      update: { runnerId: driverUserId, status: 'ASSIGNED' },
      create: { orderId: orderId, runnerId: driverUserId, status: 'ASSIGNED' },
    });
  }
}
