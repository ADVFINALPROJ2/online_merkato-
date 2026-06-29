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

  async cleanOldRefreshTokens() {
    const expired = new Date(Date.now() - 30 * 24 * 3600000);
    return this.refreshToken.deleteMany({ where: { expiresAt: { lt: expired } } });
  }

  async cleanOldPasswordResetTokens() {
    const expired = new Date(Date.now() - 1 * 3600000);
    return this.passwordResetToken.deleteMany({ where: { expiresAt: { lt: expired } } });
  }
}
