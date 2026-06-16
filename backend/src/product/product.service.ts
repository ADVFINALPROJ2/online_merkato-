import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto, shopId: string) {
    if (dto.categoryId) {
      const categoryExists = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });
      if (!categoryExists) {
        throw new NotFoundException(`Category with ID ${dto.categoryId} does not exist`);
      }
    }

    return this.prisma.product.create({
      data: {
        name: dto.title, // Maps your DTO 'title' to your DB 'name'
        description: dto.description,
        price: dto.price,
        categoryId: dto.categoryId,
        shopId: shopId, // Maps to your DB 'shopId'
        stock: 1, // Fallback placeholder since 'stock' is required by your schema
      },
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: { category: true },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: string, dto: UpdateProductDto, shopId: string) {
    const product = await this.findOne(id);

    if (product.shopId !== shopId) {
      throw new ForbiddenException('Access Denied: You can only edit your own products');
    }

    // Prepare data mapping title -> name safely if provided
    const { title, ...remainingDto } = dto;
    const updateData = {
      ...remainingDto,
      ...(title ? { name: title } : {}),
    };

    return this.prisma.product.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string, shopId: string) {
    const product = await this.findOne(id);

    if (product.shopId !== shopId) {
      throw new ForbiddenException('Access Denied: You can only delete your own products');
    }

    await this.prisma.product.delete({ where: { id } });
    return { message: 'Product successfully removed from marketplace' };
  }
}