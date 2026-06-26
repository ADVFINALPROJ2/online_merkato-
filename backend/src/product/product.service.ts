import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Role } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto, sellerId: string) {
    const shop = await this.prisma.shop.findUnique({
      where: { sellerId },
    });

    if (!shop) {
      throw new NotFoundException('Seller must have an active shop setup to post items.');
    }

    return this.prisma.product.create({
      data: {
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        quantity: createProductDto.quantity ?? 1,
        images: createProductDto.images ?? [],
        status: createProductDto.status,
        categoryId: createProductDto.categoryId,
        shopId: shop.id,
      },
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: { shop: true, category: true },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { shop: true, category: true },
    });

    if (!product) {
      throw new NotFoundException(`Product entry with ID ${id} was not found.`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto, userId: string, role: string) {
    const product = await this.findOne(id);

    if (role !== Role.ADMIN && product.shop.sellerId !== userId) {
      throw new ForbiddenException('Unauthorized control action on this inventory profile.');
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        name: updateProductDto.name,
        description: updateProductDto.description,
        price: updateProductDto.price,
        quantity: updateProductDto.quantity,
        images: updateProductDto.images,
        status: updateProductDto.status,
        categoryId: updateProductDto.categoryId,
      },
    });
  }

  async remove(id: string, userId: string, role: string) {
    const product = await this.findOne(id);

    if (role !== Role.ADMIN && product.shop.sellerId !== userId) {
      throw new ForbiddenException('Unauthorized control action on this inventory profile.');
    }

    return this.prisma.product.delete({
      where: { id },
    });
  }
}