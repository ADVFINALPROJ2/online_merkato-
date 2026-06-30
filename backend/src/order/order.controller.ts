import { Controller, Post, Body, UseGuards, Get, Param, Patch } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 
import { GetUser } from '../auth/get-user.decorator';
@Controller('order')
@UseGuards(JwtAuthGuard) // 👈 Apply to the whole controller
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  async placeOrder(@GetUser() user: any, @Body() dto: CreateOrderDto) {
    return this.orderService.placeOrder(user.id, dto);
  }

  @Patch(':id/cancel')
  async cancelOrder(@GetUser() user: any, @Param('id') id: string) {
    return this.orderService.cancelOrder(user.id, id);
  }

  @Get('history')
  async getOrderHistory(@GetUser() user: any) {
    return this.orderService.getOrderHistory(user.id);
  }
}