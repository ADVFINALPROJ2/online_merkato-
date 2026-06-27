import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecommendationService {
  constructor(private readonly prisma: PrismaService) {}

  async getForUser(userId: string) {
    const pastOrders = await this.prisma.order.findMany({
      where: { buyerId: userId },
      select: { items: { select: { product: { select: { categoryId: true } } } } },
      take: 20,
      orderBy: { createdAt: 'desc' },
    });
    const categoryIds = [...new Set(
      pastOrders.flatMap((o: any) => o.items.map((i: any) => i.product.categoryId)).filter(Boolean),
    )] as string[];
    if (categoryIds.length === 0) return this.getTrending();
    const products = await this.prisma.product.findMany({
      where: { isActive: true, categoryId: { in: categoryIds } },
      orderBy: { orderItems: { _count: 'desc' } },
      take: 20,
      include: {
        category: { select: { id: true, name: true } },
        shop: { select: { id: true, name: true, logoUrl: true } },
        _count: { select: { reviews: true } },
      },
    });
    return { data: products };
  }

  async getRelatedProducts(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { categoryId: true },
    });
    if (!product) return { data: [] };
    const related = await this.prisma.product.findMany({
      where: { isActive: true, categoryId: product.categoryId, NOT: { id: productId } },
      orderBy: { orderItems: { _count: 'desc' } },
      take: 10,
      include: {
        shop: { select: { id: true, name: true, logoUrl: true } },
        _count: { select: { reviews: true } },
      },
    });
    return { data: related };
  }

  async getTrending() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const trending = await this.prisma.product.findMany({
      where: {
        isActive: true,
        orderItems: { some: { order: { createdAt: { gte: sevenDaysAgo } } } },
      },
      orderBy: { orderItems: { _count: 'desc' } },
      take: 20,
      include: {
        category: { select: { id: true, name: true } },
        shop: { select: { id: true, name: true, logoUrl: true } },
        _count: { select: { reviews: true } },
      },
    });
    return { data: trending };
  }
}
