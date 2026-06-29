import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto, sellerId: string) {
    const shop = await this.prisma.shop.findUnique({
      where: { sellerId },
    });

    if (!shop) {
      throw new NotFoundException('You must have a shop to add products');
    }

    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    const product = await this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        quantity: dto.quantity ?? 0,
        images: dto.images ?? [],
        status: dto.status ?? 'ACTIVE',
        categoryId: dto.categoryId,
        shopId: shop.id,
      },
      include: {
        shop: { select: { id: true, name: true, logoUrl: true } },
        category: { select: { id: true, name: true } },
      },
    });

    return product;
  }

  async findBySellerId(sellerId: string) {
    const shop = await this.prisma.shop.findUnique({
      where: { sellerId },
    });

    if (!shop) {
      return [];
    }

    return this.prisma.product.findMany({
      where: { shopId: shop.id },
      include: {
        shop: { select: { id: true, name: true, logoUrl: true } },
        category: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        shop: { select: { id: true, name: true, logoUrl: true } },
        category: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        shop: { select: { id: true, name: true, logoUrl: true } },
        category: { select: { id: true, name: true } },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: string, dto: UpdateProductDto, sellerId: string) {
    const product = await this.findOne(id);

    const shop = await this.prisma.shop.findUnique({
      where: { sellerId },
    });

    if (!shop || product.shopId !== shop.id) {
      throw new ForbiddenException('You can only update your own products');
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.price !== undefined && { price: dto.price }),
        ...(dto.quantity !== undefined && { quantity: dto.quantity }),
        ...(dto.images !== undefined && { images: dto.images }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
      },
      include: {
        shop: { select: { id: true, name: true, logoUrl: true } },
        category: { select: { id: true, name: true } },
      },
    });
  }

  async updateStatus(id: string, status: string, sellerId: string) {
    const product = await this.findOne(id);

    const shop = await this.prisma.shop.findUnique({
      where: { sellerId },
    });

    if (!shop || product.shopId !== shop.id) {
      throw new ForbiddenException('You can only update your own products');
    }

    return this.prisma.product.update({
      where: { id },
      data: { status: status as any },
      include: {
        shop: { select: { id: true, name: true, logoUrl: true } },
        category: { select: { id: true, name: true } },
      },
    });
  }

  async updateInventory(id: string, quantity: number, sellerId: string) {
    const product = await this.findOne(id);

    const shop = await this.prisma.shop.findUnique({
      where: { sellerId },
    });

    if (!shop || product.shopId !== shop.id) {
      throw new ForbiddenException('You can only update your own products');
    }

    const newStatus = quantity === 0 ? 'OUT_OF_STOCK' : quantity > 0 && product.status === 'OUT_OF_STOCK' ? 'ACTIVE' : product.status;

    return this.prisma.product.update({
      where: { id },
      data: {
        quantity,
        status: newStatus as any,
      },
      include: {
        shop: { select: { id: true, name: true, logoUrl: true } },
        category: { select: { id: true, name: true } },
      },
    });
  }

  async remove(id: string, sellerId: string) {
    const product = await this.findOne(id);

    const shop = await this.prisma.shop.findUnique({
      where: { sellerId },
    });

    if (!shop || product.shopId !== shop.id) {
      throw new ForbiddenException('You can only delete your own products');
    }

    await this.prisma.product.delete({ where: { id } });
    return { message: 'Product deleted successfully' };
  }
}
