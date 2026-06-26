import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCraftDto } from './dto/create-craft.dto';
import { UpdateCraftDto } from './dto/update-craft.dto';

@Injectable()
export class CraftService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCraftDto, buyerId: string) {
    return this.prisma.craftRequest.create({
      data: {
        ...dto,
        buyerId,
      },
    });
  }

  async findAll() {
    return this.prisma.craftRequest.findMany({
      include: { buyer: { select: { firstName: true, lastName: true, email: true } } },
    });
  }

  async findOne(id: string) {
    const request = await this.prisma.craftRequest.findUnique({ where: { id } });
    if (!request) {
      throw new NotFoundException(`Craft request with ID ${id} not found`);
    }
    return request;
  }

  async update(id: string, dto: UpdateCraftDto, buyerId: string) {
    const request = await this.findOne(id);
    if (request.buyerId !== buyerId) {
      throw new ForbiddenException('Access Denied: You can only edit your own craft requests');
    }
    return this.prisma.craftRequest.update({ where: { id }, data: dto });
  }

  async remove(id: string, buyerId: string) {
    const request = await this.findOne(id);
    if (request.buyerId !== buyerId) {
      throw new ForbiddenException('Access Denied: You can only delete your own craft requests');
    }
    await this.prisma.craftRequest.delete({ where: { id } });
    return { message: 'Craft request cancelled successfully' };
  }
}