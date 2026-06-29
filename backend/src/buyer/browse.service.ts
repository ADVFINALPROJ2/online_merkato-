import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BrowseQueryDto } from './dto/browse-query.dto';

@Injectable()
export class BrowseService {
  constructor(private readonly prisma: PrismaService) {}

  async browseProducts(query: BrowseQueryDto) {
    const { page = 1, limit = 20, sortBy = 'createdAt', order = 'desc', minPrice, maxPrice } = query;
    const skip = (page - 1) * limit;
    const where: any = { isActive: true };
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where, skip, take: limit, orderBy: { [sortBy]: order },
        include: {
          category: { select: { id: true, name: true } },
          shop: { select: { id: true, name: true, logoUrl: true } },
          _count: { select: { reviews: true } },
        },
      }),
      this.prisma.product.count({ where }),
    ]);
    return { data: products, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async getProductDetail(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        shop: { select: { id: true, name: true, logoUrl: true } },
        reviews: {
          take: 10, orderBy: { createdAt: 'desc' },
          include: { buyer: { select: { id: true, firstName: true, lastName: true } } },
        },
        _count: { select: { reviews: true } },
      },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async getShopInfo(shopId: string) {
    const shop = await this.prisma.shop.findUnique({
      where: { id: shopId },
      include: { seller: { select: { id: true, firstName: true, lastName: true } }, location: true },
    });
    if (!shop) throw new NotFoundException('Shop not found');
    return shop;
  }

  async getCategories() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { products: true } } },
    });
  }

  async browseByCategory(categoryId: string, query: BrowseQueryDto) {
    const { page = 1, limit = 20, sortBy = 'createdAt', order = 'desc' } = query;
    const skip = (page - 1) * limit;
    const where = { categoryId, isActive: true };
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where, skip, take: limit, orderBy: { [sortBy]: order },
        include: { shop: { select: { id: true, name: true, logoUrl: true } }, _count: { select: { reviews: true } } },
      }),
      this.prisma.product.count({ where }),
    ]);
    return { data: products, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async browseByShop(shopId: string, query: BrowseQueryDto) {
    const { page = 1, limit = 20, sortBy = 'createdAt', order = 'desc' } = query;
    const skip = (page - 1) * limit;
    const shop = await this.prisma.shop.findUnique({ where: { id: shopId } });
    if (!shop) throw new NotFoundException('Shop not found');
    const where = { shopId, isActive: true };
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where, skip, take: limit, orderBy: { [sortBy]: order },
        include: { category: { select: { id: true, name: true } }, _count: { select: { reviews: true } } },
      }),
      this.prisma.product.count({ where }),
    ]);
    return { shop, data: products, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }
}
