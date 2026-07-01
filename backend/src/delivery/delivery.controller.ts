import {
  Controller, Get, Patch, Post, Param, Body, UseGuards, Query,
} from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { AssignmentService } from './assignment.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('delivery')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DeliveryController {
  constructor(
    private readonly deliveryService: DeliveryService,
    private readonly assignmentService: AssignmentService,
  ) {}

  @Get('orders')
  @Roles('DRIVER', 'DELIVERY')
  async getMyOrders(@CurrentUser() user: any) {
    return this.deliveryService.getDriverOrders(user.id);
  }

  @Get('orders/:id')
  @Roles('DRIVER', 'DELIVERY')
  async getOrderDetails(@Param('id') id: string) {
    return this.deliveryService.getOrderDetails(id);
  }

  @Patch('orders/:id/accept')
  @Roles('DRIVER', 'DELIVERY')
  async acceptOrder(@Param('id') id: string) {
    return this.deliveryService.acceptOrder(id);
  }

  @Patch('orders/:id/pickup')
  @Roles('DRIVER', 'DELIVERY')
  async pickUpOrder(@Param('id') id: string) {
    return this.deliveryService.pickUpOrder(id);
  }

  @Patch('orders/:id/out-for-delivery')
  @Roles('DRIVER', 'DELIVERY')
  async outForDelivery(@Param('id') id: string) {
    return this.deliveryService.outForDelivery(id);
  }

  @Patch('orders/:id/complete')
  @Roles('DRIVER', 'DELIVERY')
  async completeOrder(@Param('id') id: string) {
    return this.deliveryService.completeOrder(id);
  }

  @Get('drivers/available')
  @Roles('ADMIN', 'SELLER')
  async getAvailableDrivers() {
    return this.assignmentService.getAvailableDrivers();
  }

  @Post('assign')
  @Roles('ADMIN', 'SELLER')
  async assignDriver(
    @Body() body: { orderId: string; driverUserId: string },
  ) {
    return this.assignmentService.assignToOrder(body.orderId, body.driverUserId);
  }

  @Get('seller/orders')
  @Roles('SELLER')
  async getSellerDeliveries(@CurrentUser() user: any) {
    return this.deliveryService.getSellerDeliveries(user.id);
  }

  @Get('buyer/orders')
  @Roles('BUYER')
  async getBuyerDeliveries(@CurrentUser() user: any) {
    return this.deliveryService.getBuyerDeliveries(user.id);
  }

  @Get('track/:orderId')
  @Roles('BUYER', 'SELLER', 'ADMIN')
  async trackDelivery(@Param('orderId') orderId: string) {
    return this.deliveryService.trackDelivery(orderId);
  }
}
