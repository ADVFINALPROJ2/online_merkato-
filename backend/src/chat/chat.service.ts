import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async createMessage(data: {
    orderId: string;
    senderId: string;
    receiverId: string;
    body: string;
  }) {
    return this.prisma.chatMessage.create({ data });
  }

  async getMessages(orderId: string) {
    return this.prisma.chatMessage.findMany({
      where: { orderId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
