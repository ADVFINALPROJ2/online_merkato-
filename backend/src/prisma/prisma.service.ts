import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Temporary placeholders to keep other files from crashing while ignoring database errors
  async cleanOldRefreshTokens() {
    return true;
  }

  async cleanOldPasswordResetTokens() {
    return true;
  }
}