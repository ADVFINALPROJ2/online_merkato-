import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  // Create a notification (used internally by other services)
  async create(userId: string, message: string) {
    return this.prisma.notification.create({
      data: { userId, message },
    });
  }

  // #43 - Notify buyer of a delivery status update
  async notifyDeliveryUpdate(buyerId: string, orderId: string, status: string) {
    const message = `Your order #${orderId} delivery status changed to: ${status}`;
    return this.create(buyerId, message);
  }

  // Get all notifications for a user
  async getMyNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Mark a notification as read
  async markAsRead(userId: string, notificationId: string) {
    const notif = await this.prisma.notification.findUnique({ where: { id: notificationId } });
    if (!notif) throw new NotFoundException('Notification not found');
    if (notif.userId !== userId) throw new ForbiddenException();

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  // Mark all as read
  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}