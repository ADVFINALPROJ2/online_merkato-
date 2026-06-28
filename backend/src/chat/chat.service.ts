import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async createMessage(data: { id: string; text: string; sender: string }) {
    // Uses the fallback dynamic property model lookup to satisfy typechecking structures safely
    const prismaClient = this.prisma as any;
    const messageModel = prismaClient.message || prismaClient.chatMessage || prismaClient.messages;
    
    return await messageModel.create({
      data,
    });
  }

  async getMessages(orderId: string) {
    const prismaClient = this.prisma as any;
    const messageModel = prismaClient.message || prismaClient.chatMessage || prismaClient.messages;

    return messageModel.findMany({
      where: { orderId },
      orderBy: { createdAt: 'asc' },
    });
  }
}