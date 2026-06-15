import {
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { ShopLocationDto } from './dto/shop-location.dto';

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
    return this.prisma.shop.findUnique({
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
  }

  async findByPublicId(shopId: string) {
    return this.prisma.shop.findUnique({
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
  }

  async update(dto: UpdateShopDto, sellerId: string) {
    await this.prisma.shop.update({
      where: { sellerId },
      data: {
        name: dto.name,
        description: dto.description,
        logoUrl: dto.logoUrl,
        bannerUrl: dto.bannerUrl,
        contactPhone: dto.contactPhone,
        businessType: dto.businessType,
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

    return this.findBySellerId(sellerId);
  }

  async setLocation(shopId: string, dto: ShopLocationDto) {
    const existing = await this.prisma.shopLocation.findUnique({
      where: { shopId },
    });

    if (existing) {
      return this.prisma.shopLocation.update({
        where: { shopId },
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
        shopId,
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
}
