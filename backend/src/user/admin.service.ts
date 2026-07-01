import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    // We use Promise.all to fetch all numbers simultaneously for speed
    const [totalRevenue, orderCount, sellerCount, courierCount] = await Promise.all([
      this.prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'PAID' } }),
      this.prisma.order.count(),
      this.prisma.user.count({ where: { role: 'SELLER' } }),
      this.prisma.user.count({ where: { role: 'DELIVERY' } }),
    ]);

    return {
      totalRevenue: totalRevenue._sum.amount || 0,
      orderCount,
      sellerCount,
      courierCount,
    };
  }

  async getAllOrders() {
    return this.prisma.order.findMany({
      include: {
        buyer: { select: { firstName: true, lastName: true } },
        items: { include: { product: { select: { name: true } } } },
        delivery: { include: { runner: { select: { firstName: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}