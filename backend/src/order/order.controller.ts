import { Controller, Post, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  placeOrder(@CurrentUser() user: any, @Body() dto: CreateOrderDto) {
    return this.orderService.placeOrder(user.id, dto);
  }

  @Patch(':id/cancel')
  cancelOrder(@CurrentUser() user: any, @Param('id') id: string) {
    return this.orderService.cancelOrder(user.id, id);
  }

  @Get(':id/track')
  trackOrder(@CurrentUser() user: any, @Param('id') id: string) {
    return this.orderService.trackOrder(user.id, id);
  }

  @Get()
  getOrderHistory(@CurrentUser() user: any) {
    return this.orderService.getOrderHistory(user.id);
  }

  @Patch(':id/confirm-delivery')
  confirmDelivery(@CurrentUser() user: any, @Param('id') id: string) {
    return this.orderService.confirmDelivery(user.id, id);
  }
}