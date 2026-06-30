import { OrderStatus } from '@prisma/client'; // Import the enum
import { Controller, Post, Body, Headers, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChapaProvider } from '../payment/chapa.provider';
import { NotificationsGateway } from '../notification/notifications.gateway';

@Controller('order/webhook')
export class OrderWebhookController {
  constructor(
    private prisma: PrismaService,
    private chapaProvider: ChapaProvider,
    private notificationsGateway: NotificationsGateway,
  ) {}

  @Post()
  async handleChapaWebhook(
    @Body() body: any,
    @Headers('chapa-signature') signature: string, // Chapa sends a signature to verify the request
  ) {
    // 1. Verify the transaction with Chapa
    const txRef = body.tx_ref;
    const verification = await this.chapaProvider.verify(txRef);

    if (!verification.success) {
      throw new BadRequestException('Invalid transaction');
    }

    // 2. Update order status to CONFIRMED (paid)
    const order = await this.prisma.order.update({
      where: { id: txRef.split('-')[2] }, // Assuming your txRef contains the order ID
      data: { status: OrderStatus.CONFIRMED, paymentStatus: 'PAID' },
    });

    // 3. Real-time notification to the buyer (sellerId not on Order model)
    this.notificationsGateway.sendNotification(order.buyerId, 'new_order', {
      message: `💰 Payment confirmed for Order #${order.id}. You can now process the delivery!`,
      orderId: order.id,
    });

    return { status: 'success' };
  }
}