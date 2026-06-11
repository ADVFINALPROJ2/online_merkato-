import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShopDto } from './dto/create-shop.dto';

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

    try {
      const shop = await this.prisma.shop.create({
        data: {
          name: dto.name,
          description: dto.description,
          logoUrl: dto.logoUrl,
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
        },
      });

      return {
        message: 'Shop created successfully',
        shop,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create shop');
    }
  }
}
