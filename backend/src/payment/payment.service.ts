import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChapaProvider } from './chapa.provider';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private chapa: ChapaProvider,
  ) {}

  // #33 Select Payment Method (set/update method on an order)
  async selectPaymentMethod(buyerId: string, orderId: string, method: 'CASH' | 'CHAPA') {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.buyerId !== buyerId) throw new ForbiddenException();

    return this.prisma.order.update({
      where: { id: orderId },
      data: { paymentMethod: method },
    });
  }

  // #34 Payment Integration - initialize Chapa checkout
  async initiatePayment(buyerId: string, orderId: string, email: string, firstName: string, lastName: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.buyerId !== buyerId) throw new ForbiddenException();
    if (order.paymentMethod !== 'CHAPA') {
      throw new BadRequestException('Order payment method is not CHAPA');
    }
    if (order.paymentStatus === 'PAID') {
      throw new BadRequestException('Order is already paid');
    }

    const txRef = `order-${order.id}-${Date.now()}`;

    const result = await this.chapa.initialize({
      amount: order.totalAmount,
      email,
      firstName,
      lastName,
      txRef,
      returnUrl: 'http://localhost:3000/payment/success',
    });

    if (result.status !== 'success') {
      throw new BadRequestException('Failed to initialize payment');
    }

    // create or update Payment record
    await this.prisma.payment.upsert({
      where: { orderId: order.id },
      create: {
        orderId: order.id,
        amount: order.totalAmount,
        method: 'CHAPA',
        status: 'UNPAID',
        chapaRef: txRef,
      },
      update: {
        chapaRef: txRef,
        status: 'UNPAID',
      },
    });

    return {
      checkoutUrl: result.data.checkout_url,
      txRef,
    };
  }

  // Verify and mark order as paid (called from callback)
  async verifyPayment(txRef: string) {
    const payment = await this.prisma.payment.findFirst({ where: { chapaRef: txRef } });
    if (!payment) throw new NotFoundException('Payment record not found');

    const result = await this.chapa.verify(txRef);

    if (result.status === 'success' && result.data?.status === 'success') {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'PAID' },
      });

      await this.prisma.order.update({
        where: { id: payment.orderId },
        data: { paymentStatus: 'PAID', status: 'CONFIRMED' },
      });

      return { verified: true };
    }

    return { verified: false };
  }
}