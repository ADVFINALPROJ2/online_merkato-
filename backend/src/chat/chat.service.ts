import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async createMessage(data: { id: string; text: string; sender: string }) {
    const message = await this.prisma.message.create({
      data,
    });

    return message;
  }

  async getMessages(orderId: string) {
    return this.prisma.message.findMany({
      where: { orderId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
