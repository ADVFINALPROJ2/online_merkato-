import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { ShopLocationDto } from './dto/shop-location.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ShopService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateShopDto, sellerId: string) {
    const existing = await this.prisma.shop.findUnique({
      where: { sellerId },
    });
    if (existing) {
      throw new ConflictException('You already own a shop');
    }

    const shop = await this.prisma.shop.create({
      data: {
        name: dto.name,
        description: dto.description,
        logoUrl: dto.logoUrl,
        bannerUrl: dto.bannerUrl,
        contactPhone: dto.contactPhone,
        businessType: dto.businessType,
        sellerId,
      },
      include: {
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        location: true,
      },
    });

    return {
      message: 'Shop created successfully',
      shop,
    };
  }

  async findBySellerId(sellerId: string) {
    const shop = await this.prisma.shop.findUnique({
      where: { sellerId },
      include: {
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        location: true,
      },
    });
    if (!shop) {
      throw new NotFoundException('Shop not found');
    }
    return shop;
  }

  async findByPublicId(shopId: string) {
    const shop = await this.prisma.shop.findUnique({
      where: { id: shopId },
      include: {
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        location: true,
      },
    });
    if (!shop) {
      throw new NotFoundException('Shop not found');
    }
    return shop;
  }

  async update(dto: UpdateShopDto, sellerId: string) {
    await this.findBySellerId(sellerId);

    await this.prisma.shop.update({
      where: { sellerId },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.logoUrl !== undefined && { logoUrl: dto.logoUrl }),
        ...(dto.bannerUrl !== undefined && { bannerUrl: dto.bannerUrl }),
        ...(dto.contactPhone !== undefined && { contactPhone: dto.contactPhone }),
        ...(dto.businessType !== undefined && { businessType: dto.businessType }),
      },
    });

    return this.findBySellerId(sellerId);
  }

  async setLocation(sellerId: string, dto: ShopLocationDto) {
    const shop = await this.findBySellerId(sellerId);

    const existing = await this.prisma.shopLocation.findUnique({
      where: { shopId: shop.id },
    });

    if (existing) {
      return this.prisma.shopLocation.update({
        where: { shopId: shop.id },
        data: {
          region: dto.region,
          city: dto.city,
          subCity: dto.subCity,
          woreda: dto.woreda,
          terra: dto.terra,
          latitude: dto.latitude,
          longitude: dto.longitude,
          landmark: dto.landmark,
        },
      });
    }

    return this.prisma.shopLocation.create({
      data: {
        shopId: shop.id,
        region: dto.region,
        city: dto.city,
        subCity: dto.subCity,
        woreda: dto.woreda,
        terra: dto.terra,
        latitude: dto.latitude,
        longitude: dto.longitude,
        landmark: dto.landmark,
      },
    });
  }

  async getDashboard(sellerId: string) {
    const shop = await this.findBySellerId(sellerId);

    const [totalProducts, activeProducts, outOfStockProducts] =
      await Promise.all([
        this.prisma.product.count({ where: { shopId: shop.id } }),
        this.prisma.product.count({
          where: { shopId: shop.id, status: 'ACTIVE' },
        }),
        this.prisma.product.count({
          where: { shopId: shop.id, status: 'OUT_OF_STOCK' },
        }),
      ]);

    return {
      shop,
      stats: {
        totalProducts,
        activeProducts,
        outOfStockProducts,
        totalProductsValue: 0,
      },
    };
  }
}
