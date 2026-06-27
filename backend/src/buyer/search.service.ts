import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchQueryDto } from './dto/search-query.dto';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: SearchQueryDto) {
    const { q, page = 1, limit = 20, categoryId, minPrice, maxPrice, sortBy = 'createdAt', order = 'desc' } = query;
    const skip = (page - 1) * limit;
    const where: any = { isActive: true };
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (categoryId) where.categoryId = categoryId;
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
    return { query: q, data: products, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async getSuggestions(q: string) {
    if (!q || q.trim().length < 2) return { suggestions: [] };
    const [products, categories] = await Promise.all([
      this.prisma.product.findMany({
        where: { isActive: true, name: { contains: q, mode: 'insensitive' } },
        select: { id: true, name: true, price: true },
        take: 6,
      }),
      this.prisma.category.findMany({
        where: { name: { contains: q, mode: 'insensitive' } },
        select: { id: true, name: true },
        take: 3,
      }),
    ]);
    return { suggestions: { products, categories } };
  }
}
