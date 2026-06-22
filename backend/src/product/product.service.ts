import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductStatus } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  private async findShopBySellerId(sellerId: string) {
    const shop = await this.prisma.shop.findUnique({ where: { sellerId } });
    if (!shop) {
      throw new NotFoundException('You must create a shop first');
    }
    return shop;
  }

  async create(dto: CreateProductDto, sellerId: string) {
    const shop = await this.findShopBySellerId(sellerId);

    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category) {
      throw new BadRequestException('Category not found');
    }

    return this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        quantity: dto.quantity,
        status: dto.status ?? ProductStatus.DRAFT,
        images: dto.images ?? [],
        categoryId: dto.categoryId,
        shopId: shop.id,
      },
      include: {
        category: { select: { id: true, name: true } },
        shop: { select: { id: true, name: true } },
      },
    });
  }

  async findAll(sellerId: string) {
    const shop = await this.findShopBySellerId(sellerId);
    return this.prisma.product.findMany({
      where: { shopId: shop.id },
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { id: true, name: true } },
      },
    });
  }

  async findAllPublic(shopId?: string, categoryId?: string) {
    const where: any = { status: ProductStatus.ACTIVE };
    if (shopId) where.shopId = shopId;
    if (categoryId) where.categoryId = categoryId;

    return this.prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { id: true, name: true } },
        shop: { select: { id: true, name: true, logoUrl: true } },
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true } },
        shop: {
          select: { id: true, name: true, logoUrl: true, sellerId: true },
        },
      },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: string, dto: UpdateProductDto, sellerId: string) {
    const product = await this.findOne(id);

    const shop = await this.prisma.shop.findUnique({ where: { sellerId } });
    if (!shop || product.shopId !== shop.id) {
      throw new ForbiddenException('You can only update your own products');
    }

    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });
      if (!category) {
        throw new BadRequestException('Category not found');
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.price !== undefined && { price: dto.price }),
        ...(dto.quantity !== undefined && { quantity: dto.quantity }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.images !== undefined && { images: dto.images }),
        ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
      },
      include: {
        category: { select: { id: true, name: true } },
        shop: { select: { id: true, name: true } },
      },
    });
  }

  async remove(id: string, sellerId: string) {
    const product = await this.findOne(id);

    const shop = await this.prisma.shop.findUnique({ where: { sellerId } });
    if (!shop || product.shopId !== shop.id) {
      throw new ForbiddenException('You can only delete your own products');
    }

    await this.prisma.product.delete({ where: { id } });
    return { message: 'Product deleted successfully' };
  }

  async updateInventory(id: string, quantity: number, sellerId: string) {
    const product = await this.findOne(id);

    const shop = await this.prisma.shop.findUnique({ where: { sellerId } });
    if (!shop || product.shopId !== shop.id) {
      throw new ForbiddenException('You can only update your own products');
    }

    if (quantity < 0) {
      throw new BadRequestException('Quantity cannot be negative');
    }

    const newStatus = quantity === 0 ? ProductStatus.OUT_OF_STOCK : product.status;

    return this.prisma.product.update({
      where: { id },
      data: { quantity, status: newStatus },
      include: {
        category: { select: { id: true, name: true } },
      },
    });
  }

  async updateStatus(id: string, status: ProductStatus, sellerId: string) {
    const product = await this.findOne(id);

    const shop = await this.prisma.shop.findUnique({ where: { sellerId } });
    if (!shop || product.shopId !== shop.id) {
      throw new ForbiddenException('You can only update your own products');
    }

    return this.prisma.product.update({
      where: { id },
      data: { status },
      include: {
        category: { select: { id: true, name: true } },
      },
    });
  }
}
